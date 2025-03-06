<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientesPost extends Model
{
    /** @use HasFactory<\Database\Factories\ClientesPostFactory> */
    use HasFactory;

    protected $primaryKey = 'id';

    protected $fillable = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'countryCode',
            'socialNetworks',
            'birthDate',
            'origin',
            'relatedClient',
            'country',
            'membershipType',
            'status' => 'active',
            'image',
    ];
}
