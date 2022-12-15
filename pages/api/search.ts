import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prismadb";

interface book {
    name: String,
    image: any,
    price: String,
    description: String,
    genres: String[]
}

export default async function handler ( req : NextApiRequest , res : NextApiResponse ){
    let found;
    const {body} = req;
    const data = await prisma.user.findMany()
    const response : String[] = data.map((value : any) => {
        return (
        value.books.map((value : book) => {
            if(value.name.toUpperCase() === body.toUpperCase()){ 
                return value;
            }
            else {
                found = "Not Found"
            }
        })
        )
    })
    response.filter((value: any) => {
        if(value.length !== 0){
            return (
            value.map((value: any) => {
                if (value !== undefined) {
                    return found = value
                }
            })
            )
        }      
    })
    res.json({found})

}