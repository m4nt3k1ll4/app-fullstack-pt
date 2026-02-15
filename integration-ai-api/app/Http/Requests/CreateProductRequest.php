<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para hacer esta petición
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación que se aplican a la petición
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'features' => 'nullable|string|max:500',
            'price' => 'nullable|numeric|min:0|max:999999.99',
            'ai_description' => 'nullable|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'required|url|max:2048',
        ];
    }

    /**
     * Mensajes de error personalizados
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'features.max' => 'Las características no pueden exceder 500 caracteres.',
            'price.numeric' => 'El precio debe ser un número válido.',
            'price.min' => 'El precio debe ser mayor o igual a 0.',
            'price.max' => 'El precio no puede exceder 999,999.99.',
            'images.array' => 'Las imágenes deben ser un array de URLs.',
            'images.max' => 'No se permiten más de 5 imágenes.',
            'images.*.url' => 'Cada imagen debe ser una URL válida.',
            'images.*.max' => 'Cada URL de imagen no puede exceder 2048 caracteres.',
        ];
    }
}
