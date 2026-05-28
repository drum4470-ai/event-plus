<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Run MasterDataSeeder
$seeder = new \Database\Seeders\MasterDataSeeder();
$seeder->run();

echo "✅ MasterDataSeeder executed successfully!\n";
?>
