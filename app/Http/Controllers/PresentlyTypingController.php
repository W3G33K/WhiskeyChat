<?php

	namespace App\Http\Controllers;

	use App\Models\User;
	use Illuminate\Http\Request;
	use Illuminate\Http\Response;
	use Illuminate\Support\Collection;
	use Illuminate\Support\Facades\Auth;

	class PresentlyTypingController extends Controller {
		/**
		 * @return void
		 */
		public function __construct() {
			$this->middleware('auth');
		}

		/**
		 * @return Collection
		 */
		public function index(): Collection {
			return User::presentlyTyping()->pluck('nickname');
		}

		/**
		 * @param Request $request
		 * @return string
		 */
		public function update(Request $request): string {
			$attributes = $this->validator($request);
			$user = Auth::user();
			$user->is_typing = $attributes['is_typing'];
			$user->save();

			return $attributes['is_typing'];
		}

		private function validator(Request $request): array {
			return $request->validate([
				'is_typing' => 'required|digits_between:0,1',
			]);
		}
	}
