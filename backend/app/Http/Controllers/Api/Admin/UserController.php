<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('name')->get());
    }

    public function updateRole(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => ['required', 'in:admin,manager,user'],
        ]);

        $user->syncRoles([$data['role']]);

        return response()->json($user->fresh());
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            abort(422, 'You cannot delete your own account.');
        }

        $user->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
