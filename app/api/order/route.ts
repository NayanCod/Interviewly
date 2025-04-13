import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST() {
    const amount = 49; // Amount in INR 
    const currency = 'INR'; // Currency code
    const receipt = `receipt_${Math.floor(Math.random() * 100000)}`; // Unique receipt ID
    const payment_capture = 1; // Auto capture payment

    const options = {
        amount: (amount * 100).toString(),
        currency: currency,
        receipt: receipt,
        payment_capture: payment_capture,
    };
    try {
        const order = await razorpay.orders.create(options);
        // console.log(order);
        
        return NextResponse.json({orderId: order.id, currency: order.currency, amount: order.amount}, { status: 200 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });  
    }
}