<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::latest()->get();
        
        // Add full URLs to images
        $cars = $cars->map(function ($car) {
            if ($car->images) {
                $car->images = array_map(fn($url) => $this->getFullImageUrl($url), $car->images);
            }
            if ($car->image_url) {
                $car->image_url = $this->getFullImageUrl($car->image_url);
            }
            return $car;
        });
        
        return response()->json($cars);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'price' => 'required|numeric|min:0',
            'transmission' => 'required|string',
            'fuel_type' => 'required|string',
            'body_type' => 'required|string',
            'color' => 'required|string',
            'condition' => 'required|string',
            'status' => 'required|string',
            'images' => 'nullable|array|min:2|max:6',
            'images.*' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        // Set image_url from first image if images array exists
        if (isset($data['images']) && is_array($data['images']) && count($data['images']) > 0) {
            $data['image_url'] = $data['images'][0];
        }

        $car = Car::create($data);

        // Add full URLs to images
        if ($car->images) {
            $car->images = array_map(fn($url) => $this->getFullImageUrl($url), $car->images);
        }
        if ($car->image_url) {
            $car->image_url = $this->getFullImageUrl($car->image_url);
        }

        return response()->json($car, 201);
    }

    public function show($id)
    {
        $car = Car::find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        // Add full URLs to images
        if ($car->images) {
            $car->images = array_map(fn($url) => $this->getFullImageUrl($url), $car->images);
        }
        if ($car->image_url) {
            $car->image_url = $this->getFullImageUrl($car->image_url);
        }

        return response()->json($car);
    }

    public function update(Request $request, $id)
    {
        $car = Car::find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'make' => 'sometimes|required|string|max:100',
            'model' => 'sometimes|required|string|max:100',
            'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'price' => 'sometimes|required|numeric|min:0',
            'images' => 'nullable|array|min:2|max:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        
        // Update image_url from first image if images array exists
        if (isset($data['images']) && is_array($data['images']) && count($data['images']) > 0) {
            $data['image_url'] = $data['images'][0];
        }

        $car->update($data);

        // Add full URLs to images
        if ($car->images) {
            $car->images = array_map(fn($url) => $this->getFullImageUrl($url), $car->images);
        }
        if ($car->image_url) {
            $car->image_url = $this->getFullImageUrl($car->image_url);
        }

        return response()->json($car);
    }

    public function destroy($id)
    {
        $car = Car::find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        $car->delete();

        return response()->json(['message' => 'Car deleted successfully']);
    }

    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid image',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('cars', $filename, 'public');
            
            $url = Storage::url($path);
            $fullUrl = $this->getFullImageUrl($url);
            
            return response()->json([
                'url' => $fullUrl,
                'path' => $path
            ]);
        }

        return response()->json(['message' => 'No image provided'], 400);
    }

    private function getFullImageUrl($url)
    {
        if (!$url) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        // If it's a relative URL, prepend the app URL
        return rtrim(config('app.url'), '/') . $url;
    }
}