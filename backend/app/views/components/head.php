<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? SITE_TITLE, ENT_QUOTES, 'UTF-8') ?></title>
    <?php if (($includeTailwindCdn ?? true) === true): ?>
        <script src="https://cdn.tailwindcss.com"></script>
    <?php endif; ?>
    <base href="<?= BASE_URL ?>">
</head>
