<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Car Enquiry Received</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { background-color: white; padding: 20px; border-radius: 5px; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .label { font-weight: bold; color: #2c3e50; }
        .value { color: #555; margin-top: 5px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Car Enquiry Received</h1>
        </div>
        
        <div class="content">
            <p>You have received a new enquiry from a potential customer.</p>
            
            <div class="field">
                <div class="label">Customer Name:</div>
                <div class="value">{{ $enquiry->name }}</div>
            </div>
            
            <div class="field">
                <div class="label">Email:</div>
                <div class="value">{{ $enquiry->email }}</div>
            </div>
            
            <div class="field">
                <div class="label">Phone:</div>
                <div class="value">{{ $enquiry->phone }}</div>
            </div>
            
            @if($enquiry->car_id)
            <div class="field">
                <div class="label">Car ID:</div>
                <div class="value">#{{ $enquiry->car_id }}</div>
            </div>
            @endif
            
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">{{ $enquiry->message }}</div>
            </div>
            
            <div class="field">
                <div class="label">Received on:</div>
                <div class="value">{{ $enquiry->created_at->format('M d, Y - H:i A') }}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated email from Maguru Auto enquiry system.</p>
        </div>
    </div>
</body>
</html>
