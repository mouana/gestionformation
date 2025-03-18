<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('formateur_participant_session', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formateur_participant_id')->constrained('compte_utilisateurs')->onDelete('cascade');
            $table->foreignId('session_id')->constrained('sessions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('formateur_participant_session');
    }
};