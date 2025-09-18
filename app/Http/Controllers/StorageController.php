<?php

namespace App\Http\Controllers;

use App\Models\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorageController extends Controller
{
    public function index()
    {
        return Inertia::render('Storages/Index', [
            'storages' => Storage::orderBy('size')->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Storages/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'size' => 'required|integer|min:1',
            'price_admin_annual' => 'required|integer|min:0',
            'price_admin_monthly' => 'required|integer|min:0',
            'price_member_annual' => 'required|integer|min:0',
            'price_member_monthly' => 'required|integer|min:0',
        ]);

        Storage::create($request->all());

        return redirect()->route('storages.index')->with('success', 'Storage created successfully.');
    }

    public function edit(Storage $storage)
    {
        return Inertia::render('Storages/Edit', [
            'storage' => $storage,
        ]);
    }

    public function update(Request $request, Storage $storage)
    {
        $request->validate([
            'size' => 'required|integer|min:1',
            'price_admin_annual' => 'required|integer|min:0',
            'price_admin_monthly' => 'required|integer|min:0',
            'price_member_annual' => 'required|integer|min:0',
            'price_member_monthly' => 'required|integer|min:0',
        ]);

        $storage->update($request->all());

        return redirect()->route('storages.index')->with('success', 'Storage updated successfully.');
    }

    public function destroy(Storage $storage)
    {
        $storage->delete();

        return redirect()->route('storages.index')->with('success', 'Storage deleted successfully.');
    }
}
