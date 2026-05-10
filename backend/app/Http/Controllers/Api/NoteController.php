<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Tag;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * GET /api/notes?page=1&tag=&search=
     */
    public function index(Request $request)
    {
        $query = $request->user()->notes()->with('tags');

        if ($request->filled('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('name', $request->tag));
        }

        // Tri côté backend
        $sort = $request->get('sort', 'recent');
        $query->orderBy('is_pinned', 'desc'); // épinglées toujours en premier

        match($sort) {
            'az'       => $query->orderBy('title', 'asc'),
            'za'       => $query->orderBy('title', 'desc'),
            'priority' => $query->orderByRaw("FIELD(priority, 'haute', 'moyenne', 'basse')"),
            default    => $query->orderBy('updated_at', 'desc'),
        };
        // Pagination 12 par page
        $paginated = $query->paginate(12);

        // Stats globales
        $allNotes = $request->user()->notes();
        $stats = [
            'total'   => $allNotes->count(),
            'haute'   => (clone $allNotes)->where('priority', 'haute')->count(),
            'moyenne' => (clone $allNotes)->where('priority', 'moyenne')->count(),
            'basse'   => (clone $allNotes)->where('priority', 'basse')->count(),
            'pinned'  => (clone $allNotes)->where('is_pinned', true)->count(),
        ];

        return response()->json([
            'notes' => $paginated->items(),
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * POST /api/notes
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'content'  => 'required|string',
            'priority' => 'required|in:basse,moyenne,haute',
            'color'    => 'nullable|string|max:20',
            'is_pinned'=> 'nullable|boolean',
            'tags'     => 'nullable|array',
            'tags.*'   => 'string|max:50',
        ]);

        $note = $request->user()->notes()->create([
            'title'     => $validated['title'],
            'content'   => $validated['content'],
            'priority'  => $validated['priority'],
            'color'     => $validated['color'] ?? '#ffffff',
            'is_pinned' => $validated['is_pinned'] ?? false,
        ]);

        if (!empty($validated['tags'])) {
            $tagIds = $this->syncTags($request->user()->id, $validated['tags']);
            $note->tags()->sync($tagIds);
        }

        return response()->json([
            'message' => 'Note créée avec succès !',
            'note'    => $note->load('tags'),
        ], 201);
    }

    /**
     * PUT /api/notes/{id}
     */
    public function update(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);

        $validated = $request->validate([
            'title'    => 'sometimes|required|string|max:255',
            'content'  => 'sometimes|required|string',
            'priority' => 'sometimes|required|in:basse,moyenne,haute',
            'color'    => 'nullable|string|max:20',
            'is_pinned'=> 'nullable|boolean',
            'tags'     => 'nullable|array',
            'tags.*'   => 'string|max:50',
        ]);

        $note->update(collect($validated)->except('tags')->filter(fn($v) => !is_null($v))->toArray());

        if (isset($validated['tags'])) {
            $tagIds = $this->syncTags($request->user()->id, $validated['tags']);
            $note->tags()->sync($tagIds);
        }

        return response()->json([
            'message' => 'Note mise à jour !',
            'note'    => $note->fresh()->load('tags'),
        ]);
    }

    /**
     * DELETE /api/notes/{id}
     */
    public function destroy(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);
        $note->delete();
        return response()->json(['message' => 'Note supprimée.']);
    }

    /**
     * PATCH /api/notes/{id}/pin
     */
    public function togglePin(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);
        $note->update(['is_pinned' => !$note->is_pinned]);
        return response()->json([
            'message'   => $note->is_pinned ? 'Note épinglée.' : 'Note désépinglée.',
            'is_pinned' => $note->is_pinned,
        ]);
    }

    /**
     * GET /api/stats
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        $weekly = $user->notes()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(6))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'total'       => $user->notes()->count(),
            'pinned'      => $user->notes()->where('is_pinned', true)->count(),
            'today'       => $user->notes()->whereDate('updated_at', today())->count(),
            'tags_count'  => $user->tags()->count(),
            'by_priority' => [
                'haute'   => $user->notes()->where('priority', 'haute')->count(),
                'moyenne' => $user->notes()->where('priority', 'moyenne')->count(),
                'basse'   => $user->notes()->where('priority', 'basse')->count(),
            ],
            'weekly' => $weekly,
        ]);
    }

    private function syncTags(int $userId, array $tagNames): array
    {
        return collect($tagNames)->map(fn($name) =>
            Tag::firstOrCreate(
                ['user_id' => $userId, 'name' => trim($name)],
                ['color' => '#6366f1']
            )->id
        )->toArray();
    }
}
