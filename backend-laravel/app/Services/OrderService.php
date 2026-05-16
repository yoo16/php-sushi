<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\Visit;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class OrderService
{
    private const TAX_RATE = 0.1;

    public function fetchByVisitId(int $visitId): Collection
    {
        return Order::query()
            ->select([
                'orders.id',
                'orders.visit_id',
                'orders.product_id',
                'orders.quantity',
                'orders.price',
                'orders.created_at',
                DB::raw('products.name AS product_name'),
                DB::raw('products.image_path AS product_image_path'),
            ])
            ->join('products', 'orders.product_id', '=', 'products.id')
            ->where('orders.visit_id', $visitId)
            ->get();
    }

    public function calculateTotal(int $visitId): int
    {
        return (int) $this->fetchByVisitId($visitId)
            ->reduce(fn (int $sum, Order $order): int => $sum + ($order->price * $order->quantity), 0);
    }

    public function addOrder(int $visitId, int $productId, int $quantity): Order
    {
        $product = Product::query()->findOrFail($productId);

        return Order::query()->create([
            'visit_id' => $visitId,
            'product_id' => $productId,
            'quantity' => $quantity,
            'price' => $product->price,
        ]);
    }

    public function billVisit(int $visitId): int
    {
        $visit = Visit::query()->findOrFail($visitId);
        $total = $this->calculateTotal($visitId);
        $tax = (int) round($total * self::TAX_RATE);

        $visit->update([
            'status' => 'billed',
            'total' => $total,
            'total_with_tax' => $total + $tax,
        ]);

        return $total;
    }
}
