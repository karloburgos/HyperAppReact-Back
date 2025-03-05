<?php

use App\Http\Controllers\ClientesPostController;
use App\Models\ClientesPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('/clientes', ClientesPostController::class);


//https://www.youtube.com/watch?v=LmMJB3STuU4