<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** POST /api/register */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required'      => 'Le nom est obligatoire.',
            'email.required'     => "L'email est obligatoire.",
            'email.unique'       => 'Cet email est déjà utilisé.',
            'password.required'  => 'Le mot de passe est obligatoire.',
            'password.min'       => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'Les mots de passe ne correspondent pas.',
        ]);

        $user  = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie !',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    /** POST /api/login */
    public function login(Request $request)
{
    $validated = $request->validate([
        'email'    => 'required|string|email',
        'password' => 'required|string',
    ]);

    // Vérifier si l'utilisateur existe
    $user = User::where('email', $validated['email'])->first();

    if (!$user) {
        return response()->json([
            'message' => 'Utilisateur inexistant. Veuillez vous inscrire.',
            'errors'  => ['email' => ['Utilisateur inexistant. Veuillez vous inscrire.']],
        ], 404);
    }

    // Vérifier le mot de passe
    if (!Auth::attempt($validated)) {
        return response()->json([
            'message' => 'Mot de passe incorrect.',
            'errors'  => ['password' => ['Mot de passe incorrect.']],
        ], 401);
    }

    $user = Auth::user();
    $user->tokens()->delete();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Connexion réussie !',
        'user'    => $user,
        'token'   => $token,
    ]);
}

    /** POST /api/logout */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    /** GET /api/user */
    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    /** PUT /api/user/password — Changer le mot de passe */
    public function changePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required|string',
        'password'         => 'required|string|min:8|confirmed',
    ]);

    $user = $request->user();

    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json([
            'message' => 'Le mot de passe actuel est incorrect.',
            'errors'  => ['current_password' => ['Le mot de passe actuel est incorrect.']],
        ], 422);
    }

    // ← Vérifier que le nouveau est différent
    if (Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Le nouveau mot de passe doit être différent.',
            'errors'  => ['password' => ['Le nouveau mot de passe doit être différent de l\'ancien.']],
        ], 422);
    }

    $user->update(['password' => Hash::make($request->password)]);
    $user->tokens()->delete();
    $newToken = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Mot de passe modifié avec succès !',
        'token'   => $newToken,
    ]);
}

    /** DELETE /api/user — Supprimer le compte */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ], [
            'password.required' => 'Le mot de passe est obligatoire pour confirmer la suppression.',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Mot de passe incorrect.',
                'errors'  => ['password' => ['Mot de passe incorrect.']],
            ], 422);
        }

        // Supprime l'utilisateur (cascade → notes + tags + tokens)
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Compte supprimé avec succès.']);
    }

    /** GET /api/tags — Tags de l'utilisateur */
    public function tags(Request $request)
    {
        $tags = $request->user()->tags()->withCount('notes')->get();
        return response()->json(['tags' => $tags]);
    }
}
