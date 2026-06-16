<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Slot;
use Inertia\Inertia;

class SlotController extends Controller
{
    public function index() {
        return Inertia::render('administrator/slot/index', [
            'items' => Slot::all()
        ]);
    }

    public function create() {
        return Inertia::render('administrator/slot/create');
    }

    public function show($id) {
        $slot = Slot::findOrFail($id);
        return Inertia::render('administrator/slot/show', [
            'item' => $slot
        ]);
    }

    public function edit($id) {
        $slot = Slot::findOrFail($id);
        return Inertia::render('administrator/slot/edit', [
            'item' => $slot
        ]);
    }

    public function store(Request $request) {
        Slot::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, $id) {

        Slot::where('slot_id', $id)->update($request->all());
        return redirect()->back();
    }

    public function destroy($id) {
        DB::statement('PRAGMA foreign_keys = OFF');
        Slot::where('slot_id', $id)->delete();
        DB::statement('PRAGMA foreign_keys = ON');
        return redirect()->back();
    }
}
