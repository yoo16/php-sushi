<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\JoinVisitRequest;
use App\Models\Visit;
use App\Services\VisitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function __construct(private readonly VisitService $visitService)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $visitId = (int) $request->query('id', 0);
        $visit = Visit::query()->find($visitId);

        if ($visit === null) {
            return response()->json([
                'status' => 'error',
                'message' => sprintf('%d 指定された来店セッションが見つかりません。', $visitId),
            ], 404, options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }

        return response()->json([
            'status' => 'success',
            'visit' => $visit,
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    public function join(JoinVisitRequest $request): JsonResponse
    {
        $visit = $this->visitService->joinSeat((int) $request->integer('seat_id'));

        return response()->json([
            'status' => 'success',
            'visit' => $visit,
        ], options: JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
