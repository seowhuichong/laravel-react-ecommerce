<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>My React SPA</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @else
    <link rel="stylesheet" href="{{ asset('css/fallback.css') }}">
    @endif
    <script>
        window.AppConfig = {
            locale: "{{ app()->getLocale() }}"
        };
    </script>
</head>

<body>
    <div id="app"></div>
</body>

</html>