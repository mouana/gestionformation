<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('cours', function (Blueprint $table) {
            $table->string('titre')->after('id'); // Ajoute la colonne après l'id
        });
    }

    public function down(): void {
        Schema::table('cours', function (Blueprint $table) {
            $table->dropColumn('titre');
        });
    }
};
