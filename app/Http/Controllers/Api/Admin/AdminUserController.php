<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::select('id', 'name', 'email', 'phone', 'gender', 'date_of_birth', 'created_at')
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with('addresses')->findOrFail($id);
        return response()->json(['user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female,other',
            'date_of_birth' => 'nullable|date',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Customer updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Delete associated addresses first
        $user->addresses()->delete();

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'Customer deleted successfully.']);
    }
}
