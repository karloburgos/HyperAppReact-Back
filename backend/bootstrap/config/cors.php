<?php
return [
    'paths' => ['api/*'],//  CORS solo a las rutas de la API
    'allowed_methods' => ['*'], // Permitir todos los métodos (GET, POST, etc.)
    'allowed_origins' => ['*'], // Permitir el frontend Vite
    'allowed_headers' => ['*'], // Permitir todos los headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];