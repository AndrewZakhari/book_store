import NextAuth from "next-auth/next";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import nodemailer from 'nodemailer';
import { NextAuthOptions } from "next-auth";


export const authOptions : NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers:[
        Email({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM ,
        })

    ],

    callbacks:{
        session({ session, token, user}){
            return session
        },
    }, 
}



function html(arg0: { url: string; site: string; email: string; }): string | Buffer | import("stream").Readable | import("nodemailer/lib/mailer").AttachmentLike | undefined {
    throw new Error("Function not implemented.");
}


export default NextAuth(authOptions);