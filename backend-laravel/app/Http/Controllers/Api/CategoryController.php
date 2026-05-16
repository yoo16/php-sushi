<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'categories' => Category::query()->orderBy('id')->get(),
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
