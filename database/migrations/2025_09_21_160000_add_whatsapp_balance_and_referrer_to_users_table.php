<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('whatsapp_number', 20)->nullable()->unique()->after('email');
            $table->unsignedBigInteger('balance')->default(0)->after('whatsapp_number');
            $table->foreignId('referrer_id')->nullable()->constrained('users')->nullOnDelete()->after('balance');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('referrer_id');
            $table->dropColumn(['whatsapp_number', 'balance']);
        });
    }
};