<?php

namespace Tests\Feature;

use App\Models\Seat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSeatTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_page_displays_seats(): void
    {
        Seat::query()->create(['number' => 1]);

        $response = $this->get('/admin/seat/');

        $response
            ->assertOk()
            ->assertSee('座席一覧')
            ->assertSee('1');
    }

    public function test_edit_page_displays_current_seat_number(): void
    {
        $seat = Seat::query()->create(['number' => 8]);

        $response = $this->get('/admin/seat/edit.php?id='.$seat->id);

        $response
            ->assertOk()
            ->assertSee('座席編集')
            ->assertSee('value="8"', false);
    }

    public function test_update_changes_seat_number(): void
    {
        $seat = Seat::query()->create(['number' => 2]);

        $response = $this->post('/admin/seat/update.php', [
            'id' => $seat->id,
            'number' => 12,
        ]);

        $response->assertRedirect('/admin/seat/');

        $this->assertDatabaseHas('seats', [
            'id' => $seat->id,
            'number' => 12,
        ]);
    }
}
