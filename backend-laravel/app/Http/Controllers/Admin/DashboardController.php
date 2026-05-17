<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $now = Carbon::now();

        $monthlySales = (int) Visit::query()
            ->where('status', 'paid')
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('total_with_tax');

        $monthlyVisits = (int) Visit::query()
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->count();

        $ranking = DB::table('orders as o')
            ->join('products as p', 'o.product_id', '=', 'p.id')
            ->join('visits as v', 'o.visit_id', '=', 'v.id')
            ->select('p.name', DB::raw('SUM(o.quantity) as total_qty'))
            ->whereYear('v.created_at', $now->year)
            ->whereMonth('v.created_at', $now->month)
            ->groupBy('o.product_id', 'p.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        return view('admin.dashboard.index', [
            'monthlySales' => $monthlySales,
            'monthlyVisits' => $monthlyVisits,
            'ranking' => $ranking,
            'rankingTopQuantity' => (int) ($ranking->first()->total_qty ?? 0),
            'monthLabel' => sprintf('%d年%d月', $now->year, $now->month),
        ]);
    }
}
