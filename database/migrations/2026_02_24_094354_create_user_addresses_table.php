<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id('address_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('address_label', 50)->default('Home'); // e.g. Home, Office, Other
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 30);
            $table->string('address_line1', 255);
            $table->string('address_line2', 255)->nullable();
            $table->string('city', 100);
            $table->string('state', 100);
            $table->string('postcode', 20);
            $table->string('country', 100)->default('Malaysia');
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
