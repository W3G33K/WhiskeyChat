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
		 * Create a new controller instance.
		 *
		 * @return void
		 */
		public function __construct() {
			$this->middleware('guest');
		}

		/**
		 * Display a listing of the resource.
		 *
		 * @return Renderable
		 */
		public function create(): Renderable {
			$faker = Factory::create();
			return view('welcome', [
				'placeholder' => $faker->userName,
			]);
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @param Request $request
		 * @return RedirectResponse
		 */
		public function store(Request $request): RedirectResponse {
			// Validate and save user nickname.
			// TODO: Quality of Life Enhancement; Fix issue where multiple users could have the same nickname.
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
