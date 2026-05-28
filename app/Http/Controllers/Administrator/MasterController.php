<?php

namespace App\Http\Controllers\Administrator;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Facility;
use App\Models\Slot;
use App\Models\Equipment;
use App\Models\Purpose;
use Inertia\Inertia;

class MasterController extends Controller
{
    public function index()
    {
        $mode = request()->query('mode', 'create');
        return Inertia::render('administrator/master-selection', [
            'mode' => $mode
        ]);
    }

    public function editIndex()
    {
        return Inertia::render('administrator/master-selection', [
            'mode' => 'edit'
        ]);
    }

    public function create($type) 
    {
    $existingNames = match($type) {
        'building'  => Building::pluck('name'),
        'facility'  => Facility::select('name', 'building_id')->get(),
        'slot'      => Slot::pluck('name'),
        'equipment' => Equipment::pluck('name'),
        'purpose'   => Purpose::pluck('name'),
        default     => [],
    };

    $buildings = $type === 'facility' ? Building::select('building_id', 'name')->get() : [];

    return Inertia::render('administrator/master-registration', [
        'type' => $type,
        'existingNames' => $existingNames,
        'buildings' => $buildings,
    ]);

    }

    public function store(Request $request)
    {
        $type = $request->input('type');

        $validated = $request->validate([
            'type'        => 'required|string|in:building,facility,slot,equipment,purpose',
            'name'        => 'required|string|max:255',
            'address'     => $type === 'building' ? 'required|string' : 'nullable|string',
            'building_id' => $type === 'facility' ? 'required|exists:buildings,building_id' : 'nullable',
        ]);

        switch ($type) {
            case 'building':
                Building::create([
                    'name'    => $validated['name'],
                    'address' => $validated['address'],
                ]);
                break;
                
            case 'facility':
                Facility::create([
                    'name'        => $validated['name'],
                    'building_id' => $validated['building_id'],
                ]);
                break;
                
            case 'slot':
            case 'equipment':
            case 'purpose':
                $modelClass = match($type) {
                    'slot'      => Slot::class,
                    'equipment' => Equipment::class,
                    'purpose'   => Purpose::class,
                };
                $modelClass::create(['name' => $validated['name']]);
                break;
        }

        return redirect()->back();
    }

    public function edit(Request $request)
    {
        $type = $request->query('type');

        $items = match($type) {
            'building'  => Building::all(),
            'facility'  => Facility::with('building')->get(),
            'slot'      => Slot::all(),
            'equipment' => Equipment::all(),
            'purpose'   => Purpose::all(),
            default     => abort(404),
        };

        $buildings = $type === 'facility' ? Building::select('building_id', 'name')->get() : [];

        return Inertia::render('administrator/master-edit', [
            'type'      => $type,
            'items'     => $items,
            'buildings' => $buildings,
        ]);
    }

    public function update(Request $request, $id)
    {
        $type = $request->input('type');
        
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'address'     => $type === 'building' ? 'required|string' : 'nullable|string',
            'building_id' => $type === 'facility' ? 'required|exists:buildings,building_id' : 'nullable',
        ]);

        switch ($type) {
            case 'building':
                Building::findOrFail($id)->update([
                    'name'    => $validated['name'],
                    'address' => $validated['address'],
                ]);
                break;
                
            case 'facility':
                Facility::findOrFail($id)->update([
                    'name'        => $validated['name'],
                    'building_id' => $validated['building_id'],
                ]);
                break;
                
            default:
                $modelClass = match($type) {
                    'slot'      => Slot::class,
                    'equipment' => Equipment::class,
                    'purpose'   => Purpose::class,
                    default     => abort(400, 'Invalid master type'),
                };
                $modelClass::findOrFail($id)->update(['name' => $validated['name']]);
                break;
        }

        return redirect()->route('administrator.master.edit', ['type' => $type])->with('message', '更新が完了しました');
    }

    public function destroy(Request $request, $id)
    {
        $type = $request->input('type');

        $modelClass = match($type) {
            'building'  => Building::class,
            'facility'  => Facility::class,
            'slot'      => Slot::class,
            'equipment' => Equipment::class,
            'purpose'   => Purpose::class,
            default     => abort(400, 'Invalid master type'),
        };

        $modelClass::findOrFail($id)->delete();

        return redirect()->route('administrator.master.edit', ['type' => $type])->with('message', '削除が完了しました');
    }
}