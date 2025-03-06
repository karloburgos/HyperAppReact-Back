<?php

namespace App\Http\Controllers;

use App\Models\ClientesPost;
use Illuminate\Http\Request;

class ClientesPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Todas las Consultas
        return ClientesPost::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Validamos
        $fields = $request->validate([
            'firstName' => 'required|max:60',
            'lastName' => 'required|max:60',
            'phone' => 'required',
            'email' => 'required'
        ]);

        $cliente = ClientesPost::create($fields);
        return $cliente;
    }

    /**
     * Display the specified resource.
     */

     public function show(ClientesPost $cliente)
     {
         return response()->json(['cliente' => $cliente]);
     }
     

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClientesPost $clientesPost)
    {
        // Validar los datos enviados
        $fields = $request->validate([
            'firstName' => 'required|max:60',
            'lastName' => 'required|max:60',
            'phone' => 'required',
            'email' => 'required|email'
        ]);
    
        // Actualizar el cliente
        $clientesPost->update($fields);
    
        return response()->json([
            'message' => 'Cliente actualizado exitosamente',
            'cliente' => $clientesPost->fresh() // Refresca los datos del modelo
        ]);
    }
    

    

    


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClientesPost $clientesPost)
    {
        //
    }
}
