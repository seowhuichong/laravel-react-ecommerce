<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>eCommerce Site</title>
    <meta name="description" content="Shop the best products online.">
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @else
    <link rel="stylesheet" href="{{ asset('css/fallback.css') }}">
    @endif
    <script>
        window.AppConfig = {
            locale: "{{ app()->getLocale() }}",
            settings: @json($settings ?? [])
        };
    </script>
</head>

<body>
    <div id="app"></div>
</body>

</html>