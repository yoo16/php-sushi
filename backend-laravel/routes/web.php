<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SeatController;
use App\Http\Controllers\Admin\VisitController;
use App\Http\Controllers\Api\CategoryController as ApiCategoryController;
use App\Http\Controllers\Api\OrderController as ApiOrderController;
use App\Http\Controllers\Api\ProductController as ApiProductController;
use App\Http\Controllers\Api\SeatController as ApiSeatController;
use App\Http\Controllers\Api\VisitController as ApiVisitController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin/category')->group(function (): void {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('create.php', [CategoryController::class, 'create']);
    Route::post('add.php', [CategoryController::class, 'store']);
    Route::get('edit.php', [CategoryController::class, 'edit']);
    Route::post('update.php', [CategoryController::class, 'update']);
    Route::post('delete.php', [CategoryController::class, 'destroy']);
});

Route::prefix('admin/product')->group(function (): void {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('create.php', [ProductController::class, 'create']);
    Route::post('add.php', [ProductController::class, 'store']);
    Route::get('edit.php', [ProductController::class, 'edit']);
    Route::post('update.php', [ProductController::class, 'update']);
    Route::post('delete.php', [ProductController::class, 'destroy']);
});

Route::prefix('admin/seat')->group(function (): void {
    Route::get('/', [SeatController::class, 'index']);
    Route::get('edit.php', [SeatController::class, 'edit']);
    Route::post('update.php', [SeatController::class, 'update']);
});

Route::prefix('admin/visit')->group(function (): void {
    Route::get('/', [VisitController::class, 'index']);
    Route::get('show.php', [VisitController::class, 'show']);
});

Route::middleware('api')->prefix('api')->group(function (): void {
    Route::get('category/fetch.php', [ApiCategoryController::class, 'index']);
    Route::get('product/fetch.php', [ApiProductController::class, 'index']);
    Route::get('seat/fetch.php', [ApiSeatController::class, 'index']);
    Route::get('seat/available.php', [ApiSeatController::class, 'available']);
    Route::get('seat/find.php', [ApiSeatController::class, 'show']);
    Route::get('visit/find.php', [ApiVisitController::class, 'show']);
    Route::post('visit/join.php', [ApiVisitController::class, 'join']);
    Route::get('order/fetch.php', [ApiOrderController::class, 'index']);
    Route::post('order/add.php', [ApiOrderController::class, 'store']);
    Route::post('order/billed.php', [ApiOrderController::class, 'bill']);
});
