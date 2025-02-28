import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { format } from "date-fns";

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
      const { admin } = userdata;
      if (admin == true) {
        const { id_license } = await request.json();

        const userdatafetch = await prisma.user.findUnique({
          where: {
            id: id_license,
          },
        });
        if (userdatafetch && userdatafetch.passport_date_received && userdatafetch.date_birth && userdatafetch.last_name && userdatafetch.first_name && userdatafetch.middle_name && userdatafetch.passport_date_received) {
          let passportString: string = String(userdatafetch.passport_serial_number);
          let date_birth: string = String(userdatafetch.date_birth);
          let passport_date_received: string = String(userdatafetch.passport_date_received);

          let formData = new FormData();
          formData.append('c', 'find');
          formData.append('fam', userdatafetch.last_name);
          formData.append('nam', userdatafetch.first_name);
          formData.append('otch', userdatafetch.middle_name);
          formData.append('bdate', format(new Date(userdatafetch.date_birth), 'dd.MM.yyyy'));
          formData.append('doctype', '21');
          formData.append('docno', passportString.substring(0, 2) + " " + passportString.substring(2, 5) + " " + userdatafetch.passport_number_number);
          formData.append('docdt', format(new Date(userdatafetch.passport_date_received), 'dd.MM.yyyy'));

          const inn_check = await fetch(`https://service.nalog.ru/inn-new-proc.json`, {
            method: 'POST',
            body: formData,
          });

          const dataLicense = await inn_check.json();
          const tokenID = dataLicense.requestId;
          let formTokenID = new FormData();
          formTokenID.append('c', 'get');
          formTokenID.append('requestId', tokenID);
          const inn_check_2 = await fetch(`https://service.nalog.ru/inn-new-proc.json`, {
            method: 'POST',
            body: formTokenID,
          });

          const dataLicenseGET = await inn_check_2.json();
          const state_status = dataLicenseGET.state;
          if (state_status == 1) {
            const inn_new = dataLicenseGET.inn
            const userdatafetch = await prisma.user.update({
              where: {
                id: id_license,
              },
              data: {
                inn: inn_new
              }
            });
            const userdatafetch2 = await prisma.user.findUnique({
              where: {
                id: id_license,
              },
            });

            if (userdatafetch2 && userdatafetch2.passport_date_received && userdatafetch2.date_birth) {
              const responseDataUser = {
                id: userdatafetch2.id,
                last_name: userdatafetch2.last_name,
                first_name: userdatafetch2.first_name,
                middle_name: userdatafetch2.middle_name,
                passport_serial_number: userdatafetch2.passport_serial_number?.toString(),
                passport_number_number: userdatafetch2.passport_number_number?.toString(),
                passport_date_received: format(new Date(userdatafetch2.passport_date_received), 'dd.MM.yyyy'),
                passport_office_id: userdatafetch2.passport_office_id,
                registration_address: userdatafetch2.registration_address,
                passport_received_by: userdatafetch2.passport_received_by,
                email: userdatafetch2.email,
                number_phone: userdatafetch2.number_phone,
                bank_account_number: userdatafetch2.bank_account_number?.toString(),
                bank_name: userdatafetch2.bank_name,
                date_birth: format(new Date(userdatafetch2.date_birth), 'dd.MM.yyyy'),
                place_of_birth: userdatafetch2.place_of_birth,
                username: userdatafetch2.username,
                inn: userdatafetch2.inn?.toString(),
                signature: userdatafetch2.signature,
              };

              return NextResponse.json(responseDataUser);
            }
          } else {
            const userdatafetch2 = await prisma.user.findUnique({
              where: {
                id: id_license,
              },
            });

            if (userdatafetch2 && userdatafetch2.passport_date_received && userdatafetch2.date_birth) {
              const responseDataUser12 = {
                id: userdatafetch2.id,
                last_name: userdatafetch2.last_name,
                first_name: userdatafetch2.first_name,
                middle_name: userdatafetch2.middle_name,
                passport_serial_number: userdatafetch2.passport_serial_number?.toString(),
                passport_number_number: userdatafetch2.passport_number_number?.toString(),
                passport_date_received: format(new Date(userdatafetch2.passport_date_received), 'dd.MM.yyyy'),
                passport_office_id: userdatafetch2.passport_office_id,
                registration_address: userdatafetch2.registration_address,
                passport_received_by: userdatafetch2.passport_received_by,
                email: userdatafetch2.email,
                number_phone: userdatafetch2.number_phone,
                bank_account_number: userdatafetch2.bank_account_number?.toString(),
                bank_name: userdatafetch2.bank_name,
                date_birth: format(new Date(userdatafetch2.date_birth), 'dd.MM.yyyy'),
                place_of_birth: userdatafetch2.place_of_birth,
                username: userdatafetch2.username,
                inn: userdatafetch2.inn?.toString(),
                signature: userdatafetch2.signature,
              };
              return NextResponse.json(responseDataUser12);
            }
          }
        }
      } else {
        return NextResponse.json({ message: "not_admin" })
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401
      })
    }
  }
}