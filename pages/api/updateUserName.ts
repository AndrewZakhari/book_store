import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

const handler = async (req : NextApiRequest, res: NextApiResponse) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    let message : string ;
    
    if (session) {
        const  email : any  = session.user?.email
        
        const update = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                name : req.body.name
            }
        })
        
        message = "Updated Sucessfully"
        
    }else {
        message = "Not Authenticated, Please Sign In"
    }
    res.json({message})
}

export default handler