<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\AdminSystemAuthController;
use App\Http\Controllers\RespoFormationAuthController;

class BaseAuthController extends Controller
{
    protected $authControllers = [];

    public function __construct()
    {
        // List all authentication controllers
        $this->authControllers = [
            new AdminSystemAuthController(),
            new RespoFormationAuthController(),
            new FormteurParticipantAuthController(),

            new DrifAuthController(),
            // Add more controllers if needed
        ];
    }

    /**
     * Handle authentication (login or logout) through all controllers
     */
    public function handleAuth(Request $request, $method)
    {
        foreach ($this->authControllers as $controller) {
            if (method_exists($controller, $method)) {
                $response = $controller->$method($request);

                if ($response->status() === 200) {
                    return $response;
                }
            }
        }

        return response()->json(['message' => 'Authentication failed'], 400);
    }

    /**
     * Login API
     */
    public function login(Request $request)
    {
        return $this->handleAuth($request, 'login');
    }

    /**
     * Logout API
     */
    public function logout(Request $request)
    {
        return $this->handleAuth($request, 'logout');
    }
}