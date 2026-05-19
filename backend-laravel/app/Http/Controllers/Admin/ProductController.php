<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(): View
    {
        $categoryId = request()->integer('category_id');

        $products = Product::query()
            ->with('category')
            ->when($categoryId > 0, fn ($query) => $query->where('category_id', $categoryId))
            ->orderBy('id')
            ->get();

        return view('admin.product.index', [
            'products' => $products,
            'categories' => Category::query()->orderBy('sort_order')->orderBy('id')->get(),
            'selectedCategoryId' => $categoryId > 0 ? $categoryId : null,
        ]);
    }

    public function create(): View
    {
        return view('admin.product.create', [
            'categories' => Category::query()->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'category_id', 'price']);
        $data['image_path'] = $this->storeImage($request->file('image')) ?? '';

        Product::query()->create($data);

        return redirect()->route('admin.product.index');
    }

    public function edit(Product $product): View
    {
        return view('admin.product.edit', [
            'product' => $product,
            'categories' => Category::query()->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'category_id', 'price']);

        $newImagePath = $this->storeImage($request->file('image'));
        if ($newImagePath !== null) {
            $data['image_path'] = $newImagePath;
        }

        $product->update($data);

        return redirect()->route('admin.product.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.product.index');
    }

    private function storeImage(?UploadedFile $file): ?string
    {
        if ($file === null) {
            return null;
        }

        $directory = public_path('images/products');
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'images/products/'.$filename;
    }
}
