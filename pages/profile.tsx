import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prismadb";


export const getServerSideProps : GetServerSideProps = async (cxt) => {
    const session = await unstable_getServerSession(cxt.req, cxt.res, authOptions) 

    
    if(session){
    const { email } : any = session.user
    const userInfo = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    let serializedUserInfo = await JSON.parse(JSON.stringify(userInfo))
    console.log(serializedUserInfo)
    return {
        props: {
            serializedUserInfo
        }
    }
}else {
    return {
        props: {
            message: "Not Authenticated"
        }
    }
}
}

const Profile : NextPage =  (props) => {
    //Todo profile page
    return (
        <>
        </>
    )
}

export default Profile

