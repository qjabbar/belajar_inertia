<?php

namespace App\Http\Controllers;

use App\Models\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorageController extends Controller
{
    public function index(Request $request)
    {
        // Ambil parameter per_page dari request, default 10
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search', '');

        // Validasi per_page value
        $allowedPerPage = [10, 50, 100];
        if (!in_array((int)$perPage, $allowedPerPage)) {
            $perPage = 10;
        }

        // Query dengan search dan pagination
        $storages = Storage::query()
            ->when($search, function ($query, $search) {
                return $query->where('size', 'like', "%{$search}%")
                    ->orWhere('price_admin_annual', 'like', "%{$search}%")
                    ->orWhere('price_admin_monthly', 'like', "%{$search}%")
                    ->orWhere('price_member_annual', 'like', "%{$search}%")
                    ->orWhere('price_member_monthly', 'like', "%{$search}%");
            })
            ->orderBy('size')
            ->paginate($perPage)
            ->withQueryString();

        // Calculate stats
        $allStorages = Storage::all();
        $stats = [
            'min' => $allStorages->min('size') ?? 0,
            'max' => $allStorages->max('size') ?? 0,
            'avgAdmin' => $allStorages->avg('price_admin_annual') ?? 0,
        ];

        return Inertia::render('storages/Index', [
            'storages' => $storages,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'per_page' => (int)$perPage,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('storages/Create');
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

        return redirect()->route('storages.index')->with('success', 'Storage created successfully.');
    }

    public function edit(Storage $storage)
    {
        return Inertia::render('storages/Edit', [
            'storage' => $storage,
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

        return redirect()->route('storages.index')->with('success', 'Storage updated successfully.');
    }

    public function destroy(Storage $storage)
    {
        $storage->delete();

        return redirect()->route('storages.index')->with('success', 'Storage deleted successfully.');
    }
}
