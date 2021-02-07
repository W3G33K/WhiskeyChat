<?php

	namespace App\Models;

	use Illuminate\Database\Eloquent\Model;
	use Musonza\Chat\Traits\Messageable;

	class User extends Model {
		use Messageable;

		/**
		 * The attributes that are mass assignable.
		 *
		 * @var array
		 */
		protected $fillable = [
			'nickname'
		];
	}
