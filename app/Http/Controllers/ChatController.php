<?php

	namespace App\Http\Controllers;

	use App\Models\User;
	use Illuminate\Contracts\Support\Renderable;
	use Illuminate\Database\Eloquent\Model;
	use Illuminate\Http\Request;
	use Illuminate\Http\Response;
	use Illuminate\Support\Arr;
	use Illuminate\Support\Facades\Auth;
	use Musonza\Chat\Facades\ChatFacade as Chat;

	class ChatController extends Controller {
		public const ROOM_GENERAL_ID = 1;

		/**
		 * Create a new controller instance.
		 *
		 * @return void
		 */
		public function __construct() {
			$this->middleware('auth');
		}

		/**
		 * Display a listing of the resource.
		 *
		 * @return Renderable
		 */
		public function index(): Renderable {
			$conversation = Chat::conversations()
								->getById(static::ROOM_GENERAL_ID);
			if (is_null($conversation)) {
				$conversation = Chat::createConversation([])
									->makePrivate(false);
				$conversation->update([
					'title' => 'General Room',
					'description' => 'Talk about anything and everything.'
				]);
			}

			$user = Auth::user();
			$participants = $conversation->getParticipants();
			$filtered = $participants->filter(fn(User $participant): bool =>
				($user instanceof Model && $participant->is($user)));
			$count = $filtered->count();
			if (is_numeric($count) && empty($count)) {
				Chat::conversation($conversation)
					->addParticipants(compact('user'));
			}

			return view('chat', [
				'participant' => [
					'id' => $user->id,
					'nickname' => $user->nickname,
					'type' => get_class($user)
				]
			]);
		}

		/**
		 * Show the form for creating a new resource.
		 *
		 * @return Response
		 */
		public function create(): Response {
			return new Response('ChatController@create');
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @param Request $request
		 * @return Response
		 */
		public function store(Request $request): Response {
			return new Response('ChatController@store');
		}

		/**
		 * Display the specified resource.
		 *
		 * @param User $user
		 * @return Response
		 */
		public function show(User $user): Response {
			return new Response('ChatController@show');
		}

		/**
		 * Show the form for editing the specified resource.
		 *
		 * @param User $user
		 * @return Response
		 */
		public function edit(User $user): Response {
			return new Response('ChatController@edit');
		}

		/**
		 * Update the specified resource in storage.
		 *
		 * @param Request $request
		 * @param User $user
		 * @return Response
		 */
		public function update(Request $request, User $user): Response {
			return new Response('ChatController@update');
		}

		/**
		 * Remove the specified resource from storage.
		 *
		 * @param User $user
		 * @return Response
		 */
		public function destroy(User $user): Response {
			return new Response('ChatController@destroy');
		}
	}
