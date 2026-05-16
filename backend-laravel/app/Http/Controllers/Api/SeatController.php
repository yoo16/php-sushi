<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seat;
use App\Services\VisitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    public function __construct(private readonly VisitService $visitService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'seats' => Seat::query()->orderBy('id')->get(),
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    public function available(): JsonResponse
    {
        $seats = Seat::query()
            ->orderBy('id')
            ->get()
            ->filter(fn (Seat $seat): bool => $this->visitService->findActiveBySeatId($seat->id) === null)
            ->values();

        return response()->json([
            'status' => 'success',
            'seats' => $seats,
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    public function show(Request $request): JsonResponse
    {
        $seatId = (int) $request->query('id', 0);
        $seat = Seat::query()->find($seatId);

        if ($seat === null) {
            return response()->json([
                'status' => 'error',
                'message' => '指定された席が見つかりません。',
            ], 404, options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }

        return response()->json([
            'status' => 'success',
            'seat' => $seat,
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
