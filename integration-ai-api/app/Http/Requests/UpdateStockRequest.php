<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockRequest extends FormRequest
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
            'stock' => 'sometimes|required|integer|min:0',
            'unit_value' => 'sometimes|required|numeric|min:0|max:999999.99',
            'sale_value' => 'sometimes|required|numeric|min:0|max:999999.99',
        ];
    }

    /**
     * Mensajes de error personalizados
     */
    public function messages(): array
    {
        return [
            'stock.required' => 'La cantidad en stock es obligatoria.',
            'stock.integer' => 'La cantidad en stock debe ser un número entero.',
            'stock.min' => 'La cantidad en stock no puede ser negativa.',
            'unit_value.required' => 'El valor unitario es obligatorio.',
            'unit_value.numeric' => 'El valor unitario debe ser un número válido.',
            'unit_value.min' => 'El valor unitario no puede ser negativo.',
            'unit_value.max' => 'El valor unitario no puede exceder 999,999.99.',
            'sale_value.required' => 'El valor de venta es obligatorio.',
            'sale_value.numeric' => 'El valor de venta debe ser un número válido.',
            'sale_value.min' => 'El valor de venta no puede ser negativo.',
            'sale_value.max' => 'El valor de venta no puede exceder 999,999.99.',
        ];
    }
}
