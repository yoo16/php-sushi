<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AddOrderRequest;
use App\Http\Requests\Api\BillOrderRequest;
use App\Services\OrderService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $visitId = $request->query('visit_id');

        if ($visitId === null || $visitId === '') {
            return response()->json(['error' => 'Missing visit_id'], 400);
        }

        $orders = $this->orderService->fetchByVisitId((int) $visitId);
        $total = (int) $orders->reduce(
            fn (int $sum, $order): int => $sum + ($order->price * $order->quantity),
            0
        );

        return response()->json([
            'status' => 'success',
            'orders' => $orders,
            'total' => $total,
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    public function store(AddOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->addOrder(
                (int) $request->integer('visit_id'),
                (int) $request->integer('product_id'),
                (int) $request->integer('quantity'),
            );
        } catch (ModelNotFoundException) {
            return response()->json(['error' => 'Failed to add order'], 500);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'visit_id' => $order->visit_id,
                'product_id' => $order->product_id,
                'quantity' => $order->quantity,
                'price' => $order->price,
            ],
        ]);
    }

    public function bill(BillOrderRequest $request): JsonResponse
    {
        try {
            $total = $this->orderService->billVisit((int) $request->integer('visit_id'));
        } catch (ModelNotFoundException) {
            return response()->json(['error' => 'Failed to update visit status'], 500);
        }

        return response()->json([
            'success' => true,
            'total' => $total,
        ]);
    }
}
