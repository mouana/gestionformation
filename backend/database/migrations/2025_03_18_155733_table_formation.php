<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->string('statut'); 
            $table->foreignId('responsable_cdc_id')->constrained('compte_utilisateurs')->onDelete('cascade');
            $table->foreignId('responsable_dr_id')->nullable()->constrained('compte_utilisateurs')->onDelete('set null');
            $table->timestamp('date_validation')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('formations');
    }
};