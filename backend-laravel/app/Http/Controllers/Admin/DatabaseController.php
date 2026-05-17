<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Throwable;
use Illuminate\View\View;

class DatabaseController extends Controller
{
    public function index(Request $request): View
    {
        $message = '';
        $status = null;

        if ($request->isMethod('post')) {
            try {
                Artisan::call('migrate:fresh', [
                    '--seed' => true,
                    '--force' => true,
                ]);

                $status = 'success';
                $message = trim(Artisan::output()) !== ''
                    ? trim(Artisan::output())
                    : 'データベースを初期化しました。';
            } catch (Throwable $e) {
                $status = 'error';
                $message = 'エラーが発生しました: ' . $e->getMessage();
            }
        }

        return view('admin.database.index', [
            'status' => $status,
            'message' => $message,
            'schemaSql' => $this->readLegacySql('schema.sql', '-- schema.sql not found'),
            'truncateSql' => $this->readLegacySql('truncate.sql', '-- truncate.sql not found'),
            'insertSql' => $this->readLegacySql('insert_data.sql', '-- insert_data.sql not found'),
            'databaseName' => (string) config('database.connections.' . config('database.default') . '.database', ''),
        ]);
    }

    private function readLegacySql(string $filename, string $fallback): string
    {
        $path = base_path("database/{$filename}");

        if (!is_file($path)) {
            return $fallback;
        }

        $contents = file_get_contents($path);

        return $contents === false ? $fallback : (string) $contents;
    }
}
