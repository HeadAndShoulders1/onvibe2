'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer'

export const signUp = async (username: string, email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (user) {
        return 'User with that email already exists.';
    } else {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (user) {
            return 'User with that username already exists.';
        } else {
            const passwordHash = bcrypt.hashSync(password, 10);
            const min: number = 10000;
            const max: number = 99999;
            const randomCode: string = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
            const html = `<div> <div style="max-width:37.5em;background-color:#1e1e1e;border-radius:1rem;border-width:1px;padding:1.5rem;padding-top:3.5rem;padding-bottom:3.5rem;border-color:rgb(100,116,139);margin-left:auto;margin-right:auto;margin-top:1rem;margin-bottom:1rem"> <style> @font-face { font-family:'Rubik'; font-style: normal; font-weight: 300 900; font-display: swap; src: url(onvibe.fun/_next/static/media/0596140cb8d9223a-s.woff2) format("woff2"); unicode-range: U+0100-02af,U+0304,U+0308,U+0329,U+1e00-1e9f,U+1ef2-1eff,U+2020,U+20a0-20ab,U+20ad-20c0,U+2113,U+2c60-2c7f,U+a720-a7ff } *{ font-family: 'Rubik', sans-serif; } </style> <div style="display:flex;width:100%;margin-bottom:1.5rem;justify-content: center;"> <img src='https://onvibe.hb.ru-msk.vkcs.cloud/light_logo_onvibe.png' alt='onvibe' width='160px' height='33px' style="margin:0 auto"/> </div> <div style="width:100%;text-align: center;color: #E2E8F0; font-size: 1.5rem; font-weight: bold;"> Подтверждение почты ONVIBE</div> <div style="width:100%; margin-bottom: 1.5rem;"> <p style="color: #b0b3b8; text-align: center; font-size: 0.875rem;width: 100%;">Код для подтверждения</p> </div> <div style="width: 100%; display: flex; background-color: #f1f5f9; border-radius: 4px;"> <p style="color:black;line-height:2.25rem;text-align:center;font-size:1.75rem;font-weight:bold;width:100%">${randomCode}</p> </div> </div> <div style="width: 100%;text-align:center;"> <p style="color: #94A3B8; font-size: 0.875rem;">вы получаете это электронное письмо, потому что вы зарегистрированы на нашем веб-сайте <a href="https://onvibe.fun" style="color: #94A3B8; text-align: center; font-size: 0.875rem;">ONVIBE.FUN</a></p> </div> </div>`
            const transporter = nodemailer.createTransport({
                host: 'smtp.timeweb.ru',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.NAME_EMAIL,
                    pass: process.env.PASS_EMAIL,
                }
            })
            let info = await transporter.sendMail({
                from: '"ONVIBE" <mail@onvibe.fun>',
                to: email,
                subject: "Код подтверждения",
                html: html,
            });
            await prisma.user.create({
                data: {
                    username,
                    email,
                    passwordHash,
                    email_code: randomCode,
                },
            });

            return "success";
        }
    }

};