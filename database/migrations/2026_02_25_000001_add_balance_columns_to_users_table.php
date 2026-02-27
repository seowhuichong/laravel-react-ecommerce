<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('points_balance')->default(0)->after('date_of_birth');
            $table->decimal('credits_balance', 10, 2)->default(0)->after('points_balance');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['points_balance', 'credits_balance']);
        });
    }
};
