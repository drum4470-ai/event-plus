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
        // 必要であれば名前などのバリデーションを追加してください
        $validated = $request->validate([
            'name' => 'required|string|max:255', 
        ]);
        
        Slot::create($validated);
        return redirect()->route('admin.slots.index'); // リダイレクト先は適宜調整してください
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        Slot::where('slot_id', $id)->update($validated);
        return redirect()->route('admin.slots.index');
    }

    public function destroy($id) {
        // 外部キー制約の制御は本来DB設計側で管理すべきですが、現状維持で記述します
        DB::statement('PRAGMA foreign_keys = OFF');
        Slot::where('slot_id', $id)->delete();
        DB::statement('PRAGMA foreign_keys = ON');
        
        return redirect()->back();
    }
}