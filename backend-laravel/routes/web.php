<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DatabaseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SeatController;
use App\Http\Controllers\Admin\VisitController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin', [DashboardController::class, 'index'])->name('admin.dashboard');

Route::prefix('admin/category')->group(function (): void {
    Route::get('/', [CategoryController::class, 'index'])->name('admin.category.index');
    Route::get('/create', [CategoryController::class, 'create'])->name('admin.category.create');
    Route::post('/', [CategoryController::class, 'store'])->name('admin.category.store');
    Route::get('/edit/{category}', [CategoryController::class, 'edit'])->name('admin.category.edit');
    Route::post('/update/{category}', [CategoryController::class, 'update'])->name('admin.category.update');
    Route::post('/delete/{category}', [CategoryController::class, 'destroy'])->name('admin.category.destroy');
});

Route::prefix('admin/product')->group(function (): void {
    Route::get('/', [ProductController::class, 'index'])->name('admin.product.index');
    Route::get('/create', [ProductController::class, 'create'])->name('admin.product.create');
    Route::post('/', [ProductController::class, 'store'])->name('admin.product.store');
    Route::get('/edit/{product}', [ProductController::class, 'edit'])->name('admin.product.edit');
    Route::post('/update/{product}', [ProductController::class, 'update'])->name('admin.product.update');
    Route::post('/delete/{product}', [ProductController::class, 'destroy'])->name('admin.product.destroy');
});

Route::prefix('admin/seat')->group(function (): void {
    Route::get('/', [SeatController::class, 'index'])->name('admin.seat.index');
    Route::get('/edit/{seat}', [SeatController::class, 'edit'])->name('admin.seat.edit');
    Route::post('/update/{seat}', [SeatController::class, 'update'])->name('admin.seat.update');
});

Route::prefix('admin/visit')->group(function (): void {
    Route::get('/', [VisitController::class, 'index'])->name('admin.visit.index');
    Route::get('/show/{visit}', [VisitController::class, 'show'])->name('admin.visit.show');
});

Route::match(['get', 'post'], '/admin/database', [DatabaseController::class, 'index'])->name('admin.database');
