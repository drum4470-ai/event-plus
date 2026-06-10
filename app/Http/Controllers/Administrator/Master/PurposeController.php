<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Purpose;
use Inertia\Inertia;

class PurposeController extends Controller
{
    public function index() {
        return Inertia::render('administrator/purpose/index', [
            'items' => Purpose::all()
        ]);
    }

    public function create() {
        return Inertia::render('administrator/purpose/create');
    }

    public function show($id) {
        $purpose = Purpose::findOrFail($id);
        return Inertia::render('administrator/purpose/show', [
            'item' => $purpose
        ]);
    }

    public function edit($id) {
        $purpose = Purpose::findOrFail($id);
        return Inertia::render('administrator/purpose/edit', [
            'item' => $purpose
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Purpose::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Purpose::where('purpose_id', $id)->update($validated);
        return redirect()->back();
    }

    public function destroy($id) {
        DB::statement('PRAGMA foreign_keys = OFF');
        Purpose::where('purpose_id', $id)->delete();
        DB::statement('PRAGMA foreign_keys = ON');
        return redirect()->back();
    }
}
