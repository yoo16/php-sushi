<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 50)->unique();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 100);
            $table->unsignedInteger('price');
            $table->string('image_path')->default('');
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('seats', function (Blueprint $table): void {
            $table->id();
            $table->integer('number')->unique();
            $table->timestamps();
        });

        Schema::create('visits', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('seat_id')->constrained('seats')->cascadeOnDelete();
            $table->string('status', 16)->default('seated');
            $table->unsignedInteger('total')->default(0);
            $table->unsignedInteger('total_with_tax')->default(0);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('visit_id')->constrained('visits')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->integer('quantity')->default(1);
            $table->integer('price');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('visits');
        Schema::dropIfExists('seats');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
