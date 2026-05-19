<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seat;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_displays_monthly_summary_and_ranking(): void
    {
        Carbon::setTestNow('2026-05-17 12:00:00');

        $category = Category::query()->create([
            'name' => 'まぐろ',
            'sort_order' => 1,
        ]);

        $productA = Product::query()->create([
            'name' => 'まぐろ',
            'price' => 150,
            'image_path' => '',
            'category_id' => $category->id,
        ]);

        $productB = Product::query()->create([
            'name' => 'サーモン',
            'price' => 200,
            'image_path' => '',
            'category_id' => $category->id,
        ]);

        $seatA = Seat::query()->create(['number' => 1]);
        $seatB = Seat::query()->create(['number' => 2]);

        $paidVisit = Visit::query()->create([
            'seat_id' => $seatA->id,
            'status' => 'paid',
            'total' => 500,
            'total_with_tax' => 550,
            'created_at' => Carbon::now()->startOfMonth()->addDay(),
            'updated_at' => Carbon::now()->startOfMonth()->addDay(),
        ]);

        $seatedVisit = Visit::query()->create([
            'seat_id' => $seatB->id,
            'status' => 'seated',
            'total' => 0,
            'total_with_tax' => 0,
            'created_at' => Carbon::now()->startOfMonth()->addDays(2),
            'updated_at' => Carbon::now()->startOfMonth()->addDays(2),
        ]);

        Order::query()->create([
            'visit_id' => $paidVisit->id,
            'product_id' => $productA->id,
            'quantity' => 3,
            'price' => 150,
        ]);

        Order::query()->create([
            'visit_id' => $seatedVisit->id,
            'product_id' => $productB->id,
            'quantity' => 2,
            'price' => 200,
        ]);

        $response = $this->get(route('admin.dashboard'));

        $response
            ->assertOk()
            ->assertSee('Dashboard')
            ->assertSee('¥550')
            ->assertSee('2組')
            ->assertSee('まぐろ')
            ->assertSee('3皿')
            ->assertSee('サーモン');

        Carbon::setTestNow();
    }
}
