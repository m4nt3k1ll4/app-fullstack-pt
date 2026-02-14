<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class QueryHelper
{
    /**
     * Aplica un filtro LIKE a múltiples columnas con OR.
     *
     * @param Builder $query
     * @param string $term
     * @param array $columns Columnas donde buscar
     * @return Builder
     */
    public static function applySearch(Builder $query, string $term, array $columns): Builder
    {
        return $query->where(function (Builder $q) use ($term, $columns) {
            foreach ($columns as $i => $column) {
                $method = $i === 0 ? 'where' : 'orWhere';
                $q->$method($column, 'like', '%' . $term . '%');
            }
        });
    }

    /**
     * Aplica paginación usando el valor de 'per_page' del array de filtros.
     *
     * @param Builder $query
     * @param array $filters
     * @param int $default Cantidad por defecto
     * @return LengthAwarePaginator
     */
    public static function paginate(Builder $query, array $filters, int $default = 15): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? $default;

        return $query->paginate($perPage);
    }

    /**
     * Aplica filtro de rango numérico (min/max) a una columna.
     *
     * @param Builder $query
     * @param array $filters
     * @param string $column
     * @param string $minKey Clave del filtro para valor mínimo
     * @param string $maxKey Clave del filtro para valor máximo
     * @return Builder
     */
    public static function applyRange(
        Builder $query,
        array $filters,
        string $column,
        string $minKey = 'min_price',
        string $maxKey = 'max_price'
    ): Builder {
        if (!empty($filters[$minKey])) {
            $query->where($column, '>=', $filters[$minKey]);
        }

        if (!empty($filters[$maxKey])) {
            $query->where($column, '<=', $filters[$maxKey]);
        }

        return $query;
    }
}
