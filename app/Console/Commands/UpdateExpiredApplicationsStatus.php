<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Application;
use Carbon\Carbon;

class UpdateExpiredApplicationsStatus extends Command
{
    protected $signature = 'applications:update-expired';
    protected $description = '利用日を1日過ぎたステータスを実施済みに更新します';

public function handle()
{
    $updatedCount = Application::expiredTarget()->update(['status' => '実施済み']);
    $this->info("{$updatedCount}件のステータスを更新しました。");
}
}
