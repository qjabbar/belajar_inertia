<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory;

    protected $fillable = [
        'size',
        'price_admin_annual',
        'price_admin_monthly',
        'price_member_annual',
        'price_member_monthly',
    ];

    public function account()
    {
        return $this->hasOne(Account::class);
    }
}
