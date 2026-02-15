<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrador con acceso completo al sistema',
            ],
            [
                'name' => 'client',
                'description' => 'Cliente con acceso limitado a funcionalidades básicas',
            ],
            [
                'name' => 'interviewer',
                'description' => 'Entrevistador con acceso completo al sistema para pruebas',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['name' => $role['name']],
                ['description' => $role['description']]
            );
        }
    }
}
