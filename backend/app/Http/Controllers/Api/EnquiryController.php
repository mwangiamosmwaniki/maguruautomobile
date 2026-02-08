<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EnquiryNotification;
use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EnquiryController extends Controller
{
    /**
     * Store a new enquiry
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
            'car_id' => 'nullable|exists:cars,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get validated data
            $validatedData = $validator->validated();

            // Create enquiry
            $enquiry = Enquiry::create($validatedData);

            // Send email to configured recipient
            $recipientEmail = env('ENQUIRY_RECIPIENT_EMAIL', 'admin@example.com');
            Mail::to($recipientEmail)->send(new EnquiryNotification($enquiry));

            return response()->json([
                'message' => 'Enquiry submitted successfully',
                'enquiry' => $enquiry
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit enquiry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all enquiries (admin only)
     */
    public function index()
    {
        $enquiries = Enquiry::with('car')->latest()->get();

        return response()->json([
            'enquiries' => $enquiries
        ]);
    }

    /**
     * Get single enquiry
     */
    public function show($id)
    {
        $enquiry = Enquiry::with('car')->find($id);

        if (!$enquiry) {
            return response()->json([
                'message' => 'Enquiry not found'
            ], 404);
        }

        return response()->json([
            'enquiry' => $enquiry
        ]);
    }
}
