import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";

export default async function handler ( req : NextApiRequest , res : NextApiResponse ){
    //const data = await prisma.user.findMany()
    const message = req.body.data
    res.json({message})

}