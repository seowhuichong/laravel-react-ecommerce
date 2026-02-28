<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('products_id');
            $table->unsignedBigInteger('category_id');

            $table->primary(['products_id', 'category_id']);

            $table->foreign('products_id')
                ->references('products_id')
                ->on('products')
                ->onDelete('cascade');

            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_categories');
    }
};
