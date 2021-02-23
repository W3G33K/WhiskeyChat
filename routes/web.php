<?php

	use App\Http\Controllers\ChatController;
	use App\Http\Controllers\PresentlyTypingController;
	use App\Http\Controllers\UserController;
	use Illuminate\Support\Facades\Route;

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

	Route::get('/room/general', [ChatController::class, 'index'])->name('room.general');

	Route::post('/users/typing', [PresentlyTypingController::class, 'update'])->name('user.typing');
	Route::get('/users/typing', [PresentlyTypingController::class, 'index'])->name('users.typing');

	Route::post('/join', [UserController::class, 'store'])->name('join');
	Route::get('/', [UserController::class, 'create'])->name('login');
