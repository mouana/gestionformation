<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('responsable_cdc', function (Blueprint $table) {
            $table->id();
            $table->string('filiere');

            $table->string('region');
            $table->enum('role', ['responsable_cdc'])->default('responsable_cdc');
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('responsable_cdc');
    }
};