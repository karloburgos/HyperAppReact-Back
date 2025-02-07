<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Cliente::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cliente = Cliente::create([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'email' => $request->email,
            'phone' => $request->phone,
            'countryCode' => $request->countryCode,
            'socialNetworks' => json_encode($request->socialNetworks),
            'birthDate' => $request->birthDate,
            'origin' => $request->origin,
            'relatedClient' => $request->relatedClient,
            'country' => $request->country,
            'membershipType' => $request->membershipType,
            'status' => 'active',
            'image' => $request->image,
        ]);

        return response()->json($cliente, 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
