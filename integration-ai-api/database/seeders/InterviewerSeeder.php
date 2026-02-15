<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InterviewerSeeder extends Seeder
{
    /**
     * Crea un usuario entrevistador de prueba.
     *
     * Uso: php artisan db:seed --class=InterviewerSeeder
     */
    public function run(): void
    {
        // Asegurar que el rol existe
        $role = Role::firstOrCreate(
            ['name' => 'interviewer'],
            ['description' => 'Entrevistador con acceso completo al sistema para pruebas']
        );

        // Crear o actualizar el usuario entrevistador
        $user = User::updateOrCreate(
            ['email' => 'interviewer@test.com'],
            [
                'name' => 'Entrevistador',
                'password' => Hash::make('password123'),
                'is_approved' => true,
            ]
        );

        // Asignar rol interviewer (sync para evitar duplicados)
        $user->roles()->sync([$role->id]);

        $this->command->info("✅ Usuario entrevistador creado:");
        $this->command->info("   Email: interviewer@test.com");
        $this->command->info("   Password: password123");
        $this->command->info("   Rol: interviewer");
    }
}
