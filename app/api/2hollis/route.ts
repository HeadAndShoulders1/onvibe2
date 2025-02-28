import { NextResponse } from "next/server";

const YooKassa = require('yookassa');
const yooKassa = new YooKassa({
    shopId: process.env.SHOP_ID,
    secretKey: process.env.SHOP_SECRET_KEY
});


export async function POST(req: Request) {
    const { amount, orderId, userId } = await req.json()
    const data = await yooKassa.createPayment({
        amount: {
            value: amount + 450,
            currency: "RUB"
        },
        confirmation: {
            type: "redirect",
            return_url: "https://onvibe.fun/2hollis",
        },
        capture: true,
        receipt: {
            customer: {
                email: "onvibefun@gmail.com"
            },
            items: [
                {
                    description: "Пополнение баланса",
                    quantity: "1.00",

                    amount: {
                        value: amount + 450,
                        currency: "RUB"
                    },
                    vat_code: "2",
                    payment_mode: "full_prepayment",
                    payment_subject: "commodity"
                },
            ]
        },
        metadata: {
            order_id: orderId,
            user_id: userId || null,
        },
        description: "ONVIBE"
    });
    return NextResponse.json(data)
}