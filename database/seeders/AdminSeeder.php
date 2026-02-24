<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $password = 'admin123';

        Admin::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make($password),
            ]
        );

        $this->command->info('✅ Admin seeded successfully!');
        $this->command->line('   Email   : admin@admin.com');
        $this->command->line('   Password: ' . $password);
    }
}
