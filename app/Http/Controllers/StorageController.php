<?php

namespace App\Http\Controllers;

use App\Models\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorageController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search', '');

        // ✅ FIX: Validasi per_page yang lebih lengkap termasuk 25
        $allowedPerPage = [10, 25, 50, 100];
        if (!in_array((int)$perPage, $allowedPerPage)) {
            $perPage = 10;
        }

        // Clean search input untuk keamanan
        $search = trim($search);

        // Query dengan search yang robust
        $query = Storage::query();

        if (!empty($search)) {
            // ✅ FIX: Search HANYA berdasarkan size, tidak price!
            $query->where('size', 'like', "%{$search}%");
        }

        $storages = $query->orderBy('size')->paginate($perPage)->withQueryString();

        // Calculate stats dari semua data
        $allStorages = Storage::all();
        $stats = [
            'total_plans' => $allStorages->count(),
            'min' => $allStorages->min('size') ?? 0,
            'max' => $allStorages->max('size') ?? 0,
        ];

        return Inertia::render('storages/Index', [
            'storages' => $storages,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'per_page' => (int)$perPage,
            ],
            // ✅ FIX: Tambah flag untuk search result
            'hasSearchResults' => !empty($search) && $storages->total() > 0,
            'searchTerm' => $search,
        ]);
    }

    public function create()
    {
        $allStorages = Storage::all();
        return Inertia::render('storages/Create', [
            'storageList' => $allStorages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'size' => 'required|integer|min:1|unique:storages',
            'price_admin_annual' => 'required|integer|min:0',
            'price_admin_monthly' => 'required|integer|min:0',
            'price_member_annual' => 'required|integer|min:0',
            'price_member_monthly' => 'required|integer|min:0',
        ]);

        Storage::create($request->all());

        return redirect()->route('storages.index')->with('success', 'Storage plan created successfully.');
    }

    public function edit(Storage $storage)
    {
        $allStorages = Storage::all();
        return Inertia::render('storages/Edit', [
            'storage' => $storage,
            'storageList' => $allStorages,
        ]);
    }

    public function update(Request $request, Storage $storage)
    {
        $request->validate([
            'size' => 'required|integer|min:1|unique:storages,size,' . $storage->id,
            'price_admin_annual' => 'required|integer|min:0',
            'price_admin_monthly' => 'required|integer|min:0',
            'price_member_annual' => 'required|integer|min:0',
            'price_member_monthly' => 'required|integer|min:0',
        ]);

        $storage->update($request->all());

        return redirect()->route('storages.index')->with('success', 'Storage plan updated successfully.');
    }

    public function destroy(Storage $storage)
    {
        $storage->delete();
        return redirect()->route('storages.index')->with('success', 'Storage plan deleted successfully.');
    }
}
