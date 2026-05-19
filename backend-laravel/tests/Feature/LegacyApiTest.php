<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seat;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegacyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_fetch_returns_categories(): void
    {
        Category::query()->create([
            'name' => 'まぐろ',
            'sort_order' => 1,
        ]);

        $response = $this->getJson('/api/category/fetch');

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(1, 'categories')
            ->assertJsonPath('categories.0.name', 'まぐろ');
    }

    public function test_product_fetch_can_filter_by_category(): void
    {
        $categoryA = Category::query()->create(['name' => 'A', 'sort_order' => 1]);
        $categoryB = Category::query()->create(['name' => 'B', 'sort_order' => 2]);

        Product::query()->create([
            'name' => '商品A',
            'price' => 100,
            'image_path' => 'images/products/a.png',
            'category_id' => $categoryA->id,
        ]);

        Product::query()->create([
            'name' => '商品B',
            'price' => 200,
            'image_path' => 'images/products/b.png',
            'category_id' => $categoryB->id,
        ]);

        $response = $this->getJson('/api/product/fetch?category_id='.$categoryA->id);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonCount(1, 'products')
            ->assertJsonPath('products.0.name', '商品A');
    }

    public function test_visit_join_reuses_active_visit(): void
    {
        $seat = Seat::query()->create(['number' => 1]);
        $visit = Visit::query()->create([
            'seat_id' => $seat->id,
            'status' => 'seated',
        ]);

        $response = $this->postJson('/api/visit/join', [
            'seat_id' => $seat->id,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('visit.id', $visit->id);

        $this->assertDatabaseCount('visits', 1);
    }

    public function test_order_add_uses_current_product_price(): void
    {
        $category = Category::query()->create(['name' => 'A', 'sort_order' => 1]);
        $product = Product::query()->create([
            'name' => '商品A',
            'price' => 480,
            'image_path' => 'images/products/a.png',
            'category_id' => $category->id,
        ]);
        $seat = Seat::query()->create(['number' => 1]);
        $visit = Visit::query()->create([
            'seat_id' => $seat->id,
            'status' => 'seated',
        ]);

        $response = $this->postJson('/api/order/add', [
            'product_id' => $product->id,
            'quantity' => 2,
            'visit_id' => $visit->id,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.price', 480);

        $this->assertDatabaseHas('orders', [
            'visit_id' => $visit->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 480,
        ]);
    }

    public function test_order_billed_updates_total_and_tax(): void
    {
        $category = Category::query()->create(['name' => 'A', 'sort_order' => 1]);
        $product = Product::query()->create([
            'name' => '商品A',
            'price' => 300,
            'image_path' => 'images/products/a.png',
            'category_id' => $category->id,
        ]);
        $seat = Seat::query()->create(['number' => 1]);
        $visit = Visit::query()->create([
            'seat_id' => $seat->id,
            'status' => 'seated',
        ]);

        Order::query()->create([
            'visit_id' => $visit->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 300,
        ]);

        $response = $this->postJson('/api/order/billed', [
            'visit_id' => $visit->id,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('total', 600);

        $this->assertDatabaseHas('visits', [
            'id' => $visit->id,
            'status' => 'billed',
            'total' => 600,
            'total_with_tax' => 660,
        ]);
    }
}
