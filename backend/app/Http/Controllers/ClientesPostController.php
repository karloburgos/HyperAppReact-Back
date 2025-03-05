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

        $post = ClientesPost::create($fields);
        return ['post' => $post];
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientesPost $clientesPost)
    {
        //Busqueda especifica por Id
        return ['post' => $clientesPost];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClientesPost $clientesPost)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClientesPost $clientesPost)
    {
        //
    }
}
