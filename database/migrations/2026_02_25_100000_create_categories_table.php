<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable()->default(null);
            $table->string('slug', 150)->unique();
            $table->string('image', 255)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('parent_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');

            $table->index('parent_id');
            $table->index('is_active');
            $table->index('sort_order');
        });

        Schema::create('category_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->string('language_code', 10); // e.g. en-MY, ms-MY, zh-CN
            $table->string('name', 200);
            $table->timestamps();

            $table->unique(['category_id', 'language_code'], 'unique_cat_lang');
            $table->index('language_code');

            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_translations');
        Schema::dropIfExists('categories');
    }
};
