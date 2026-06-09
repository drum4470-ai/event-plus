<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MasterManagementController extends Controller
{
    public function index(Request $request)
    {
        // 必要なデータをモデルから取得（例）
        $buildings = \App\Models\Building::all()->sortBy('name')->values();
        $facilities = \App\Models\Facility::all()->sortBy('name')->values();
        $equipments = \App\Models\Equipment::all()->sortBy('name')->values();
        $purposes = \App\Models\Purpose::all()->sortBy('name')->values();
        $slots = \App\Models\Slot::all()->sortBy('name')->values();

        return Inertia::render('Administrator/MasterManagement', [
            'buildings' => $buildings,
            'facilities' => $facilities,
            'equipments' => $equipments,
            'purposes' => $purposes,
            'slots' => $slots,
            // ページロード時に表示するタブをURLパラメータ(tab)から取得
            'initialTab' => $request->query('tab', 'registration'),
        ]);
    }
}