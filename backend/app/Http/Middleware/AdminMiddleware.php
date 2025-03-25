<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
{
    $user = Auth::guard('api')->user();

    if (!$user) {
        return response()->json([
            'error' => true,
            'message' => 'Please log in first.'
        ], 401);
    }

    if ($user->role !== 'admin') {
        return response()->json([
            'error' => true,
            'message' => 'Admins only.'
        ], 403);
    }

    return $next($request);
}

}