<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSeatRequest;
use App\Models\Seat;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SeatController extends Controller
{
    public function index(): View
    {
        return view('admin.seat.index', [
            'seats' => Seat::query()->orderBy('id')->get(),
        ]);
    }

    public function edit(): View|RedirectResponse
    {
        $seat = Seat::query()->find(request()->integer('id'));

        if ($seat === null) {
            return redirect('/admin/seat/');
        }

        return view('admin.seat.edit', [
            'seat' => $seat,
        ]);
    }

    public function update(UpdateSeatRequest $request): RedirectResponse
    {
        $seat = Seat::query()->findOrFail($request->integer('id'));
        $seat->update([
            'number' => $request->integer('number'),
        ]);

        return redirect('/admin/seat/');
    }
}
