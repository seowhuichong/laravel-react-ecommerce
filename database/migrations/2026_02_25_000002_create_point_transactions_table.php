<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // earn   = purchased order
            // redeem = used points on order
            // expire = points expired
            // adjust = manual admin adjustment
            $table->enum('type', ['earn', 'redeem', 'expire', 'adjust']);

            // positive for earn/adjust-up, negative for redeem/expire/adjust-down
            $table->integer('points');

            // running balance after this transaction
            $table->unsignedInteger('balance_after')->default(0);

            // polymorphic-style reference (e.g. type="order", id=42)
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->index(['reference_type', 'reference_id']);

            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('point_transactions');
    }
};
