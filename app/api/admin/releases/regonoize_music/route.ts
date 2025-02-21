import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { randomBytes } from 'crypto';
import * as cheerio from 'cheerio';

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
      const { file_url } = await request.json();
      const params = new URLSearchParams({
        data_type: "audio_url",
        uri: "",
        url: file_url
      });
      const track_send = await fetch(`https://eu-api-v2.acrcloud.com/api/fs-containers/16974/files?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiNWMwMTZhOTdiM2YxNjVmN2JhNmRmNWJkZDI2ZDBmMTg3ZmZiYmQ5MGQ5YmRlMTIzOWFkNTczYWI4NDRkMDUxZDI5OTMxYTA0ZjY0ZGVlYjUiLCJpYXQiOjE3MDc2NDYyNjEuMzk4MDIxLCJuYmYiOjE3MDc2NDYyNjEuMzk4MDI1LCJleHAiOjIwMjMyNjU0NjEuMjM1MTcxLCJzdWIiOiIxMjQwMDMiLCJzY29wZXMiOlsiYnVja2V0cyIsIndyaXRlLWJ1Y2tldHMiLCJyZWFkLWJ1Y2tldHMiLCJhdWRpb3MiLCJ3cml0ZS1hdWRpb3MiLCJyZWFkLWF1ZGlvcyIsImZpbGVzY2FubmluZyIsIndyaXRlLWZpbGVzY2FubmluZyIsInJlYWQtZmlsZXNjYW5uaW5nIiwibWV0YWRhdGEiLCJyZWFkLW1ldGFkYXRhIl19.j1GGhmOIpXA9yNURKDhLnFudKUVAlBpCDv6yJhZjyt2WAhKcOj5tUh2Jv6wQAAubWTiDUzNebAnFnVXnt68J9aqBtetmKjDzJy1WKW3iWJU02yy75UZIIs6MxBfKXlblcuWC5HU3n8FX3srBAd3iUS9iEvf90ncNcEG_LEja-shJUr1hKCTOHDEPprS3vQRiMQvyAWvk6febFMkdrOBqq4p8W6Pi6ucmg4SmWRaJl61ZgaNgnVrOegYVxxfvorW-OZlRX8LEpoQ5Sdhvy9j9MoC5wps1eWQpeH4wlNIPbt6DgjmO6cxpA3NdV8oaeqij0IgOUFGdUWn2cXKh0Q5fGJ9jbz4aaBJ4n5vi6lfplieibEIiuIIbA0lWJGoapF_GyY5CvD1qKhUFOj8_CruNno1WCmTbS0PhzdJYV6P5IYMKLWnKo5HYIEzY7ebCiJKUz6VNs-Kva67YH2Au2xhYiny9e-GiHAL5c6A3aKynTT9huvdMYTyxyWtJgdB_LKw5mganCP8z-0GvQPYAMEivm4ZVdyst5qcUgmPBPGcqbEFxcrI9juzd9O8vPiK8-y9281Y3tJnUfuBcBUvW98d1nlz3YTOqnOTBjRMxJRctw0jOL-sESUMdO9A6b84kDX5KC97vfSQVjOxa71eQ-sPJmoY7Xkk2dHETSnzvhwJ5cE0',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        },
      });

      const data_send_track = await track_send.json();
      const url = 'https://eu-api-v2.acrcloud.com/api/fs-containers/16974/files/' + data_send_track.data.id
      await sleep(1000);
      let state = 0
      let results = null
      while (state == 0) {
        const track_check = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiNWMwMTZhOTdiM2YxNjVmN2JhNmRmNWJkZDI2ZDBmMTg3ZmZiYmQ5MGQ5YmRlMTIzOWFkNTczYWI4NDRkMDUxZDI5OTMxYTA0ZjY0ZGVlYjUiLCJpYXQiOjE3MDc2NDYyNjEuMzk4MDIxLCJuYmYiOjE3MDc2NDYyNjEuMzk4MDI1LCJleHAiOjIwMjMyNjU0NjEuMjM1MTcxLCJzdWIiOiIxMjQwMDMiLCJzY29wZXMiOlsiYnVja2V0cyIsIndyaXRlLWJ1Y2tldHMiLCJyZWFkLWJ1Y2tldHMiLCJhdWRpb3MiLCJ3cml0ZS1hdWRpb3MiLCJyZWFkLWF1ZGlvcyIsImZpbGVzY2FubmluZyIsIndyaXRlLWZpbGVzY2FubmluZyIsInJlYWQtZmlsZXNjYW5uaW5nIiwibWV0YWRhdGEiLCJyZWFkLW1ldGFkYXRhIl19.j1GGhmOIpXA9yNURKDhLnFudKUVAlBpCDv6yJhZjyt2WAhKcOj5tUh2Jv6wQAAubWTiDUzNebAnFnVXnt68J9aqBtetmKjDzJy1WKW3iWJU02yy75UZIIs6MxBfKXlblcuWC5HU3n8FX3srBAd3iUS9iEvf90ncNcEG_LEja-shJUr1hKCTOHDEPprS3vQRiMQvyAWvk6febFMkdrOBqq4p8W6Pi6ucmg4SmWRaJl61ZgaNgnVrOegYVxxfvorW-OZlRX8LEpoQ5Sdhvy9j9MoC5wps1eWQpeH4wlNIPbt6DgjmO6cxpA3NdV8oaeqij0IgOUFGdUWn2cXKh0Q5fGJ9jbz4aaBJ4n5vi6lfplieibEIiuIIbA0lWJGoapF_GyY5CvD1qKhUFOj8_CruNno1WCmTbS0PhzdJYV6P5IYMKLWnKo5HYIEzY7ebCiJKUz6VNs-Kva67YH2Au2xhYiny9e-GiHAL5c6A3aKynTT9huvdMYTyxyWtJgdB_LKw5mganCP8z-0GvQPYAMEivm4ZVdyst5qcUgmPBPGcqbEFxcrI9juzd9O8vPiK8-y9281Y3tJnUfuBcBUvW98d1nlz3YTOqnOTBjRMxJRctw0jOL-sESUMdO9A6b84kDX5KC97vfSQVjOxa71eQ-sPJmoY7Xkk2dHETSnzvhwJ5cE0',
          },
        });
        const data_track = await track_check.json();
        state = data_track.data[0].state
        results = data_track.data[0].results
        await sleep(2000);
      }
      if (results && results.music) {
        for (const musicItem of results.music) {
          const link: string = await GetUrl(musicItem.result.external_ids.isrc);
          musicItem.url = link;
        }
        return NextResponse.json({ results, message: 'success' });
      } else {
        return NextResponse.json({ message: 'not_found' });
      }
    } else {
      return NextResponse.json({ message: 'not_admin' })
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateCsrfToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

async function GetUrl(isrc: string) {
  const csrfToken: string = generateCsrfToken();
  const url_check = 'https://www.isrcfinder.com/reverse-lookup/';
  const cookies = `csrftoken=${csrfToken}`;
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Cookie': cookies,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'https://www.isrcfinder.com',
    'Referer': 'https://www.isrcfinder.com/reverse-lookup/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
  };
  const check_url = await fetch(url_check, {
    method: 'POST',
    headers: headers,
    body: new URLSearchParams({
      'URI': isrc,
      'csrfmiddlewaretoken': csrfToken
    }),
  })
  const html = await check_url.text();
  const $ = cheerio.load(html);
  const firstLink = $('a[target="_blank"]').first();
  const urlWithBlankTarget = firstLink.attr('href');
  return urlWithBlankTarget ? urlWithBlankTarget.toString() : '';
}