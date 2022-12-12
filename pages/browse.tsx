import type { NextPage } from "next";
import React, { useEffect } from "react";
import type { GetStaticProps } from "next";
import prisma from "../lib/prismadb";
import BlazeSlider from "blaze-slider";
import 'blaze-slider/dist/blaze.css';
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

interface book {
    name: String,
    image: any,
    price: String,
    description: String,
    genres: String[]
}



export const getStaticProps : GetStaticProps = async (cxt) => {
    const data = await prisma.user.findMany() 
    let serilaizedData = await JSON.parse(JSON.stringify(data))
    return {
        props: {
           serilaizedData 
        }
    }
}

const Browse : NextPage = (props : any) => {
    const [readState, setReadState] : any  = useState() 
    const [input, setInput] : any = useState("")

    console.table(props)

    const handleSearch = async (e: any) => {
        e.preventDefault()
        console.log(e)
    }

    const handleInputChange = async (e: any) => { 
        setInput(e.target.value)
        if(e.target.value.length >= 2){
             const api : any = await axios({
                method: "POST",
                data: input,
                headers: {"Content-Type" : "application/json"},
                url: '/api/search'
             })
             console.log(api)
            console.log("API Called")
        }else {
            console.log("API was not called")
        }
    }
    
   useEffect(() => {
    const e1 : any = document.querySelector('.blaze-slider');
    new BlazeSlider(e1, {
        all : {
            slidesToShow: 5,
            slideGap: '50px',
            slidesToScroll: 1,
            loop: true,
            
    },
})
   }, [])
   console.log(props.serilaizedData)
    return (
        
       <>
       <div id="search">
        <form  onSubmit={handleSearch} className="justify-center flex  gap-3 my-2">
            <input onChange={handleInputChange} value={input} name="query" type="text" placeholder="Let's find what your're looking for"
             className="border px-2 w-1/3 border-black rounded-md" required />
            <button type="submit" className="border px-2 rounded-md">Search</button>
        </form>
       </div>
       <div className="blaze-slider mt-10 ">
            <div className="blaze-container  ">
                <div className="blaze-track-container h- overflow-visible">
                    <div className="blaze-track grid items-center py-5">
                        {props.serilaizedData.map((value : any, index : number) => {
                            return (    
                            value.books.map(( value: book, index: number) => {
                                index++;
                                
                                return (
                                    <>
                                    {!readState &&
                                    <div className="border border-slate-500 h-max rounded-md flex items-center 
                                    text-center flex-col hover:cursor-pointer hover:scale-105 transition">
                                    <div key={index} onClick={() => {
                                        
                                        setReadState(index)
                                    }} id="booksWrapper" className="">
                                        <p>{value.name}</p>
                                        <p className="h-44 hidden z-10"></p>
                                        <Image src={value.image} alt="" width="240px" height="400px"/>
                                        <p>{value.price} $</p>
                                        
                                    </div>
                                    </div>
                            } { readState && 
                                <div className="border blur-lg border-slate-500 h-max rounded-md flex items-center 
                                    text-center flex-col hover:cursor-pointer hover:scale-105 transition">
                                    <div key={index} onClick={() => {
                                        setReadState(index)
                                    }} id="booksWrapper" className="">
                                        <p>{value.name}</p>
                                        <p className="h-44 hidden z-10"></p>
                                        <Image src={value.image} alt="" width="240px" height="400px"/>
                                        <p>{value.price} $</p>
                                        
                                    </div>
                                    </div>
                            } 
                                    </>
                                )
                            })
                            )
                            
                        })
                        
                        }
                         
                    </div>
                </div>
                <button className="blaze-prev absolute text-4xl top-48 rounded-full bg-white border p-2 left-5">&lt;</button>
                <button className="blaze-next top-48 absolute text-4xl rounded-full bg-white border p-2 right-5">&gt;</button>
            </div>
        </div>
        {props.serilaizedData.map((value: any , index : number) => {
            return (
                <>
                {value.books.map((value: book , index: number) => {
                    index++
                    return (
                        <>
                            { readState === index && 
                                <div className="border bg-white flex items-center flex-col
                                 border-slate-500 fixed top-10 left-1/4 w-1/2  p-4 rounded-md shadow-2xl">
                                    <p className="absolute top-0 right-0 px-4 text-5xl hover:cursor-pointer" 
                                    onClick={() => setReadState()}
                                    >x</p>
                                    <p className="font-bold text-2xl">{value.name}</p>
                                    <div className="bg-white p-2 border rounded-md  ">
                                    <Image src={value.image} alt="" width="240px" height= "400px" />
                                    </div>
                                    <p>{value.price}$</p>
                                    <div className="flex gap-2">{value.genres.map((value: String, index: number) => {
                                        return (
                                           <p className=" border-gray-300 px-3 border" key={index}>{value}</p>
                                        )
                                    })}</div>
                                    <p>{value.description}</p>
                                </div>
                                
                            }
                            </>
        )
         }
                                )
                }
                            </>
             )
                        })
                            }
       </> 
    )
}

export default Browse