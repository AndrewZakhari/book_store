import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prismadb";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { signIn } from "next-auth/react";


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

const Settings : NextPage =  (props : any) => {
     if(props.message ){
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                <p className="rounded-md text-white bg-red-700 p-2">{props.message}</p>
                <p>Please Sign In to view your profile</p>
                <button className="border px-2" onClick={() => signIn()}>Sign In</button>
            </div>
        )
    }
    const { serializedUserInfo } : any = props
    console.log(serializedUserInfo)
    const [message  , setMessage] : any = useState();
    const [name, setName] = useState(serializedUserInfo.name);
   

    const changeName = async (e : any) => {
        e.preventDefault();

       
       
        if(e.target.name.value !== serializedUserInfo.name){
        const api : any = await axios({
            method: "POST",
            url :  "/api/updateUserName" ,
            headers: {"Content-Type" : "application/json"},
            data : {
                name : e.target.name.value
            }
        })
        if(api.data.message === "Updated Sucessfully"){
        window.location.reload()
        }else {
            setMessage(api.data.message)
        }
    }else {
        setMessage("That's already your username ,\n Please use a different username ")
    }
    }
    
    return (
        <>
        <div className="flex gap-10 scroll-smooth h-screen">
        <div id="sideMenu" className="top-0 left-0 w-60 bg-black bottom-0 text-white">
            <p>SideMenu</p>
        </div>
        <div id="profile" className="my-10 w-full">
           <div>
            {!serializedUserInfo.name  && 
            <>
            <div className="flex flex-col ">
            <div className="border-b-2 py-10">
                <p>Welcome {serializedUserInfo.email}</p>
            </div> 
            <h1 className="text-lg text-center my-5">Books You Published on our platform</h1>
                <div className="flex flex-wrap gap-3">
                {serializedUserInfo.books.map((value : any , index : number) => {
                    return (
                        
                    <div 
                     className="h-fit  hover:scale-105 transition
                      items-center flex flex-col w-64 rounded-md border border-black" key={index}> 
                        <p>{value.name}</p>
                        <Image src={value.image} width="240px" height="400px"/>
                        <p>{value.price}$</p>
                        <p
                        className="scroll-smooth"
                         onMouseEnter={(e : any) => {
                            e.target.className = "scroll-smooth"
                            e.target.innerText = value.description
                            window.scroll({
                                top: 600,
                                behavior: "smooth"
                            })
                          
                        }}
                        onMouseLeave={(e : any) => {
                            console.log(e.target)
                            window.scroll({
                                top: 200,
                                behavior: "smooth"
                            })
                            setTimeout(() => {
                            e.target.className = "scroll-smooth"
                            e.target.innerHTML = value.description.slice(0, 50) + 
                            '...<span style="font-weight: 100; font-size: 0.875rem; line-height: 1.25rem">Read More</span>'
                            }, 400
                            )
                        }}
                         key={index} id="description">{value.description.slice(0, 50)}... 
                        <span className="font-thin text-sm">Read More</span>
                        </p>
                    </div>
                    
                    )
                })}
                </div>
            <div className="border-b-2 py-10">
                <form onSubmit={changeName} className="flex flex-col gap-2">
                    <label>You don't have a username!</label>
                    {message && <><p>{message}</p></>}
                    <input name="name" className="border rounded-md w-fit" type="text" placeholder="Type A userName?" required/>
                    <button className="border rounded-md w-fit px-2" type="submit">Save</button>
                </form>
            </div>
            </div>
            </> 
            }{serializedUserInfo.name && 
            <>
            <div>
            <div className="border-b-2 py-10">
                <p>Welcome {serializedUserInfo.name}</p>
            </div>
            <h1 className="text-lg text-center my-5">Books You Published on our platform</h1>
                <div className="flex flex-wrap border-b-2 py-5 gap-3">
                {serializedUserInfo.books.map((value : any , index : number) => {
                    return (
                        
                    <div 
                    onClick={(e : any) => {e.target}}
                     className="h-fit  relative hover:cursor-pointer hover:scale-105 transition
                      items-center flex flex-col w-64 rounded-md border border-black" key={index}> 
                        <p>{value.name}</p>
                        <Image src={value.image} width="240px" height="400px"/>
                        <p>{value.price}$</p>
                        <p
                        className=""
                         onMouseEnter={(e : any) => {
                            console.log(e.target)
                            e.target.className = " animate-growY "
                            e.target.innerText = value.description
                            
                          
                        }}
                        onMouseLeave={(e : any) => {
                            setTimeout(() => {
                            e.target.className = "scroll-smooth"
                            e.target.innerHTML = value.description.slice(0, 50) + 
                            '...<span style="font-weight: 100; font-size: 0.875rem; line-height: 1.25rem">Read More</span>'
                            }, 400
                            )
                        }}
                         key={index} id="description">{value.description.slice(0, 50)}... 
                        <span className="font-thin text-sm">Read More</span>
                        </p>
                    </div>
                    
                    )
                })}
                </div>
            <div className="border-b-2 py-10">
                <form onSubmit={changeName} className="flex flex-col gap-2">
                    <label>Your Username:</label>
                    {message && <><p className="bg-red-700 rounded-md w-fit p-2 text-white">{message}</p></>}
                    <input name="name" onChange={(e) => setName(e.target.value)} className="border rounded-md w-fit" value={name} />
                    <button className="border rounded-md w-fit px-2" type="submit">Change</button>
                </form>
            </div>
            </div>
            </>
            }
            <div id="email" className="flex flex-col py-10 gap-2 border-b-2">
                <label>Your Email: </label>
                <input className="border px-2 rounded-md w-fit" readOnly value={serializedUserInfo.email} />
            </div>
            <div id="cart" className="">
            <>
            {serializedUserInfo.cart.length !== 0 && 
            <>
            TODO
            </> 
            }
            </>
            </div>
            <div>
                <>
                {serializedUserInfo.books.length !== 0 && 
                <>
                
                
                </>
                }
                </>
            </div>
            </div>
             </div>
        </div>
        </>
    )
}

export default Settings

