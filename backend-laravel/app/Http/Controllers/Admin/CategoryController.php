<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class CategoryController extends Controller
{
    public function index(): View
    {
        return view('admin.category.index', [
            'categories' => Category::query()->orderBy('id')->get(),
        ]);
    }

    public function create(): View
    {
        return view('admin.category.create', [
            'nextSortOrder' => ((int) Category::query()->max('sort_order')) + 1,
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::query()->create($request->validated());

        return redirect('/admin/category/');
    }

    public function edit(): View|RedirectResponse
    {
        $category = Category::query()->find(request()->integer('id'));

        if ($category === null) {
            return redirect('/admin/category/');
        }

        return view('admin.category.edit', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request): RedirectResponse
    {
        $category = Category::query()->findOrFail($request->integer('id'));
        $category->update($request->safe()->only(['name', 'sort_order']));

        return redirect('/admin/category/');
    }

    public function destroy(): RedirectResponse
    {
        $categoryId = request()->integer('id');

        if ($categoryId > 0) {
            Category::query()->whereKey($categoryId)->delete();
        }

        return redirect('/admin/category/');
    }
}
