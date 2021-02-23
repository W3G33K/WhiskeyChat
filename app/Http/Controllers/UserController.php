<?php

	namespace App\Http\Controllers;

	use App\Models\User;
	use Faker\Factory;
	use Illuminate\Contracts\Support\Renderable;
	use Illuminate\Http\RedirectResponse;
	use Illuminate\Http\Request;
	use Illuminate\Http\Response;
	use Illuminate\Support\Facades\Auth;
	use Musonza\Chat\Facades\ChatFacade as Chat;

	class UserController extends Controller {

		/**
		 * @return void
		 */
		public function __construct() {
			$this->middleware('guest');
		}

		/**
		 * @return Renderable
		 */
		public function create(): Renderable {
			$faker = Factory::create();
			return view('welcome', [
				'placeholder' => $faker->userName,
			]);
		}

		/**
		 * @param Request $request
		 * @return RedirectResponse
		 */
		public function store(Request $request): RedirectResponse {
			// TODO: Quality of Life Enhancement; Fix an issue where multiple users could have the same nickname?
			// Validate and save user nickname.
			$attributes = $this->validator($request);
			$user = User::create($attributes);
			$user->save();

			// Force authentication of user and redirect.
			Auth::login($user, true);
			return redirect()->route('room.general');
		}

		private function validator(Request $request): array {
			return $request->validate([
				'nickname' => 'required|max:24|min:3|regex:/^[\w\._]+$/i',
			]);
		}
	}
