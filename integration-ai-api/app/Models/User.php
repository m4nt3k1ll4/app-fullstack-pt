<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_approved',
        'api_key',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'api_key',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_approved' => 'boolean',
            'password' => 'hashed',
        ];
    }

    /**
     * Los roles del usuario
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Verifica si el usuario es administrador.
     * Usa la colección cargada si los roles ya fueron eager-loaded,
     * evitando queries adicionales (N+1).
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->contains('name', 'admin');
        }

        return $this->roles()->where('name', 'admin')->exists();
    }

    /**
     * Verifica si el usuario es cliente
     *
     * @return bool
     */
    public function isClient(): bool
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->contains('name', 'client');
        }

        return $this->roles()->where('name', 'client')->exists();
    }

    /**
     * Verifica si el usuario tiene un rol específico.
     * Aprovecha la relación cargada para evitar queries extra.
     *
     * @param string $roleName
     * @return bool
     */
    public function hasRole(string $roleName): bool
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->contains('name', $roleName);
        }

        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Asigna un rol al usuario
     *
     * @param string|int $role
     * @return void
     */
    public function assignRole(string|int $role): void
    {
        if (is_string($role)) {
            $roleModel = Role::where('name', $role)->first();
            if ($roleModel) {
                $this->roles()->syncWithoutDetaching([$roleModel->id]);
            }
        } else {
            $this->roles()->syncWithoutDetaching([$role]);
        }
    }
}
