<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class AdminDatabaseTest extends TestCase
{
    public function test_database_page_displays_legacy_sql_preview(): void
    {
        $response = $this->get(route('admin.database'));

        $response
            ->assertOk()
            ->assertSee('データベース初期化')
            ->assertSee('schema.sql')
            ->assertSee('insert_data.sql');
    }

    public function test_database_initialize_runs_migrate_fresh_with_seed(): void
    {
        Artisan::shouldReceive('call')
            ->once()
            ->with('migrate:fresh', [
                '--seed' => true,
                '--force' => true,
            ]);

        Artisan::shouldReceive('output')
            ->twice()
            ->andReturn('Migration completed');

        $response = $this->post(route('admin.database'));

        $response
            ->assertOk()
            ->assertSee('実行完了')
            ->assertSee('Migration completed');
    }
}
