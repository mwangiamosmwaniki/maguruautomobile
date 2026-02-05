<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo admin user
        User::firstOrCreate(
            ['email' => 'admin@maguraauto.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
            ]
        );

        // Create additional demo user
        User::firstOrCreate(
            ['email' => 'manager@maguraauto.com'],
            [
                'name' => 'Manager',
                'password' => Hash::make('manager123'),
            ]
        );

        $this->call([
            CarSeeder::class,
        ]);
    }
}