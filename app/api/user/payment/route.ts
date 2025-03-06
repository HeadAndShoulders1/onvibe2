import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { createHash } from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
            name: promocode
          }
        })
        if (promocode_find) amount_in_balance = Math.floor(amount_in_balance * 1.1), promocode_real = promocode
      }
      let someFloat = amount_in_balance.toFixed(2)

      const payment_last = await prisma.payment.findFirst({
        orderBy: {
          id: 'desc'
        }
      })
      if (payment_last) {
        const create_payment = await prisma.payment.create({
          data: {
            id: payment_last.id + 1,
            UserID: userdata.id,
            status: "pending",
            amount: Number(someFloat),
            promocode: promocode_real
          }
        })
        const payment_amount = Number(amount) * 100
        const order_id = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        let decodedPassword = '';
        if (process.env.PAYMENT_PASSWORD) {
          decodedPassword = Buffer.from(process.env.PAYMENT_PASSWORD, 'base64').toString('utf-8');
        } else {
          console.error('PAYMENT_PASSWORD is not defined');
        }
        const token = payment_amount + "Пополнение баланса" + order_id + decodedPassword + process.env.PAYMENT_LOGIN
        const tokenSha256 = createHash('sha256')
          .update(new TextEncoder().encode(token))
          .digest('hex');
        console.log(token)
        const create_payment_tin = await axios.post(`https://securepay.tinkoff.ru/v2/Init`,
          {
            "TerminalKey": process.env.PAYMENT_LOGIN,
            "Amount": payment_amount,
            "OrderId": order_id,
            "Description": "Пополнение баланса",
            "Token": tokenSha256,
            "Receipt": {
              "Email": userdata.email,
              "Taxation": "osn",
              "Items": [
                {
                  "Name": "Пополнение баланса",
                  "Price": payment_amount,
                  "Quantity": 1,
                  "Amount": payment_amount,
                  "Tax": "vat10",
                },
              ]
            }
          }
        );
        console.log(create_payment_tin.data)
        const update_payment = await prisma.payment.update({
          where: {
            id: create_payment.id
          },
          data: {
            id_payment: create_payment_tin.data.PaymentId
          }
        })
        return NextResponse.json({ url: create_payment_tin.data.PaymentURL })
      }
    }
  }
}