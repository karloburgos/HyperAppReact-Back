<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('clientes', function (Blueprint $table) {
        $table->id();
        $table->string('firstName');
        $table->string('lastName');
        $table->string('email')->unique();
        $table->string('phone');
        $table->string('countryCode');
        $table->text('socialNetworks')->nullable();
        $table->date('birthDate')->nullable();
        $table->string('origin')->nullable();
        $table->string('relatedClient')->nullable();
        $table->string('country')->nullable();
        $table->string('membershipType');
        $table->string('status')->default('active');
        $table->text('image')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
