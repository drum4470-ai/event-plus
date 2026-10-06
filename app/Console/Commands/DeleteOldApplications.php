<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Application;
use Carbon\Carbon;

class DeleteOldApplications extends Command
{
    // 
    protected $signature = 'applications:delete-old';

    // コマンドの説明
    protected $description = '利用日（または作成日）から2年過ぎた古いApplicationデータを削除します';

    public function handle()
    {
        $threshold = Carbon::now()->subYears(2);

        $query = Application::where('usage_date', '<', $threshold);

        $deletedCount = $query->delete();


        $this->info("{$deletedCount}件の古いApplicationデータを削除しました。");
    }
}
