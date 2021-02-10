<?php

	namespace App\Models;

	use Illuminate\Database\Eloquent\Factories\HasFactory;
	use Illuminate\Foundation\Auth\User as Authenticatable;
	use Musonza\Chat\Traits\Messageable;

	class User extends Authenticatable {
		use HasFactory, Messageable;

		/**
		 * The attributes that are mass assignable.
		 *
		 * @var array
		 */
		protected $fillable = [
			'nickname',
		];

		/**
		 * The attributes that should be hidden for arrays.
		 *
		 * @var array
		 */
		protected $hidden = [
			'created_at',
			'remember_token',
			'updated_at',
		];
	}
