import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { format } from "date-fns";

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
    });
  } else {
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (userdata) {
      const { admin } = userdata;
      if (admin == true) {
        const { id_license } = await request.json();

        const userdatafetch = await prisma.user.findUnique({
          where: {
            id: id_license,
          },
        });

        if (userdatafetch && userdatafetch.passport_date_received && userdatafetch.date_birth) {
          const responseDataUser = {
            id: userdatafetch.id,
            last_name: userdatafetch.last_name,
            first_name: userdatafetch.first_name,
            middle_name: userdatafetch.middle_name,
            passport_serial_number: userdatafetch.passport_serial_number?.toString(),
            passport_number_number: userdatafetch.passport_number_number?.toString(),
            passport_date_received: format(new Date(userdatafetch.passport_date_received), 'dd.MM.yyyy'),
            passport_office_id: userdatafetch.passport_office_id,
            registration_address: userdatafetch.registration_address,
            passport_received_by: userdatafetch.passport_received_by,
            email: userdatafetch.email,
            number_phone: userdatafetch.number_phone,
            bank_account_number: userdatafetch.bank_account_number?.toString(),
            bank_name: userdatafetch.bank_name,
            date_birth: format(new Date(userdatafetch.date_birth), 'dd.MM.yyyy'),
            place_of_birth: userdatafetch.place_of_birth,
            username: userdatafetch.username,
            inn: userdatafetch.inn?.toString(),
            signature: userdatafetch.signature,
          };

          return NextResponse.json(responseDataUser);
        } else {
          return NextResponse.json({ message: 'false' });
        }
      } else {
        return NextResponse.json({ admin });
      }
    } else {
      return NextResponse.json({ message: "not_admin" })
    }
  }
}
