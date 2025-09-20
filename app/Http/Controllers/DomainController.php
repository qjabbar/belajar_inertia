<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DomainController extends Controller
{
    public function index(Request $request)
    {
        // Get pagination and search parameters
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search', '');
        $sortBy = $request->get('sort', 'name');
        $sortOrder = $request->get('order', 'asc');

        // Validate per_page value
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

        // Query with search, sorting and pagination
        $domains = Domain::query()
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                           ->orWhere('privilege', 'like', "%{$search}%");
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage)
            ->withQueryString();

        // Calculate stats
        $stats = [
            'total' => Domain::count(),
            'total_privileges' => Domain::distinct('privilege')->count(),
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
        ]);
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
