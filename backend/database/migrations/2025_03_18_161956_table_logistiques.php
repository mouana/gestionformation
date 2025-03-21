<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('logistiques', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->integer('quantite')->default(1);
            $table->foreignId('cour_id')->constrained('cours')->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('logistiques');
    }
};