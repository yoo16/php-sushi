@props([
    'title' => 'Admin',
    'active' => null,
])
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }}</title>
    <style>
        :root {
            --bg: #f4f1ea;
            --surface: #fffdf8;
            --surface-2: #f8f4ee;
            --ink: #1f2937;
            --muted: #6b7280;
            --line: #e5ddd2;
            --brand: #0f766e;
            --brand-strong: #115e59;
            --danger: #b91c1c;
            --danger-bg: #fff1f2;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            background: linear-gradient(180deg, #f7f3eb 0%, #efe7db 100%);
            color: var(--ink);
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        a { color: inherit; text-decoration: none; }
        .shell { min-height: 100vh; }
        .nav {
            background:
                radial-gradient(circle at top left, rgba(255,255,255,.18), transparent 28%),
                linear-gradient(135deg, #0f766e, #155e75);
            color: #fff;
            padding: 20px 24px;
            box-shadow: 0 10px 30px rgba(15, 118, 110, .15);
        }
        .nav-inner, .content {
            width: min(1100px, calc(100% - 32px));
            margin: 0 auto;
        }
        .nav-title {
            margin: 0 0 14px;
            font-size: 14px;
            letter-spacing: .08em;
            text-transform: uppercase;
            opacity: .8;
        }
        .nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .nav-link {
            display: inline-flex;
            align-items: center;
            min-height: 40px;
            padding: 0 14px;
            border-radius: 999px;
            background: rgba(255,255,255,.08);
            transition: background-color .18s ease;
        }
        .nav-link.active,
        .nav-link:hover {
            background: rgba(255,255,255,.18);
        }
        .content {
            padding: 28px 0 40px;
        }
        .panel {
            background: rgba(255, 253, 248, .95);
            border: 1px solid rgba(229, 221, 210, .8);
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 18px 40px rgba(73, 47, 22, .08);
            backdrop-filter: blur(8px);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }
        .heading {
            margin: 0;
            font-size: clamp(24px, 3vw, 34px);
            line-height: 1.1;
        }
        .subtle {
            color: var(--muted);
            font-size: 14px;
        }
        .button, button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            min-height: 44px;
            padding: 0 16px;
            border-radius: 12px;
            border: 1px solid transparent;
            font: inherit;
            cursor: pointer;
        }
        .button-primary {
            background: var(--brand);
            color: #fff;
        }
        .button-primary:hover { background: var(--brand-strong); }
        .button-secondary {
            border-color: var(--line);
            background: #fff;
            color: var(--ink);
        }
        .button-danger {
            border-color: rgba(185, 28, 28, .2);
            background: var(--danger-bg);
            color: var(--danger);
        }
        .table-wrap {
            overflow-x: auto;
            border: 1px solid var(--line);
            border-radius: 16px;
            background: #fff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 14px 16px;
            border-bottom: 1px solid var(--line);
            text-align: left;
            vertical-align: middle;
        }
        th {
            color: var(--muted);
            font-size: 12px;
            letter-spacing: .08em;
            text-transform: uppercase;
            background: var(--surface-2);
        }
        tr:last-child td { border-bottom: none; }
        .num {
            text-align: right;
            font-variant-numeric: tabular-nums;
        }
        .empty {
            padding: 56px 20px;
            text-align: center;
            color: var(--muted);
            border: 1px dashed var(--line);
            border-radius: 16px;
            background: rgba(255,255,255,.5);
        }
        .stack {
            display: grid;
            gap: 18px;
        }
        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }
        input {
            width: 100%;
            min-height: 46px;
            padding: 0 14px;
            border: 1px solid var(--line);
            border-radius: 12px;
            background: #fff;
            color: var(--ink);
            font: inherit;
        }
        select {
            width: 100%;
            min-height: 46px;
            padding: 0 14px;
            border: 1px solid var(--line);
            border-radius: 12px;
            background: #fff;
            color: var(--ink);
            font: inherit;
        }
        input:focus {
            outline: 2px solid rgba(15, 118, 110, .18);
            border-color: var(--brand);
        }
        select:focus {
            outline: 2px solid rgba(15, 118, 110, .18);
            border-color: var(--brand);
        }
        .field-error {
            margin-top: 8px;
            color: var(--danger);
            font-size: 13px;
        }
        .flash-errors {
            margin-bottom: 18px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid rgba(185, 28, 28, .15);
            background: var(--danger-bg);
            color: var(--danger);
        }
        .flash-success {
            margin-bottom: 18px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid rgba(5, 150, 105, .18);
            background: #ecfdf5;
            color: #047857;
        }
        .flash-warn {
            margin-bottom: 18px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid rgba(217, 119, 6, .18);
            background: #fffbeb;
            color: #92400e;
        }
        .flash-title {
            margin: 0 0 6px;
            font-weight: 700;
        }
        .flash-body {
            margin: 0;
            white-space: pre-line;
        }
        .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 22px;
        }
        .chip {
            display: inline-flex;
            align-items: center;
            min-height: 38px;
            padding: 0 14px;
            border-radius: 999px;
            border: 1px solid var(--line);
            background: #fff;
            color: var(--muted);
        }
        .chip.active {
            background: var(--brand);
            border-color: var(--brand);
            color: #fff;
        }
        .product-cell {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .product-thumb {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            object-fit: cover;
            background: var(--surface-2);
            border: 1px solid var(--line);
            flex: 0 0 auto;
        }
        .preview-wrap {
            display: flex;
            justify-content: center;
            margin-bottom: 12px;
        }
        .preview-image {
            width: min(220px, 100%);
            border-radius: 16px;
            border: 1px solid var(--line);
            background: #fff;
        }
        .cards {
            display: grid;
            gap: 16px;
        }
        .cards.cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .stat-card {
            padding: 18px;
            border-radius: 16px;
            border: 1px solid var(--line);
            background: #fff;
        }
        .stat-label {
            margin: 0;
            font-size: 13px;
            color: var(--muted);
        }
        .stat-value {
            margin: 8px 0 0;
            font-size: 20px;
            font-weight: 700;
        }
        .detail-grid {
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .detail-item {
            padding: 16px;
            border-radius: 14px;
            border: 1px solid var(--line);
            background: rgba(255,255,255,.8);
        }
        .detail-item dt {
            color: var(--muted);
            font-size: 13px;
        }
        .detail-item dd {
            margin: 8px 0 0;
            font-weight: 600;
        }
        .sql-grid {
            display: grid;
            gap: 16px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .sql-panel {
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid var(--line);
            background: #fff;
        }
        .sql-header {
            padding: 10px 14px;
            border-bottom: 1px solid var(--line);
            background: var(--surface-2);
            font-size: 13px;
            font-weight: 700;
        }
        .sql-body {
            margin: 0;
            max-height: 420px;
            overflow: auto;
            padding: 16px;
            background: #0f172a;
            color: #bfdbfe;
            font-size: 12px;
            line-height: 1.55;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .sql-body-warn {
            color: #fde68a;
        }
        .sql-body-ok {
            color: #a7f3d0;
        }
        .section-line {
            margin-top: 28px;
            padding-top: 24px;
            border-top: 1px solid var(--line);
        }
        @media (max-width: 720px) {
            .panel { padding: 20px; }
            .header { align-items: flex-start; flex-direction: column; }
            .actions > * { width: 100%; }
            .button, button { width: 100%; }
            .cards.cols-4,
            .detail-grid,
            .sql-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="shell">
        <x-admin.nav :active="$active" />
        <main class="content">
            <section class="panel">
                {{ $slot }}
            </section>
        </main>
    </div>
</body>
</html>
