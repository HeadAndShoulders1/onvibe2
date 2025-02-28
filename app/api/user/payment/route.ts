import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
  shopId: process.env.SHOP_ID,
  secretKey: process.env.SHOP_SECRET_KEY
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    })
  } else {
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    });
    if (userdata) {
      const { amount, promocode } = await request.json()

      let amount_in_balance = amount
      let promocode_real = null

      if (promocode != "") {
        const promocode_find = await prisma.promocodes.findFirst({
          where: {
            name:promocode
          }
        })
        if (promocode_find) amount_in_balance = Math.floor(amount_in_balance * 1.1), promocode_real = promocode
      }

      let someFloat = amount.toFixed(2)
      const payment = await yooKassa.createPayment({
        amount: {
          value: someFloat,
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: `${process.env.NEXTAUTH_URL}/dashboard/catalog`
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
                value: someFloat,
                currency: "RUB"
              },
              vat_code: "2",
              payment_mode: "full_prepayment",
              payment_subject: "commodity"
            },
          ]
        },
        description: "ONVIBE"
      });
      const create_payment = await prisma.payment.create({
        data: {
          UserID: userdata.id,
          status: "pending",
          amount: amount_in_balance,
          id_payment: payment.id,
          promocode: promocode_real
        }
      })
      return NextResponse.json({ url: payment.confirmation.confirmation_url })
    }
  }
}