<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Création de la table notes.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();

            // Clé étrangère vers users — suppression en cascade
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->string('title');
            $table->text('content');

            // Priorité : basse | moyenne | haute (défaut : basse)
            $table->enum('priority', ['basse', 'moyenne', 'haute'])
                  ->default('basse');
              // Nouvelle couleur
            $table->string('color')
                  ->default('#ffffff');

            // Note épinglée ou non
            $table->boolean('is_pinned')
                  ->default(false);     

            $table->timestamps(); // created_at + updated_at
        });
    }

    /**
     * Suppression de la table notes.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
