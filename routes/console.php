<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('applications:update-expired', function () {
    $this->call('applications:update-expired');
})->describe('利用日を1日過ぎたステータスを実施済みに更新します');
Artisan::command('applications:delete-old', function () {
    $this->call('applications:delete-old');
})->describe('利用日を1日過ぎたステータスを削除します');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
