import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    });
  } else {
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    });

    if (userdata?.admin == true) {
      const { name, skip, take, status, page } = await request.json();

      const totalReleasesCount = await prisma.user.count({
        where: {
          username: {
            contains: name
          },
          license_status: {
            equals: status
          }
        }
      });

      const totalPages = Math.ceil(totalReleasesCount / (take || 10));

      const user_releases = await prisma.user.findMany({
        where: {
          username: {
            contains: name
          },
          license_status: {
            equals: status
          }
        },
        orderBy: {
          id: 'desc' // 'asc' для сортировки по возрастанию, 'desc' для сортировки по убыванию
        },
        skip: skip ? parseInt(skip as string, 10) : undefined,
        take: take ? parseInt(take as string, 10) : undefined,
      });

      if (user_releases.length > 0) {
        const releasesWithTracks = [];

        for (const release of user_releases) {
          const releaseId = release.id;
          const subscribe = await prisma.subscribe.findMany({
            where: {
              UserID: releaseId
            },
            orderBy: {
              id: 'desc'
            },
          });
          const relase_all_count = await prisma.release.count({
            where: {
              owner: releaseId
            }
          });
          let inn = ''
          if (release.inn) {
            inn = release.inn.toString()
          }
          let bank_number = ''
          if (release.bank_account_number) {
            bank_number = release.bank_account_number.toString()
          }
          const releaseWithTracks = {
            id: release.id,
            createdAt: release.createdAt,
            username: release.username,
            email: release.email,
            password: release.passwordHash,
            license_status: release.license_status,
            balance: release.balance,
            admin: release.admin,
            count_release: relase_all_count,
            license: {
              id: release.id,
              email: release.email,
              username: release.username,
              last_name: release.last_name,
              first_name: release.first_name,
              middle_name: release.middle_name,
              place_of_birth: release.place_of_birth,
              passport_received_by: release.passport_received_by,
              passport_office_id: release.passport_office_id,
              registration_address: release.registration_address,
              bank_name: release.bank_name,
              date_birth: release.date_birth,
              number_phone: release.number_phone,
              passport_serial_number: release.passport_serial_number,
              passport_number_number: release.passport_number_number,
              signature: release.signature,
              passport_date_received: release.passport_date_received,
              bank_account_number: bank_number,
              inn: inn,
            },
            subscribe: subscribe.map(track => ({
              id: track.id,
              startDate: track.startDate,
              endDate: track.endDate,
              id_subscribe: track.id_subscribe
            }))

          };

          releasesWithTracks.push(releaseWithTracks);
        }

        return NextResponse.json({
          releases: releasesWithTracks,
          totalPages: totalPages
        });
      } else {
        return NextResponse.json({ message: "No releases found for the user" });
      }
    } else {
      return NextResponse.json({ message: 'not_admin' })
    }
  }
}
