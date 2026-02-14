<?php

namespace App\Services;

use App\Models\Products;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    /**
     * Obtiene todos los productos con paginación
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Products::query()->latest();

        // Filtro por nombre
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // Filtro por rango de precio
        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    /**
     * Busca un producto por ID
     *
     * @param string $id
     * @return Products
     */
    public function findById(string $id): Products
    {
        return Products::findOrFail($id);
    }

    /**
     * Crea un nuevo producto
     *
     * @param array $data
     * @return Products
     */
    public function create(array $data): Products
    {
        return Products::create([
            'name' => $data['name'],
            'features' => $data['features'] ?? null,
            'price' => $data['price'] ?? null,
            'ai_description' => $data['ai_description'] ?? null,
        ]);
    }

    /**
     * Actualiza un producto existente
     *
     * @param string $id
     * @param array $data
     * @return Products
     */
    public function update(string $id, array $data): Products
    {
        $product = $this->findById($id);

        $product->update([
            'name' => $data['name'] ?? $product->name,
            'features' => $data['features'] ?? $product->features,
            'price' => $data['price'] ?? $product->price,
            'ai_description' => $data['ai_description'] ?? $product->ai_description,
        ]);

        return $product->fresh();
    }

    /**
     * Elimina un producto
     *
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        $product = $this->findById($id);
        return $product->delete();
    }

    /**
     * Genera descripción con IA para un producto
     *
     * @param string $id
     * @param AIService $aiService
     * @return Products
     */
    public function generateAIDescription(string $id, AIService $aiService): Products
    {
        $product = $this->findById($id);

        // Crear prompt basado en los datos del producto
        $prompt = "Genera una descripción de marketing atractiva y profesional para el siguiente producto:\n\n";
        $prompt .= "Nombre: {$product->name}\n";

        if ($product->features) {
            $prompt .= "Características: {$product->features}\n";
        }

        if ($product->price) {
            $prompt .= "Precio: \${$product->price}\n";
        }

        $prompt .= "\nGenera una descripción persuasiva de 2-3 párrafos que resalte los beneficios del producto.";

        // Procesar con IA
        $result = $aiService->processPrompt($prompt, [
            'model' => 'gemini-1.5-pro',
            'max_tokens' => 300,
            'temperature' => 0.7,
        ]);

        if ($result['success']) {
            $product->ai_description = $result['response'];
            $product->save();
        }

        return $product->fresh();
    }

    /**
     * Busca productos por nombre o características
     *
     * @param string $term
     * @return Collection
     */
    public function search(string $term): Collection
    {
        return Products::where('name', 'like', "%{$term}%")
            ->orWhere('features', 'like', "%{$term}%")
            ->orWhere('ai_description', 'like', "%{$term}%")
            ->get();
    }
}
