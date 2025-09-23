<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\System\MenuController;
use App\Http\Controllers\System\RoleController;
use App\Http\Controllers\System\UserController;
use App\Http\Controllers\System\BackupController;
use App\Http\Controllers\System\AuditLogController;
use App\Http\Controllers\System\UserFileController;
use App\Http\Controllers\System\PermissionController;
use App\Http\Controllers\System\SettingAppController;
use App\Http\Controllers\System\MediaFolderController;
use App\Http\Controllers\Admin\DomainController;
use App\Http\Controllers\Admin\StorageController;
use App\Http\Controllers\System\DashboardSystemController;
use App\Http\Controllers\Admin\DashboardAdminController;
use App\Http\Controllers\Reseller\DashboardResellerController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'menu.permission'])->group(function () {
    // Separate dashboard routes for each role
    Route::get('/dashboard-system', [DashboardSystemController::class, 'index'])
        ->middleware('can:dashboard-system-view')
        ->name('dashboard.system');

    Route::get('/dashboard-admin', [DashboardAdminController::class, 'index'])
        ->middleware('can:dashboard-admin-view')
        ->name('dashboard.admin');

    Route::get('/dashboard-reseller', [DashboardResellerController::class, 'index'])
        ->middleware('can:dashboard-reseller-view')
        ->name('dashboard.reseller');

    Route::resource('roles', RoleController::class);
    Route::resource('menus', MenuController::class);
    Route::post('menus/reorder', [MenuController::class, 'reorder'])->name('menus.reorder');
    Route::resource('permissions', PermissionController::class);
    Route::resource('users', UserController::class);
    Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::get('/settingsapp', [SettingAppController::class, 'edit'])->name('setting.edit');
    Route::post('/settingsapp', [SettingAppController::class, 'update'])->name('setting.update');
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
    Route::post('/backup/run', [BackupController::class, 'run'])->name('backup.run');
    Route::get('/backup/download/{file}', [BackupController::class, 'download'])->name('backup.download');
    Route::delete('/backup/delete/{file}', [BackupController::class, 'delete'])->name('backup.delete');
    Route::get('/files', [UserFileController::class, 'index'])->name('files.index');
    Route::post('/files', [UserFileController::class, 'store'])->name('files.store');
    Route::delete('/files/{id}', [UserFileController::class, 'destroy'])->name('files.destroy');
    Route::resource('media', MediaFolderController::class);
    Route::resource('domains', DomainController::class);
    Route::resource('storages', StorageController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
