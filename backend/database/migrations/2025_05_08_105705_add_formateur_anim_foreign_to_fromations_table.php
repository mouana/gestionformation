<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('formations', function (Blueprint $table) {
        if (!Schema::hasColumn('formations', 'animateur_id')) {
            $table->unsignedBigInteger('animateur_id')->nullable();
        }
    });

    // Add the foreign key constraint separately
    Schema::table('formations', function (Blueprint $table) {
        $table->foreign('animateur_id')
              ->references('id')
              ->on('formateurs_animateurs')
              ->onDelete('cascade');
    });
    Schema::table('formations', function (Blueprint $table) {
        $table->foreign('animateur_id')
              ->references('id')
              ->on('formateurs_animateurs')
              ->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropForeign(['animateur_id']);
            $table->dropColumn('animateur_id');
        });
    }
    
};