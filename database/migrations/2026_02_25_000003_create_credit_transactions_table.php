<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // topup     = customer topped up money
            // refund    = order refund credited to wallet
            // deduction = credits used to pay for order
            // adjust    = manual admin adjustment
            $table->enum('type', ['topup', 'refund', 'deduction', 'adjust']);

            // positive for topup/refund/adjust-up, negative for deduction/adjust-down
            $table->decimal('amount', 10, 2);

            // running balance after this transaction
            $table->decimal('balance_after', 10, 2)->default(0);

            // polymorphic-style reference
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->index(['reference_type', 'reference_id']);

            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_transactions');
    }
};
