<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::command('applications:update-expired')->everyMinute();
Schedule::command('applications:delete-old')->everyMinute();
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

//デプロイ先に自動化の設定をしない限り手動でないと動かない↓
//  * * * * * cd /path/to/event-plus && php artisan schedule:run >> /dev/null 2>&1