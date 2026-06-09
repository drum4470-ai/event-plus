<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
        Slot::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);
        Slot::where('slot_id', $id)->update($validated);
        return redirect()->back();
    }

    public function destroy($id) {
        Slot::where('slot_id', $id)->delete();
        return redirect()->back();
    }
}
