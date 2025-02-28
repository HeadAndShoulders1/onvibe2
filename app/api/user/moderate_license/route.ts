import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    })
  } else {
    const { last_name, first_name, middle_name, date_birth, place_of_birth, number_phone, passport_serial_number, passport_number_number, passport_date_received, passport_recieved_by, passport_office_id, registration_address, bank_account_number, bank_name, signature } = await request.json();
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.update({
      where: {
        email: userEmail
      },
      data: {
        last_name: last_name,
        first_name: first_name,
        middle_name: middle_name,
        date_birth: new Date(date_birth),
        place_of_birth: place_of_birth,
        number_phone: number_phone,
        passport_serial_number: <number>passport_serial_number,
        passport_number_number: <number>passport_number_number,
        passport_date_received: new Date(passport_date_received),
        passport_received_by: passport_recieved_by,
        passport_office_id: passport_office_id,
        registration_address: registration_address,
        bank_account_number: <number>bank_account_number,
        bank_name: bank_name,
        signature: signature,
        license_status: 'Moderate',
      }
    });
    if (userdata) {
      return NextResponse.json({ message: "success" })
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401
      })
    }
  }
}
