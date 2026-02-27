<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserAddressController extends Controller
{
    /**
     * List all addresses for the authenticated user.
     */
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->get();

        return response()->json(['addresses' => $addresses]);
    }

    /**
     * Store a new address. First address auto-becomes default.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_label' => 'required|string|max:50',
            'recipient_name' => 'required|string|max:150',
            'recipient_phone' => 'required|string|max:30',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postcode' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ]);

        $user = $request->user();
        $hasAddresses = $user->addresses()->exists();

        // First address is always default; or if caller asks for default
        $makeDefault = !$hasAddresses || ($validated['is_default'] ?? false);

        DB::transaction(function () use ($user, $validated, $makeDefault) {
            if ($makeDefault) {
                $user->addresses()->update(['is_default' => false]);
            }

            $validated['user_id'] = $user->id;
            $validated['is_default'] = $makeDefault;

            UserAddress::create($validated);
        });

        return response()->json([
            'message' => 'Address added successfully.',
            'addresses' => $user->addresses()->get(),
        ], 201);
    }

    /**
     * Show a single address.
     */
    public function show(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        return response()->json(['address' => $address]);
    }

    /**
     * Update an existing address.
     */
    public function update(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'address_label' => 'sometimes|required|string|max:50',
            'recipient_name' => 'sometimes|required|string|max:150',
            'recipient_phone' => 'sometimes|required|string|max:30',
            'address_line1' => 'sometimes|required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'postcode' => 'sometimes|required|string|max:20',
            'country' => 'sometimes|required|string|max:100',
            'is_default' => 'boolean',
        ]);

        DB::transaction(function () use ($request, $address, $validated) {
            if (!empty($validated['is_default'])) {
                $request->user()->addresses()->update(['is_default' => false]);
            }
            $address->update($validated);
        });

        return response()->json([
            'message' => 'Address updated successfully.',
            'addresses' => $request->user()->addresses()->get(),
        ]);
    }

    /**
     * Delete an address. If it was default, promote the next address.
     */
    public function destroy(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $wasDefault = $address->is_default;

        $address->delete();

        if ($wasDefault) {
            $next = $request->user()->addresses()->orderBy('created_at')->first();
            if ($next) {
                $next->update(['is_default' => true]);
            }
        }

        return response()->json([
            'message' => 'Address deleted successfully.',
            'addresses' => $request->user()->addresses()->get(),
        ]);
    }

    /**
     * Set an address as the default.
     */
    public function setDefault(Request $request, $id)
    {
        $user = $request->user();
        $address = $user->addresses()->findOrFail($id);

        DB::transaction(function () use ($user, $address) {
            $user->addresses()->update(['is_default' => false]);
            $address->update(['is_default' => true]);
        });

        return response()->json([
            'message' => 'Default address updated.',
            'addresses' => $user->addresses()->get(),
        ]);
    }
}
