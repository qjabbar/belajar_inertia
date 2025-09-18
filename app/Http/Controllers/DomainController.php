<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DomainController extends Controller
{
    public function index()
    {
        return Inertia::render('domains/Index', [
            'domains' => Domain::orderBy('name')->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('domains/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'privilege' => 'required|string|max:255',
        ]);

        Domain::create($request->only(['name', 'privilege']));

        return redirect()->route('domains.index')->with('success', 'Domain created successfully.');
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
            'name' => 'required|string|max:255',
            'privilege' => 'required|string|max:255',
        ]);

        $domain->update($request->only(['name', 'privilege']));

        return redirect()->route('domains.index')->with('success', 'Domain updated successfully.');
    }

    public function destroy(Domain $domain)
    {
        $domain->delete();

        return redirect()->route('domains.index')->with('success', 'Domain deleted successfully.');
    }
}
