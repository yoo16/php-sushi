<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class LegacyInsertDataSeeder extends Seeder
{
    public function run(): void
    {
        $sqlPath = base_path('database/insert_data.sql');

        if (!is_file($sqlPath)) {
            throw new RuntimeException("Seed SQL file not found: {$sqlPath}");
        }

        $sql = file_get_contents($sqlPath);

        if ($sql === false || trim($sql) === '') {
            throw new RuntimeException("Seed SQL file is empty: {$sqlPath}");
        }

        DB::unprepared($sql);
    }
}
