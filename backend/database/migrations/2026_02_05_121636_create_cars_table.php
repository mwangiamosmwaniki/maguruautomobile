<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->integer('mileage')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('transmission');
            $table->string('fuel_type');
            $table->string('body_type');
            $table->string('color');
            $table->integer('engine_cc')->nullable();
            $table->string('condition');
            $table->string('status')->default('Available');
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};