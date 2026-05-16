<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categoryId = (int) $request->query('category_id', 0);

        $query = Product::query()->orderBy('id');

        if ($categoryId > 0) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $products,
            'products' => $products,
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
