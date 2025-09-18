<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory;

    protected $fillable = ['size', 'price_admin_annual', 'price_admin_monthly', 'price_member_annual', 'price_member_monthly'];

    protected $casts = [
        'size' => 'integer',
        'price_admin_annual' => 'integer',
        'price_admin_monthly' => 'integer',
        'price_member_annual' => 'integer',
        'price_member_monthly' => 'integer',
    ];
}
