<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
        ]);

        $user->assignRole('admin');

          $user = User::factory()->create([
            'name' => 'member',
            'email' => 'member@member.com',
            'password' => Hash::make('member123'),
        ]);

        $user->assignRole('member');

        $this->call([
            MenuSeeder::class,
        ]);
    }
}
