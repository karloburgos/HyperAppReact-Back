<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route; // Asegúrate de importar esta clase
use App\Models\ClientesPost;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Forzar el enlace del modelo
        Route::model('cliente', ClientesPost::class);
    }
}
