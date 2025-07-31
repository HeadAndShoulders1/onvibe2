import { NextResponse } from 'next/server';
import Busboy from 'busboy';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';

export const POST = async (req: Request): Promise<Response> => {
  const royaltiesMap: { [key: string]: number } = {};

  function readableFromStream(stream: ReadableStream) {
    const reader = stream.getReader();
    return new Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(value);
        }
      },
    });
  }

  return new Promise<Response>((resolve, reject) => {
    const headers = Object.fromEntries(req.headers.entries()) as { [key: string]: string };

    const busboy = Busboy({ headers });

    busboy.on('file', (_, file) => {
      file.setEncoding('utf8');

      let csvData = '';
      file.on('data', (chunk) => {
        csvData += chunk;
      });

      file.on('end', async () => {
        try {
          const rows = csvData.split('\n');
          const headers = rows.shift()?.split(';') || [];

          rows.forEach((row) => {
            const values = row.split(';');
            const rowData = headers.reduce((acc, header, index) => {
              acc[header] = values[index];
              return acc;
            }, {} as { [key: string]: string });

            const ean = rowData['EAN'];
            const royalties = parseFloat(rowData['Royalties'] || '0');

            if (ean) {
              royaltiesMap[ean] = (royaltiesMap[ean] || 0) + royalties;
            }
          });

          const result = Object.entries(royaltiesMap).map(([EAN, Royalties]) => ({
            EAN,
            Royalties: Math.round(Royalties * 8000) / 100,
          }));
          const results: any[] = [];
          let all_amount = 0;
          for (const res of result) {
            const release = await prisma.release.findFirst({
              where: {
                upc: res.EAN,
              },
            });
            all_amount += res.Royalties;
            if (release) {
              results.push({
                title: release.title,
                artist: release.artist[0],
                cover: release.cover_small_path,
                amount: res.Royalties,
                upc: res.EAN
              });
            }
          }
          resolve(NextResponse.json({ totalAmount: all_amount, releases: results }));
        } catch (error) {
          reject(
            NextResponse.json(
              { error: 'Error processing file', details: (error as Error).message },
              { status: 500 }
            )
          );
        }
      });
    });

    busboy.on('error', (error: { message: any }) => {
      reject(
        NextResponse.json(
          { error: 'Error processing file', details: error.message },
          { status: 500 }
        )
      );
    });

    const nodeStream = readableFromStream(req.body as ReadableStream);
    nodeStream.pipe(busboy);
  });
};
