<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seat;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminVisitTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_page_displays_visits_and_checkout_history(): void
    {
        $seatA = Seat::query()->create(['number' => 1]);
        $seatB = Seat::query()->create(['number' => 2]);

        Visit::query()->create([
            'seat_id' => $seatA->id,
            'status' => 'seated',
            'total_with_tax' => 0,
        ]);

        Visit::query()->create([
            'seat_id' => $seatB->id,
            'status' => 'billed',
            'total_with_tax' => 660,
        ]);

        $response = $this->get(route('admin.visit.index'));

        $response
            ->assertOk()
            ->assertSee('訪問一覧')
            ->assertSee('🪑 着席')
            ->assertSee('🧾 会計済')
            ->assertSee('660円');
    }

    public function test_show_page_displays_visit_summary_and_orders(): void
    {
        $category = Category::query()->create(['name' => 'まぐろ', 'sort_order' => 1]);
        $product = Product::query()->create([
            'name' => 'まぐろ',
            'price' => 150,
            'image_path' => '',
            'category_id' => $category->id,
        ]);
        $seat = Seat::query()->create(['number' => 3]);
        $visit = Visit::query()->create([
            'seat_id' => $seat->id,
            'status' => 'billed',
            'total' => 300,
            'total_with_tax' => 330,
        ]);
        Order::query()->create([
            'visit_id' => $visit->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 150,
        ]);

        $response = $this->get(route('admin.visit.show', $visit));

        $response
            ->assertOk()
            ->assertSee('訪問詳細')
            ->assertSee('まぐろ')
            ->assertSee('330円')
            ->assertSee('300円');
    }

    public function test_show_page_displays_missing_visit_message(): void
    {
        $response = $this->get('/admin/visit/show/999');
        $response->assertNotFound();
    }
}
