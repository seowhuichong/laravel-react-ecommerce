<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // $urlLocale = $request->segment(1);
        // $supportedLocales = ['en', 'ms', 'zh'];

        // if (in_array($urlLocale, $supportedLocales)) {
        //     $locale = $urlLocale;
        // } else {
        //     $locale = $request->header('X-Locale') ?: session('locale', config('app.locale'));
        // }
        // App::setLocale($locale);

        // if ($request->hasSession() && session('locale') !== $locale) {
        //     session(['locale' => $locale]);
        // }

        $locale = $request->route('locale');

        if (! in_array($locale, ['en', 'ms', 'zh'])) {
            $locale = config('app.locale');
        }

        App::setLocale($locale);

        return $next($request);
    }
}
