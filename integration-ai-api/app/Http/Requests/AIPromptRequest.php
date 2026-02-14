<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AIPromptRequest extends FormRequest
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
            'prompt' => 'required|string|max:4000',
            'model' => 'nullable|string|in:gemini-1.5-pro,gemini-1.5-flash',
            'max_tokens' => 'nullable|integer|min:1|max:8000',
            'temperature' => 'nullable|numeric|min:0|max:1',
        ];
    }

    /**
     * Mensajes de error personalizados
     */
    public function messages(): array
    {
        return [
            'prompt.required' => 'El prompt es obligatorio.',
            'prompt.max' => 'El prompt no puede exceder 4000 caracteres.',
            'model.in' => 'El modelo debe ser gemini-1.5-pro o gemini-1.5-flash.',
            'max_tokens.min' => 'El valor de max_tokens debe ser al menos 1.',
            'max_tokens.max' => 'El valor de max_tokens no puede exceder 8000.',
            'temperature.min' => 'La temperatura debe ser al menos 0.',
            'temperature.max' => 'La temperatura no puede exceder 1.',
        ];
    }
}
