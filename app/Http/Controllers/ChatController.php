<?php

	namespace App\Http\Controllers;

	use App\Models\User;
	use Illuminate\Contracts\Support\Renderable;
	use Illuminate\Database\Eloquent\Model;
	use Illuminate\Support\Facades\Auth;
	use Musonza\Chat\Facades\ChatFacade as Chat;

	class ChatController extends Controller {
		public const ROOM_GENERAL_ID = 1;

		/**
		 * @return void
		 */
		public function __construct() {
			$this->middleware('auth');
		}

		/**
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
	}
