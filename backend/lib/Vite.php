<?php

function viteDevServerUrl()
{
    if (defined('VITE_DEV_SERVER_URL')) {
        return rtrim(VITE_DEV_SERVER_URL, '/');
    }

    return 'http://localhost:5173';
}

function viteManifestPath()
{
    return BASE_DIR . '/js/dist/.vite/manifest.json';
}

function viteManifest()
{
    static $manifest = null;

    if ($manifest !== null) {
        return $manifest;
    }

    $path = viteManifestPath();
    if (!is_file($path)) {
        $manifest = [];
        return $manifest;
    }

    $decoded = json_decode((string) file_get_contents($path), true);
    $manifest = is_array($decoded) ? $decoded : [];

    return $manifest;
}

function viteDevServerRunning()
{
    static $running = null;

    if ($running !== null) {
        return $running;
    }

    $url = parse_url(viteDevServerUrl());
    $host = $url['host'] ?? 'localhost';
    $port = $url['port'] ?? 5173;

    $socket = @fsockopen($host, $port, $errno, $error, 0.2);
    if (!is_resource($socket)) {
        $running = false;
        return $running;
    }

    fclose($socket);
    $running = true;

    return $running;
}

function viteTags($entry = 'index.html')
{
    if (viteDevServerRunning()) {
        $devServerUrl = viteDevServerUrl();
        return sprintf(
            '<script type="module" src="%s/@vite/client"></script>' . PHP_EOL .
            '<script type="module" src="%s/src/main.jsx"></script>',
            htmlspecialchars($devServerUrl, ENT_QUOTES, 'UTF-8'),
            htmlspecialchars($devServerUrl, ENT_QUOTES, 'UTF-8')
        );
    }

    $manifest = viteManifest();
    if (!isset($manifest[$entry])) {
        return '';
    }

    $assetBase = rtrim(BASE_URL, '/') . '/js/dist/';
    $entryAsset = $manifest[$entry];
    $tags = [];

    foreach ($entryAsset['css'] ?? [] as $cssFile) {
        $tags[] = sprintf(
            '<link rel="stylesheet" href="%s%s">',
            htmlspecialchars($assetBase, ENT_QUOTES, 'UTF-8'),
            htmlspecialchars($cssFile, ENT_QUOTES, 'UTF-8')
        );
    }

    $tags[] = sprintf(
        '<script type="module" src="%s%s"></script>',
        htmlspecialchars($assetBase, ENT_QUOTES, 'UTF-8'),
        htmlspecialchars($entryAsset['file'], ENT_QUOTES, 'UTF-8')
    );

    return implode(PHP_EOL, $tags);
}
