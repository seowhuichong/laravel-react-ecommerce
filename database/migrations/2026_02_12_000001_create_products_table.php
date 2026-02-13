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
        Schema::create('products', function (Blueprint $table) {
            $table->id('products_id');
            $table->string('product_sku', 100);
            $table->string('product_barcode', 100);
            $table->string('product_vendor', 100);
            $table->decimal('product_price', 15, 2);
            $table->decimal('product_retail_price', 15, 2);
            $table->decimal('product_weight', 15, 4);
            $table->string('product_image', 200)->nullable();
            $table->string('product_status', 20)->default('Active');
            $table->string('product_friendly_url', 150)->unique();
            $table->timestamps();

            // Indexes
            $table->index('product_sku');
            $table->index('product_barcode');
            $table->index('product_friendly_url');
            $table->index('product_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
