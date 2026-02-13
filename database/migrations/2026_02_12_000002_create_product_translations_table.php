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
        Schema::create('product_translations', function (Blueprint $table) {
            $table->id('product_translations_id');
            $table->unsignedBigInteger('products_id');
            $table->string('product_name', 200);
            $table->text('product_description');
            $table->string('product_meta_title', 100);
            $table->string('product_meta_description', 200);
            $table->string('language_code', 5);

            // Indexes
            $table->index('products_id');
            $table->index('language_code');
            $table->unique(['products_id', 'language_code'], 'unique_product_language');

            // Foreign key constraint
            $table->foreign('products_id')
                  ->references('products_id')
                  ->on('products')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_translations');
    }
};
