<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->foreignId('category_id')
                ->constrained('categories', 'category_id')
                ->cascadeOnDelete();
            $table->decimal('price', 12, 2);
            $table->string('img')->nullable();
            $table->integer('stock')->default(0);
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};