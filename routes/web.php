<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('tasks')->middleware(['auth'])->group(function () {
        Route::get('/', [TaskController::class, 'index'])
            ->name('tasks.index');

        Route::post('/create', [TaskController::class, 'store'])
            ->name('tasks.store');
        
        Route::get('/create', [TaskController::class, 'create'])
            ->name('tasks.create');
        
        Route::get('/{task}', [TaskController::class, 'show'])
            ->name('tasks.show');
        
        Route::get('/{task}/edit', [TaskController::class, 'edit'])
            ->name('tasks.edit');

        Route::put('/{task}', [TaskController::class, 'update'])
            ->name('tasks.update');

        Route::delete('/{task}/delete', [TaskController::class, 'destroy'])
            ->name('tasks.destroy');
});

require __DIR__.'/auth.php';
