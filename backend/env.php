<?php

$env = loadEnvFile(__DIR__ . '/.env');

defineEnvConstant('DB_CONNECTION', $env['DB_CONNECTION'] ?? 'mysql');
defineEnvConstant('DB_HOST', $env['DB_HOST'] ?? 'mysql');
defineEnvConstant('DB_PORT', (int) ($env['DB_PORT'] ?? 3306));
defineEnvConstant('DB_DATABASE', $env['DB_DATABASE'] ?? 'haru_sushi');
defineEnvConstant('DB_USERNAME', $env['DB_USERNAME'] ?? 'root');
defineEnvConstant('DB_PASSWORD', $env['DB_PASSWORD'] ?? 'root');

defineEnvConstant('APP_KEY', $env['APP_KEY'] ?? 'haru_sushi');
defineEnvConstant('SITE_TITLE', $env['SITE_TITLE'] ?? 'はる寿司-管理者');
defineEnvConstant('CLIENT_BASE_URL', normalizeUrl($env['CLIENT_BASE_URL'] ?? 'http://localhost/react-sushi/backend/'));
defineEnvConstant('API_BASE_URL', normalizeUrl($env['API_BASE_URL'] ?? 'http://localhost/react-sushi/backend/api/'));
defineEnvConstant('VITE_DEV_SERVER_URL', normalizeUrl($env['VITE_DEV_SERVER_URL'] ?? 'http://localhost:5173/'));

function loadEnvFile($path)
{
    if (!is_file($path)) {
        return [];
    }

    $values = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        $key = trim($key);
        $value = trim($value);

        if ($key === '') {
            continue;
        }

        $values[$key] = trim($value, "\"'");
    }

    return $values;
}

function defineEnvConstant($name, $value)
{
    if (!defined($name)) {
        define($name, $value);
    }
}

function normalizeUrl($url)
{
    return rtrim((string) $url, '/') . '/';
}
