import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

const s3 = new S3Client({
    region: process.env.AWS_REGION || undefined,
    endpoint: 'https://hb.ru-msk.vkcs.cloud/',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    }

    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!userdata) {
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    }

    const { id_track, track_start, track_end, type_background } = await request.json();
    const track = await prisma.tracks.findUnique({
        where: { id: id_track },
    });

    if (!track || userdata.id !== track.owner || !track.releaseId) {
        return NextResponse.json({ message: "not_permission" });
    }

    if (track_end - track_start > 16) {
        return NextResponse.json({ message: "long_track" });
    }

    if (!["1", "2", "3", "4"].includes(type_background)) {
        return NextResponse.json({ message: "not_have_background" });
    }

    const release = await prisma.release.findFirst({
        where: { id: track.releaseId },
    });

    const name_file = uuidv4();
    const PutObjctCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name_file,
        ACL: "public-read",
    });

    const getUrl = await getSignedUrl(s3, PutObjctCommand, {
        expiresIn: 60,
    });

    const background = `https://onvibe.hb.ru-msk.vkcs.cloud/background_${type_background}.jpg`;
    const cover = `https://onvibe.hb.ru-msk.vkcs.cloud/${release?.cover_small_path}`;
    const track_mp3 = `https://onvibe.hb.ru-msk.vkcs.cloud/${track.track_mp3}`;
    const video = "https://onvibe.hb.ru-msk.vkcs.cloud/platformblack.mp4";

    try {
        const buffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            const passThrough = new PassThrough();

            ffmpeg()
                .setFfmpegPath('./node_modules/ffmpeg-static/ffmpeg')
                .input(background)
                .input(cover)
                .input(video)
                .input(track_mp3)
                .seekInput(track_start)
                .duration(15)
                .audioFilters([
                    { filter: 'afade', options: 't=in:st=0:d=3' },
                    { filter: 'afade', options: 't=out:st=12:d=3' },
                ])
                .complexFilter([
                    { filter: "chromakey", options: "green:0.1:0.1", inputs: "[2:v]", outputs: "[video]" },
                    { filter: "setsar", options: "1", inputs: "[video]", outputs: "[rescaled_video]" },
                    { filter: "overlay", options: { x: '(W-w)/2', y: 300 }, inputs: ["[0:v]", "[1:v]"], outputs: "[overlayed1]" },
                    { filter: "drawtext", options: `x=(w-text_w)/2:y=870:fontsize=18:fontcolor=0xBBBBBB:fontfile=rubik-regular.ttf:text='${track.artist[0]}'`, inputs: "[overlayed1]", outputs: "[with_artist_text]" },
                    { filter: "drawtext", options: `x=(w-text_w)/2:y=900:fontsize=32:fontcolor=white:fontfile=rubik-regular.ttf:text='${track.title}'`, inputs: "[with_artist_text]", outputs: "[with_title_text]" },
                    { filter: "overlay", options: { x: 0, y: 0 }, inputs: ["[with_title_text]", "[rescaled_video]"], outputs: "[final_output]" },
                ], 'final_output')
                .outputOptions('-map 3:a')
                .videoCodec('libx264')
                .audioCodec('aac')
                .audioBitrate('192k')
                .outputOptions('-pix_fmt yuv420p')
                .outputOptions('-movflags frag_keyframe')
                .outputFormat('mp4')
                .on('start', (commandLine) => {
                    console.log('Spawned Ffmpeg with command:', commandLine);
                })
                .on('error', (err, stdout, stderr) => {
                    console.error('An error occurred:', err.message);
                    console.error('ffmpeg stdout:', stdout);
                    console.error('ffmpeg stderr:', stderr);
                    reject(new Error('ffmpeg processing error'));
                })
                .on('end', () => {
                    resolve(Buffer.concat(chunks));
                })
                .pipe(passThrough, { end: true });

            passThrough.on('data', (chunk) => chunks.push(chunk));
            passThrough.on('error', reject);
            passThrough.on('end', () => resolve(Buffer.concat(chunks)));
        });

        await fetch(getUrl, {
            method: 'PUT',
            body: buffer,
            headers: { 'Content-Type': 'audio/mp4' },
        });

        await prisma.snippet.create({
            data: {
                title: track.title,
                artist: track.artist,
                featartist: track.featartist,
                url: name_file,
                cover: release?.cover_small_path,
                owner: userdata.id,
            },
        });

        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.error('Error processing video:', error);
        return NextResponse.json({ message: "error_processing_video" });
    }
}
