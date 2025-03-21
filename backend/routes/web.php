<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminSystemAuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth:api')->post('/admin/login', [AdminSystemAuthController::class, 'login']);
Route::middleware('auth:api')->post('/admin/logout', [AdminSystemAuthController::class, 'logout']);