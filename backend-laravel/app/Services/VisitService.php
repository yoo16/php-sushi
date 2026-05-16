<?php

namespace App\Services;

use App\Models\Visit;

class VisitService
{
    public function findActiveBySeatId(int $seatId): ?Visit
    {
        return Visit::query()
            ->where('seat_id', $seatId)
            ->where('status', '!=', 'billed')
            ->first();
    }

    public function joinSeat(int $seatId): Visit
    {
        $activeVisit = $this->findActiveBySeatId($seatId);

        if ($activeVisit !== null) {
            return $activeVisit;
        }

        return Visit::query()->create([
            'seat_id' => $seatId,
            'status' => 'seated',
        ]);
    }
}
