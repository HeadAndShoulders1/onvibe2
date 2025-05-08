import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { platform, release } from 'os';
import { json } from 'stream/consumers';

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
      const { type_date, upc } = await request.json()
      const releases = await prisma.release.findFirst({
        where: {
          upc: upc,
          owner: userdata.id
        }
      })
      const subscribe = await prisma.subscribe.findFirst({
        where: {
          UserID: userdata?.id
        },
        orderBy: {
          id: 'desc'
        },
      })

      if (subscribe && subscribe.endDate >= new Date()) {
        if (releases?.owner === userdata.id || upc === "") {
          let currentDate = new Date();
          if (type_date == 1) {
            currentDate.setDate(currentDate.getDate() - 7);
          }
          if (type_date == 2) {
            currentDate.setDate(currentDate.getDate() - 30);
          }
          if (type_date == 3) {
            currentDate.setDate(currentDate.getDate() - 90);
          }
          if (type_date == 4) {
            currentDate.setDate(currentDate.getDate() - 180);
          }
          let upc_search: string = ""
          if (upc === "") {
            const upc_releases = await prisma.release.findMany({
              where: {
                owner: userdata.id,
                status: "Accepted"
              }
            })

            for (const releasess of upc_releases) {
              if (releasess.upc) {
                upc_search = upc_search + releasess.upc + ", "
              }
            }
          } else {
            upc_search = upc
          }
          if (upc_search == ""){
            return NextResponse.json({ message: "not_found" })
          }
          const streams: any = await GetListen(upc_search, currentDate);


          const analytics: any = [];
          streams?.forEach((stream1: { id: any; date: any; stream: any; }) => {
            const { id, date, stream } = stream1;
            const convertedDate = convertDateFormat(date);
            const existingEntry = analytics.find((entry: { date: string; }) => entry.date === convertedDate);
            if (existingEntry) {
              existingEntry.stream += stream;
            } else {
              analytics.push({ id, date: convertedDate, stream });
            }
          });

          analytics.sort((a: { date: string; }, b: { date: string; }) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateA.getTime() - dateB.getTime();
          });

          const analytics_on_platform: any = [];
          streams?.forEach((stream1: { id: any; platform: any; stream: any; }) => {
            const { id, platform, stream } = stream1;
            const existingEntry = analytics_on_platform.find((entry: { platform: string; }) => entry.platform === platform);
            if (existingEntry) {
              existingEntry.stream += stream;
            } else {
              analytics_on_platform.push({ id, platform: platform, stream: stream });
            }
          });

          const user_releases = await prisma.release.findMany({
            where: {
              status: "Accepted",
              owner: userdata.id
            }
          })

          let releases: any = []
          for (const release of user_releases) {
            if (release.upc != null) {
              releases.push({ id: release.id, cover: release.cover_small_path, title: release.title, artist: release.artist, upc: release.upc })
            }
          }
          const ResponseJSON = {
            analytics: analytics,
            releases: releases,
            analytics_on_platform: analytics_on_platform,
          }
          return NextResponse.json(ResponseJSON)
        } else {
          return NextResponse.json({ message: "not_found" })
        }
      } else {
        return NextResponse.json({ message: "subscribe_error" })
      }
    } else {
      return NextResponse.json({ message: "not_found" })
    }
  }
}

function convertDateFormat(dateString: any) {
  const [yyyy, mm, dd] = dateString.split('-');
  return `${dd}.${mm}.${yyyy}`;
}
function parseDate(dateString: string): Date {
  const [dd, mm, yyyy] = dateString.split('.');
  return new Date(`${mm}/${dd}/${yyyy}`);
}



async function GetListen(upc: any, currentDate: any) {
  const response1 = await fetch('https://dmb.kontornewmedia.com/api/v4/public/users/auth?XDEBUG_SESSION_START=DMB', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cookie': 'XSRF-TOKEN=c823e718-e85b-4bcd-b6f9-53bb1606d030;DMBSID=MRSShOhzRcOmS1ZVh7b4zjToEwAAIcYfqsEfRaQBQeKJ7s21TQ%3D%3D',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    },
    body: JSON.stringify({
      'id': '5e2b3841-595a-4635-bbed-24ddd776cc66',
      'key': 'DMBWebUI:Login',
      'path': 'users/auth',
      'payload': {
        'user': 'ViktoriaBekicheva',
        'pass': '30298943Lirik30298943$',
        'totp': '',
        'browserFingerprint': 'a04bd837aa9ce6fb0500ca0e92aa6c35',
        'withException': false,
        'respectTotpRequirement': true
      }
    }),
    credentials: 'include'
  })

  const cookiesCode = response1.headers.get('set-cookie');
  let DMBSIDValue
  if (cookiesCode) {
    const cookies = cookiesCode.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name.trim() === 'DMBSID') {
        DMBSIDValue = value;
        break;
      }
    }
  }

  let cookieDMBSID = 'DMBSID=' + DMBSIDValue + '; XSRF-TOKEN=d5fc7384-94d9-4c40-bb0d-e4cd8b6fa5a2;'
  const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'cookie': cookieDMBSID,
    'x-requested-with': 'XMLHttpRequest',
    'origin': 'https://dmb.kontornewmedia.com',
    'referer': 'https://dmb.kontornewmedia.com/page/trendreport',
  };
  const params = new URLSearchParams();
  params.append('dateBegin', currentDate.toISOString().split('T')[0]);
  params.append('dateEnd', (new Date()).toISOString().split('T')[0]);
  params.append('groupBy', '');
  params.append('productCode', `${upc}`);
  params.append('productTypes[]', 'Album');
  params.append('dmb-v3', '1');
  params.append('action', 'exportInsightCSV');
  const response = await fetch('https://dmb.kontornewmedia.com/page/trendreport', {
    method: "POST",
    body: params,
    headers: headers,
  });
  const csvData = await response.text();
  const rows = csvData.trim().split('\n');
  const headers_csv = rows[0].split(';').map(header => header.trim());
  const jsonData = rows.slice(1).map(row => {
    const values = row.split(';').map(value => value.trim());
    const obj: any = {};
    headers_csv.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
  const jsonString = JSON.stringify(jsonData.slice(0, -1));
  const cleanedData = JSON.parse(jsonString);
  const stream_info: any = []
  for (const json of cleanedData) {
    let stream_num;
    if (json["\"Units\""] === '') {
      stream_num = 0;
    } else {
      stream_num = parseInt(json["\"Units\""].replace(/"/g, ""));
    }
    stream_info.push({ date: json["\"Date\""].replace(/"/g, ""), platform: json["\"Store\""].replace(/"/g, ""), release: json["\"Date\""].replace(/"/g, ""), stream: stream_num })
  }
  return stream_info
}