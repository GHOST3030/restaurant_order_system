<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Order::with('items')->latest();

        if (! $user->hasAnyRole(['admin', 'manager'])) {
            $query->where('user_id', $user->id);
        } else {
            $query->with('user:id,name,email');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $menuItems = MenuItem::whereIn('id', collect($data['items'])->pluck('id'))->get()->keyBy('id');

            $total = 0;
            $lines = [];
            foreach ($data['items'] as $line) {
                $menuItem = $menuItems[$line['id']];
                $lineTotal = $menuItem->price * $line['quantity'];
                $total += $lineTotal;
                $lines[] = [
                    'menu_item_id' => $menuItem->id,
                    'name' => $menuItem->name_en,
                    'price' => $menuItem->price,
                    'quantity' => $line['quantity'],
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'total' => $total,
                'notes' => $data['notes'] ?? null,
            ]);

            $order->items()->createMany($lines);

            return $order;
        });

        return response()->json($order->load('items'), 201);
    }

    public function show(Request $request, Order $order)
    {
        $user = $request->user();

        if (! $user->hasAnyRole(['admin', 'manager']) && $order->user_id !== $user->id) {
            abort(403);
        }

        return response()->json($order->load('items', 'user:id,name,email'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,preparing,ready,completed,cancelled'],
        ]);

        $order->update(['status' => $data['status']]);

        return response()->json($order->fresh('items'));
    }
}
