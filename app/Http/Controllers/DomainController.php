<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DomainController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search', '');
        $sortBy = $request->get('sort', 'name');
        $sortOrder = $request->get('order', 'asc');

        // ✅ FIX: Validasi per_page yang lebih lengkap termasuk 25
        $allowedPerPage = [5, 10, 25, 50, 100];
        if (!in_array((int)$perPage, $allowedPerPage)) {
            $perPage = 10;
        }

        // Validate sort field
        $allowedSortFields = ['name', 'privilege', 'created_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'name';
        }

        // Validate sort order
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'asc';

        // ✅ FIX: Clean search input untuk keamanan
        $search = trim($search);

        // Query dengan search yang robust
        $query = Domain::query();

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $domains = $query->orderBy($sortBy, $sortOrder)
                        ->paginate($perPage)
                        ->withQueryString();

        // ✅ IMPROVED: Stats yang lebih berguna
        $allDomains = Domain::all();
        $stats = [
            'total' => $allDomains->count(),
            'total_privileges' => $allDomains->unique('privilege')->count(),
            'most_common' => $this->getMostCommonPrivilege($allDomains),
        ];

        return Inertia::render('domains/Index', [
            'domains' => $domains,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'per_page' => (int)$perPage,
                'sort' => $sortBy,
                'order' => $sortOrder,
            ],
            // ✅ FIX: Tambah flag untuk search result seperti storage
            'hasSearchResults' => !empty($search) && $domains->total() > 0,
            'searchTerm' => $search,
        ]);
    }

    private function getMostCommonPrivilege($domains)
    {
        if ($domains->isEmpty()) return 'No data';
        
        $privilegeCounts = $domains->groupBy('privilege')->map->count();
        $mostCommon = $privilegeCounts->sortDesc()->first();
        $privilegeName = $privilegeCounts->sortDesc()->keys()->first();
        
        return [
            'name' => $privilegeName,
            'count' => $mostCommon,
        ];
    }

    public function create()
    {
        return Inertia::render('domains/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:domains',
            'privilege' => 'required|string|max:255',
        ]);

        Domain::create($request->only(['name', 'privilege']));

        return redirect()->route('domains.index')
            ->with('success', 'Domain created successfully.');
    }

    public function edit(Domain $domain)
    {
        return Inertia::render('domains/Edit', [
            'domain' => $domain,
        ]);
    }

    public function update(Request $request, Domain $domain)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:domains,name,' . $domain->id,
            'privilege' => 'required|string|max:255',
        ]);

        $domain->update($request->only(['name', 'privilege']));

        return redirect()->route('domains.index')
            ->with('success', 'Domain updated successfully.');
    }

    public function destroy(Domain $domain)
    {
        $domain->delete();

        return redirect()->route('domains.index')
            ->with('success', 'Domain deleted successfully.');
    }
}
