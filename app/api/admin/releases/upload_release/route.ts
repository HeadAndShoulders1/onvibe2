import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import axios from 'axios';
import { format } from 'date-fns';
import FormData from 'form-data';
import { JSDOM } from 'jsdom';
import { v4 as uuidv4 } from 'uuid';


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
            const { id_release } = await request.json()
            const data_album = await prisma.release.findUnique({
                where: {
                    id: id_release
                }
            })
            if (data_album) {
                const response = await axios.get("https://onvibe.hb.ru-msk.vkcs.cloud/" + data_album?.cover_path, { responseType: 'arraybuffer' });

                const blob_cover = Buffer.from(response.data, 'binary');
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
                            'pass': 'Lirik887937123$$',
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

                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest',
                    'cookie': cookieDMBSID
                };
                const params = {
                    'uploadDir': 'f652950a19ed02ddd83c8f045927c347',
                    'reqHandler': 'lib/php/ui/upload/ChunkedUploader.php'
                };
                console.log(cookieDMBSID)


                const formData = new FormData();
                formData.append('name', data_album?.cover_path + '.jpg');
                formData.append('file', blob_cover, data_album?.cover_path + '.jpg');
                const upload_cover_album = await axios.post(
                    'https://dmb.kontornewmedia.com/page/albums/index.php',
                    formData,
                    {
                        params: params,
                        headers: {
                            ...formData.getHeaders(),
                            ...headers,
                            'origin': 'https://dmb.kontornewmedia.com',
                            'referer': 'https://dmb.kontornewmedia.com/page/albums?dmbOpenLayerURL=page%2Falbum.create',
                        }
                    }
                );
                console.log(upload_cover_album.data)
                let language
                if (data_album.meta_language == "Русский") {
                    language = 'ru_RU'
                } else {
                    language = 'en_US'
                }
                const data: [string, any][] = [
                    ['vc-chunked-uploaders[idfumhyg5][name]', 'cover'],
                    ['vc-chunked-uploaders[idfumhyg5][dir]', 'f652950a19ed02ddd83c8f045927c347'],

                    ['title', data_album.title],
                    ['title_version', data_album.version],
                    ['language', language],
                    ['genre', 'Pop'],
                    ['genre_id', '101000000'],
                    ['label', ''],
                    ['salesStartDate', format(data_album.date_release as Date, 'yyyy-MM-dd')],
                    ['salesEndDate', '2099-03-30'],
                    ['preOrderDate', format(data_album.date_release as Date, 'yyyy-MM-dd')],
                    ['_bls[]', 'allow_prelistening_before_release'],
                    ['_bls[]', 'allow_preorder_preview'],
                    ['pricecode', 'AA'],
                    ['pricecodeItunes', '14'],
                    ['cce_aName[]', ''],
                    ['cce_aRoles[0][]', '1009'],

                    ['c_line_year', '2024'],
                    ['c_line_text', 'onvibe'],

                    ['eanUpc', ''],
                    ['articleNo', ''],

                    ['p_line_year', '2024'],
                    ['p_line_text', data_album.p_line],

                    ['_bls[]', 'contributors2tracks'],
                    ['_wizPath', 'Panel_1|Panel_1.2'],

                    ['_wizData', '{"page":"album.create","bundle_type_id":"6","action":"next"}'],
                    ['_vclyr', 'A_1'],
                    ['action', 'save'],
                ];
                const artist_count = data_album.artist.length
                if (data_album.artist.length != 0) {
                    for (let x = 1; x <= data_album.artist.length; x++) {
                        data.push(['cce_aName[]', data_album.artist[x - 1]]);
                        data.push([`cce_aRoles[${x}][]`, '1009']);
                    }
                }
                if (data_album.featartist.length != 0) {
                    for (let x = artist_count + 1; x <= artist_count + data_album.featartist.length; x++) {
                        data.push(['cce_aName[]', data_album.featartist[x - 1 - artist_count]]);
                        data.push([`cce_aRoles[${x}][]`, '1012']);
                    }
                }
                data.push(['cce_aName[]', data_album.fio]);
                data.push([`cce_aRoles[${artist_count + data_album.featartist.length + 1}][]`, '1010']);
                data.push([`cce_aRoles[${artist_count + data_album.featartist.length + 1}][]`, '1030']);
                const create_album = await axios.post(
                    'https://dmb.kontornewmedia.com/page/album.create',
                    new URLSearchParams(data),
                    {
                        headers: {
                            ...headers,
                            'origin': 'https://dmb.kontornewmedia.com',
                            'referer': 'https://dmb.kontornewmedia.com/page/albums?dmbOpenLayerURL=page%2Falbum.create',

                        }
                    }
                );
                const albumIdPattern: RegExp = /\/album\/(\d+)/;
                console.log(create_album.data.match(albumIdPattern))
                const timeoutString: RegExpMatchArray | null = create_album.data.match(albumIdPattern);
                if (timeoutString) {
                    let albumNumber: string = timeoutString[1];
                    const data_track_of_album = await prisma.tracks.findMany({
                        where: {
                            releaseId: id_release
                        }
                    })
                    for (const singleRelease of data_track_of_album) {
                        const form = new FormData();

                        form.append('bundleId', albumNumber);
                        form.append('res_type_id', '1');
                        form.append('res_subtype_id', '0');
                        form.append('editMode', '1');
                        form.append('isrc', '');
                        form.append('iswc', '');
                        form.append('title', singleRelease.title);
                        form.append('language', '');
                        if (singleRelease.version != null) {
                            form.append('title_version', singleRelease.version);
                        } else {
                            form.append('title_version', '')
                        }
                        form.append('language_audio', language);
                        form.append('title_work', '');
                        form.append('explicitContentFlag', '');
                        form.append('fullTitle', '<unknown title>');
                        form.append('originalReleaseDateOverride', '');
                        form.append('pricecode', '');
                        form.append('genre', '');
                        form.append('genre_id', '');
                        form.append('_bls[]', 'gapless_play');
                        form.append('duration_hour', '0');
                        form.append('duration_min', '00');
                        form.append('duration_sec', '00');
                        form.append('duration_millis', '000');
                        form.append('genre2', '');
                        form.append('genre2_id', '');
                        form.append('preview_start', '60.000');
                        form.append('preview_duration', '60.000');
                        form.append('genre3', '');
                        form.append('genre3_id', '');
                        form.append('beatsPerMinute', '');
                        form.append('genre_custom', '');
                        form.append('remasteredYear', '');
                        form.append('_bls[]', 'is_instrumental');
                        form.append('_bls[]', 'isAcapella');
                        form.append('_bls[]', 'isCoverVersion');
                        form.append('_bls[]', 'isKaraoke');
                        form.append('_bls[]', 'isTribute');
                        form.append('_bls[]', 'isLiveVersion');
                        form.append('_bls[]', 'is_medley');
                        form.append('_bls[]', 'isDJMix');
                        form.append('_bls[]', 'isMixCut');
                        form.append('_bls[]', 'isPublicDomain');
                        form.append('p_line_year', '');
                        form.append('p_line_text', '');
                        form.append('p_line_text_id', '');
                        form.append('publishers[]', '');
                        form.append('publishers[]', '');
                        form.append('_bls[]', 'is_gema_free');
                        form.append('cce_aName[]', '');
                        form.append('cce_aId[]', '');
                        form.append('cce_roles[][]', '1009');
                        form.append('cce_roles[][]', '1010');
                        form.append('cce_roles[][]', '1030');
                        form.append('cce_aRolesAuto[]', '');
                        form.append('newArtist', '');
                        form.append('newArtist_id', '');
                        form.append('cce_roles[][]', '1009');
                        form.append('cce_aRolesAuto[]', '');
                        form.append('lyrics', '');
                        form.append('shop_share_policy', 'monetize');
                        form.append('dmb-v3', '1');
                        form.append('vc_form_id', 'id44luua1');
                        form.append('vc_render_ts', '1710873754');
                        form.append('vc_render_srv', 'PROD-frontend_b5689fb4d397');
                        form.append('action', 'save');
                        const artist_count = singleRelease.artist.length
                        if (singleRelease.artist.length != 0) {
                            for (let x = 1; x <= singleRelease.artist.length; x++) {
                                form.append('cce_aName[]', singleRelease.artist[x - 1]);
                                form.append(`cce_aRoles[${x}][]`, '1009');
                            }
                        }
                        if (singleRelease.featartist.length != 0) {
                            for (let x = artist_count + 1; x <= artist_count + singleRelease.featartist.length; x++) {
                                form.append('cce_aName[]', singleRelease.featartist[x - 1 - artist_count]);
                                form.append(`cce_aRoles[${x}][]`, '1012');
                            }
                        }
                        data.push(['cce_aName[]', data_album.fio]);
                        data.push([`cce_aRoles[${artist_count + singleRelease.featartist.length + 1}][]`, '1010']);
                        data.push([`cce_aRoles[${artist_count + singleRelease.featartist.length + 1}][]`, '1030']);
                        const response = await axios.post(
                            'https://dmb.kontornewmedia.com/page/track',
                            form,
                            {
                                headers: {
                                    ...headers,
                                    'origin': 'https://dmb.kontornewmedia.com',
                                    'referer': 'https://dmb.kontornewmedia.com/index.php?bundleId=' + albumNumber + '&page=track&res_type_id=1&res_subtype_id=0',
                                },
                            },
                        )
                        const html_code = response.data;
                        const { window } = new JSDOM(html_code);
                        const { document } = window;

                        const divs_with_track = document.querySelectorAll('div[data-product-type="Track"]');
                        const product_id = divs_with_track[1].getAttribute('data-product-id');

                        if (product_id) {
                            const response_music = await axios.get("https://onvibe.hb.ru-msk.vkcs.cloud/" + singleRelease?.track_wav, { responseType: 'arraybuffer' });
                            const blob_music = Buffer.from(response_music.data, 'binary');
                            const params = {
                                'uploadDir': 'f652950a19ed02ddd83c8f045927c347',
                                'reqHandler': 'lib/php/ui/upload/ChunkedUploader.php'
                            };

                            const formData = new FormData();
                            formData.append('name', singleRelease?.track_wav + '.wav');
                            formData.append('file', blob_music, singleRelease?.track_wav + '.wav');
                            const put_wav_track = await axios.post(
                                'https://dmb.kontornewmedia.com/page/albums/index.php',
                                formData,
                                {
                                    params: params,
                                    headers: {
                                        ...formData.getHeaders(),
                                        ...headers,
                                        'origin': 'https://dmb.kontornewmedia.com',
                                        'referer': 'https://dmb.kontornewmedia.com/page/track/' + product_id + '?bundleId=' + albumNumber,
                                    }
                                }
                            );
                            const data = {
                                'id': product_id,
                                'opener': '',
                                'action': 'upload',
                                'vc-chunked-uploaders[id8iirf12][name]': 'id8iirf12',
                                'vc-chunked-uploaders[id8iirf12][dir]': 'f652950a19ed02ddd83c8f045927c347',
                                'id8iirf12_count': '1',
                                'id8iirf12_0_name': singleRelease?.track_wav + '.wav',
                                'id8iirf12_0_tmpname': singleRelease?.track_wav + '.wav',
                                'id8iirf12_0_status': '5',
                                '_vcwdg': '',
                                '_vclyr': 'track-uploadLayer',
                            };
                            const upload_wav_track = await axios.post(
                                'https://dmb.kontornewmedia.com/page/track-upload',
                                new URLSearchParams(data),
                                {
                                    headers: {
                                        ...headers,
                                        'origin': 'https://dmb.kontornewmedia.com',
                                        'referer': 'https://dmb.kontornewmedia.com/page/track/' + product_id + '?bundleId=' + albumNumber,
                                    }
                                }
                            );
                        } else {
                            return NextResponse.json({ message: "not_track_number" })
                        }
                    }
                    return NextResponse.json({ message: "success" })
                } else {
                    return NextResponse.json({ message: "not_album_number" })
                }
            }
        }
    }
}
