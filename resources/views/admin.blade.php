<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin</title>
    <meta name="description" content="Admin Dashboard" />
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/admin.jsx'])
    <meta name="robots" content="noindex, nofollow, noarchive">
</head>

<body>
    <div id="admin-app"></div>
</body>

</html>