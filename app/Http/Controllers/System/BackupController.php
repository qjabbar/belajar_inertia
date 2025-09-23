<?php

namespace App\Http\Controllers\System;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class BackupController extends \App\Http\Controllers\Controller
{
    protected string $backupPath;

    public function __construct()
    {
        $appName = config('app.name');
        $this->backupPath = 'private/' . $appName;
    }

    public function index()
    {
        $realPath = storage_path('app/' . $this->backupPath);

        $backups = [];
        if (File::exists($realPath)) {
            $files = File::files($realPath);
            $backups = collect($files)
                ->filter(fn($file) => $file->getExtension() === 'zip')
                ->map(fn($file) => [
                    'name' => $file->getFilename(),
                    'size' => $file->getSize(),
                    'last_modified' => $file->getMTime(),
                    'download_url' => route('backup.download', ['file' => $file->getFilename()]),
                ])
                ->sortByDesc('last_modified')
                ->values()
                ->all();
        }

        return \Inertia\Inertia::render('backup/Index', [
            'backups' => $backups,
        ]);
    }

    public function run()
    {
        Artisan::call('backup:run --only-db');
        return redirect()->back()->with('success', 'Backup berhasil dibuat.');
    }

    public function download($file)
    {
        $path = storage_path('app/' . $this->backupPath . '/' . $file);

        if (!file_exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return response()->download($path);
    }

    public function delete($file)
    {
        $path = storage_path('app/' . $this->backupPath . '/' . $file);

        if (!file_exists($path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan.');
        }

        unlink($path);

        return redirect()->back()->with('success', 'Backup berhasil dihapus.');
    }
}
