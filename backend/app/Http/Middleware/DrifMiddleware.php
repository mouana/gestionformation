<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DrifMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
     
        $user = Auth::guard('api')->user();

   
        if (!$user) {
            return response()->json([
                'error' => true,
                'message' => 'Veuillez vous connecter d\'abord.'
            ], 401);
        }

   
        if ($user->role !== 'responsable_drif') {
            return response()->json([
                'error' => true,
                'message' => 'Accès réservé aux responsables DRIF.'
            ], 403);
        }

        return $next($request);
    }
}
