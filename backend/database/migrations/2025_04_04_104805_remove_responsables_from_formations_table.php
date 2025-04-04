<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('formations', function (Blueprint $table) {
            // Supprime les colonnes (et les clés étrangères associées)
            if (Schema::hasColumn('formations', 'responsable_cdc_id')) {
                $table->dropColumn('responsable_cdc_id');
            }
            if (Schema::hasColumn('formations', 'responsable_dr_id')) {
                $table->dropColumn('responsable_dr_id');
            }
        });
    }

    public function down() {
        Schema::table('formations', function (Blueprint $table) {
            $table->foreignId('responsable_cdc_id')->nullable()->constrained('utilisateurs')->onDelete('set null');
            $table->foreignId('responsable_dr_id')->nullable()->constrained('utilisateurs')->onDelete('set null');
        });
    }
};
