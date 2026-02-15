<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateStockRequest extends FormRequest
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
            'product_id' => 'required|integer|exists:products,id|unique:stocks,product_id',
            'stock' => 'required|integer|min:0',
            'unit_value' => 'required|numeric|min:0|max:999999.99',
            'sale_value' => 'required|numeric|min:0|max:999999.99',
        ];
    }

    /**
     * Mensajes de error personalizados
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'El ID del producto es obligatorio.',
            'product_id.integer' => 'El ID del producto debe ser un número entero.',
            'product_id.exists' => 'El producto especificado no existe.',
            'product_id.unique' => 'Este producto ya tiene un registro de stock.',
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
