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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique()->comment('Setting key (e.g., seo.default_title)');
            $table->text('value')->nullable()->comment('Setting value');
            $table->enum('type', ['string', 'text', 'json', 'boolean', 'integer'])->default('string')->comment('Data type for casting');
            $table->string('group', 50)->nullable()->comment('Setting group (e.g., seo, social, company)');
            $table->text('description')->nullable()->comment('Human-readable description');
            $table->timestamps();

            // Indexes for faster queries
            $table->index('group');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
