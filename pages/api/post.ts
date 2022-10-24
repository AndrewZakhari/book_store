import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from '../../lib/prismadb'


export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    let message;
    const session = await unstable_getServerSession(req, res, authOptions)
    if(session){
    const { email } : any = session.user 
    
    const findUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    console.log(findUser?.books)

    let arr = findUser?.books

     arr?.push(req.body)

    const updatedArr = await JSON.parse(JSON.stringify(arr))

    

    const update = await prisma.user.update({
        where: {
            email : email
        },
        data : {
            books : updatedArr
        }
    })
   
    message = "Sucess"
}else {
    message = "Failure"
}
   
    res.json({message: message}) 
}