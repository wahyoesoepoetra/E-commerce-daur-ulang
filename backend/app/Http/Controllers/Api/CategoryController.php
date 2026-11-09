<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Category::query()
                ->select('category_id', 'category')
                ->orderBy('category_id')
                ->get(),
        ]);
    }
}
