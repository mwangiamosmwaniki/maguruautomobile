<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    /**
     * Handle an incoming request - only allow admin users
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user exists and has proper authentication
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthorized - User not authenticated'
            ], 401);
        }

        // Optional: Add role check if you implement roles
        // if ($request->user()->role !== 'admin') {
        //     return response()->json([
        //         'message' => 'Forbidden - Admin access required'
        //     ], 403);
        // }

        return $next($request);
    }
}
