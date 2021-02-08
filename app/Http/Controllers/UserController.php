<?php

	namespace App\Http\Controllers;

	use App\Models\User;
	use Faker\Factory;
	use Illuminate\Contracts\Support\Renderable;
	use Illuminate\Http\Request;
	use Illuminate\Http\Response;
	use Musonza\Chat\Facades\ChatFacade as Chat;

	class UserController extends Controller {
		/**
		 * Display a listing of the resource.
		 *
		 * @return Renderable
		 */
		public function create(): Renderable {
			$faker = Factory::create();
			return view('welcome', [
				'placeholder' => $faker->userName
			]);
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @param Request $request
		 * @return string
		 */
		public function store(Request $request): string {
			$nickname = $request->get('nickname');
			$user = new User(compact('nickname'));
			$user->id = floor(microtime(true));
			$conversation = Chat::createConversation([$user])->makePrivate(false);

			return $conversation->toJson();
		}
	}
