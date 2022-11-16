import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prismadb";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";


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
    const [readStatus, setReadStatus] : any  = useState();
   

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
        <div id="sideMenu" className="top-0 scroll-smooth left-0 w-60 bottom-0 gap-5 flex flex-col items-center py-10 bg-black fixed text-white">
            <Link className="hover:cursor-pointer border border-b-2 border-white" href="#profile">Profile</Link>
            
            <Link href="#books">Your Books</Link>
        </div>
        <div id="profile" className="my-10 scroll-smooth ml-64 w-full">
           <div>
            {!serializedUserInfo.name  && 
            <>
            <div className="flex flex-col ">
            <div className="border-b-2 py-10">
                <p>Welcome {serializedUserInfo.email}</p>
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
            <h1 className="text-lg text-center my-5">Books You Published on our platform</h1>
            <div className="flex flex-wrap border-b-2 py-5 gap-3">
                {serializedUserInfo.books.length !== 0 &&
                <>
                {serializedUserInfo.books.map((value : any , index : number) => {
                    index++;
                    return (
                        <>
                    {readStatus === index && 
                    <>
                    <div 
                    id="books"
                    onClick={(e : any) => {e.target}}
                     className="h-fit z-10 shadow-2xl scroll-smooth  shadow-slate-600 right-1/3 fixed top-5 w-1/2 left-1/3  bg-white transition
                      items-center flex flex-col rounded-md border  border-black" key={index}> 
                      <p onClick={() => setReadStatus()} className="top-0 right-0 self-end text-5xl font-thin hover:cursor-pointer px-5">x</p>
                        <p>{value.name}</p>
                        <div className="shadow-md shadow-slate-500 p-5 bg-white rounded-md">
                        <Image src={value.image} width="240px" height="400px"/>
                        </div>
                        <p>{value.price}$</p>
                        <>
                        <p
                        className="py-5 px-5"
                         key={index} id="description">{value.description}
                        <span onClick={() => {
                           setReadStatus()
                        }}
                         className="font-thin cursor-pointer text-sm">Read Less</span>
                        </p>
                        </>
                    </div>
                    </>
                    }{readStatus && 
                        <div 
                        id="books"
                     className="h-fit blur-md relative hover:cursor-pointer scroll-smooth hover:scale-105 transition
                      items-center flex flex-col w-64 rounded-md border border-black" key={index}> 
                        <p>{value.name}</p>
                        <Image src={value.image} width="240px" height="400px"/>
                        <p>{value.price}$</p>

                    
                        <p
                        className=""
                         key={index} id="description">{value.description.slice(0, 50)}... 
                        <span id={index.toString()} onClick={() => {
                            setReadStatus(index)
                        }}
                         className="font-thin cursor-pointer text-sm">Read More</span>
                        </p>
                        
                        
                    </div>
                    }{!readStatus && 
                    <div 
                    id="books"
                        onClick={() => setReadStatus(index)}
                     className="h-fit relative hover:cursor-pointer hover:scale-105 transition scroll-smooth
                      items-center flex flex-col w-64 rounded-md border border-black" key={index}> 
                        <p>{value.name}</p>
                        <Image src={value.image} width="240px" height="400px"/>
                        <p>{value.price}$</p>

                    
                        <p
                        className=""
                         key={index} id="description">{value.description.slice(0, 50)}... 
                        <span id={index.toString()} onClick={() => {
                            setReadStatus(index)
                        }}
                         className="font-thin cursor-pointer text-sm">Read More</span>
                        </p>
                        
                        
                    </div>
                }
                        </>
                    )
                })}
                </>
            }
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

