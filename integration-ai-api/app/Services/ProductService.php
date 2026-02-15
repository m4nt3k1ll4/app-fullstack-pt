<?php

namespace App\Services;

use App\Helpers\JsonHelper;
use App\Helpers\QueryHelper;
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

        if (!empty($filters['search'])) {
            QueryHelper::applySearch($query, $filters['search'], ['name']);
        }

        QueryHelper::applyRange($query, $filters, 'price');

        return QueryHelper::paginate($query, $filters);
    }

    /**
     * Busca un producto por ID
     *
     * @param int $id
     * @return Products
     */
    public function findById(int $id): Products
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
            'images' => $data['images'] ?? null,
        ]);
    }

    /**
     * Actualiza un producto existente
     *
     * @param int $id
     * @param array $data
     * @return Products
     */
    public function update(int $id, array $data): Products
    {
        $product = $this->findById($id);

        $product->update([
            'name' => $data['name'] ?? $product->name,
            'features' => $data['features'] ?? $product->features,
            'price' => $data['price'] ?? $product->price,
            'ai_description' => $data['ai_description'] ?? $product->ai_description,
            'images' => $data['images'] ?? $product->images,
        ]);

        return $product->fresh();
    }

    /**
     * Elimina un producto
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $product = $this->findById($id);
        return $product->delete();
    }

    /**
     * Genera descripción con IA para un producto
     *
     * @param int $id
     * @param AIService $aiService
     * @return Products
     */
    public function generateAIDescription(int $id, AIService $aiService): Products
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
        $prompt .= "\n\nDevuelve la respuesta en formato JSON con esta estructura: {\"description\": \"tu descripción aquí\"}";

        // Procesar con IA
        $result = $aiService->processPrompt($prompt, [
            'model' => 'gemini-2.5-flash',
            'max_tokens' => 300,
            'temperature' => 0.7,
        ]);

        if ($result['success']) {
            $product->ai_description = JsonHelper::extractOrFallback(
                $result['response'],
                'description'
            );
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
        $query = Products::query()->latest();
        QueryHelper::applySearch($query, $term, ['name', 'features', 'ai_description']);

        return $query->get();
    }
}
