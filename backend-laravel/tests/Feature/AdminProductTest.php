<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        $directory = public_path('images/products');

        if (is_dir($directory)) {
            foreach (glob($directory.'/*') ?: [] as $file) {
                @unlink($file);
            }
        }

        parent::tearDown();
    }

    public function test_index_page_displays_products(): void
    {
        $category = Category::query()->create(['name' => 'まぐろ', 'sort_order' => 1]);
        Product::query()->create([
            'name' => '商品A',
            'price' => 150,
            'image_path' => 'images/products/a.png',
            'category_id' => $category->id,
        ]);

        $response = $this->get(route('admin.product.index'));

        $response
            ->assertOk()
            ->assertSee('商品一覧')
            ->assertSee('商品A')
            ->assertSee('まぐろ');
    }

    public function test_index_page_filters_by_category(): void
    {
        $categoryA = Category::query()->create(['name' => 'A', 'sort_order' => 1]);
        $categoryB = Category::query()->create(['name' => 'B', 'sort_order' => 2]);

        Product::query()->create([
            'name' => '商品A',
            'price' => 150,
            'image_path' => '',
            'category_id' => $categoryA->id,
        ]);
        Product::query()->create([
            'name' => '商品B',
            'price' => 200,
            'image_path' => '',
            'category_id' => $categoryB->id,
        ]);

        $response = $this->get(route('admin.product.index', ['category_id' => $categoryA->id]));

        $response
            ->assertOk()
            ->assertSee('商品A')
            ->assertDontSee('商品B');
    }

    public function test_store_creates_product_with_uploaded_image(): void
    {
        $category = Category::query()->create(['name' => 'まぐろ', 'sort_order' => 1]);

        $response = $this->post(route('admin.product.store'), [
            'name' => '新規商品',
            'category_id' => $category->id,
            'price' => 320,
            'image' => UploadedFile::fake()->image('product.png'),
        ]);

        $response->assertRedirect(route('admin.product.index'));

        $product = Product::query()->where('name', '新規商品')->first();
        $this->assertNotNull($product);
        $this->assertStringStartsWith('images/products/', $product->image_path);
        $this->assertFileExists(public_path($product->image_path));
    }

    public function test_update_changes_product_without_replacing_image_when_empty(): void
    {
        $categoryA = Category::query()->create(['name' => 'A', 'sort_order' => 1]);
        $categoryB = Category::query()->create(['name' => 'B', 'sort_order' => 2]);

        $product = Product::query()->create([
            'name' => '旧商品',
            'price' => 150,
            'image_path' => 'images/products/existing.png',
            'category_id' => $categoryA->id,
        ]);

        $response = $this->post(route('admin.product.update', $product), [
            'name' => '更新商品',
            'category_id' => $categoryB->id,
            'price' => 480,
        ]);

        $response->assertRedirect(route('admin.product.index'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => '更新商品',
            'price' => 480,
            'category_id' => $categoryB->id,
            'image_path' => 'images/products/existing.png',
        ]);
    }

    public function test_delete_removes_product(): void
    {
        $category = Category::query()->create(['name' => 'A', 'sort_order' => 1]);
        $product = Product::query()->create([
            'name' => '削除商品',
            'price' => 150,
            'image_path' => '',
            'category_id' => $category->id,
        ]);

        $response = $this->post(route('admin.product.destroy', $product));

        $response->assertRedirect(route('admin.product.index'));
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
