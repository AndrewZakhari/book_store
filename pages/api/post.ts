import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from '../../lib/prismadb'


export default async function handler(req : NextApiRequest, res: NextApiResponse) {

    const session = await unstable_getServerSession(req, res, authOptions)
    if(session){
    const { email } : any = session.user
    
    const findUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    console.log(findUser)
}


    console.log(req.body)
   
    res.json({"res": req.body.data}) 
}