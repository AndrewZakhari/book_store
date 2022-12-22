import type { NextPage } from "next";
import React, { useEffect } from "react";
import type { GetStaticProps } from "next";
import prisma from "../lib/prismadb";
import BlazeSlider from "blaze-slider";
import 'blaze-slider/dist/blaze.css';
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { inflateRawSync } from "zlib";


interface book {
    name: String,
    image: any,
    price: String,
    description: String,
    genres: String[]
}



export const getStaticProps : GetStaticProps = async (cxt) => {
    const data = await prisma.user.findMany() 
    let serializedData = await JSON.parse(JSON.stringify(data))
    return {
        props: {
           serializedData 
        }
    }
}

const Browse : NextPage = (props : any) => {
    const [readState, setReadState]  = useState<number | null>();
    const [searchFound, setSearchFound] = useState<book | null>();
    const [searchNotFound, setSearchNotFound] = useState<string | null>();
    const [random, setRandom] = useState<Number[] | null>([Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)]);

    const handleSearch = async (e: any) => {
        e.preventDefault()
        const query  = e.target.query.value;
        const api = await fetch("/api/search" , {
            method: "POST",
            body : query 
        })
        const res : {found : any} = await api.json();
        if(res.found === "Not Found"){
            setSearchNotFound(res.found);
            setSearchFound(null);
        }else {
        setSearchNotFound(null);
        setSearchFound(res.found);
        }
        console.log(res.found);
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
   
    return (
        
       <>
       <div id="search">
        <form  onSubmit={handleSearch} className="justify-center flex  gap-3 my-2">
            <input name="query" type="text" placeholder="Let's find what your're looking for"
             className="border px-2 w-1/3 border-black rounded-md" required />
            <button type="submit" className="border px-2 rounded-md">Search</button>
        </form>
        <div>
            {searchFound  && 
            <>
               <div className="bg-white p-5">
                    <p>{searchFound.name}</p>
                    <Image src={searchFound.image} alt="" width="240px" height="400px" />
                    <div className="flex gap-2">{searchFound.genres.map((value: String, index: number) => {
                                        return (
                                           <p className=" border-gray-300 px-3 border" key={index}>{value}</p>
                                        )
                                    })}</div>
                    <p>{searchFound.price}$</p>
                    <p>{searchFound.description}</p>
                    <p></p>
                </div> 
            </>
            }{searchNotFound && 
                <>
                <div className="grid place-items-center">
                <div className="bg-red-500/75 w-fit px-4  items-center rounded-md flex justify-center">
                    <p className="align-middle flex items-center justify-center gap-5">Couldn&apos;t find what you&apos;r looking for 
                        <span onClick={() => {
                            setSearchNotFound(null);
                        }} className="text-3xl pb-2 hover:cursor-pointer hover:text-red-200/100">x</span>
                        </p>
                </div>
                </div>
                </>
            }
        </div>
       </div>
       <div className="blaze-slider mt-10 ">
            <div className="blaze-container  ">
                <div className="blaze-track-container h- overflow-visible">
                    <div className="blaze-track grid items-center py-5">
                        {props.serializedData.map((value : any, index : number) => {
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
        {props.serializedData.map((value: any ) => {
            return (
                <>
                {value.books.map((value: book , index: number) => {
                    index++
                    return (
                        <>
                            { readState === index && 
                                <div className="border z-10 bg-white flex items-center flex-col
                                 border-slate-500 fixed top-10 left-1/4 w-1/2  p-4 rounded-md shadow-2xl">
                                    <p className="absolute top-0 right-0 px-4 text-5xl hover:cursor-pointer" 
                                    onClick={() => setReadState(null)}
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
            
            <>
            <hr/>
            <h1 className="text-center py-5 text-5xl">Random Selection</h1>
            <div className="flex flex-row justify-center gap-5 pb-5">
            {props.serializedData.map((value : any) => {
                            return (    
                            value.books.map(( value: book, index: number) => {
                                index++;
                                return (
                                random?.map((randomIndex : Number) => {
                                    return(
                                        <>
                                        {randomIndex === index && 
                                        <>
                                        {!readState &&
                                            <div className="border px-3 border-slate-500 h-max rounded-md flex items-center 
                                              text-center flex-col hover:cursor-pointer hover:scale-105 transition">
                                            <div key={index} onClick={() => {
                                        
                                              setReadState(index)
                                            }} id="booksWrapper" className="">
                                            <p>{value.name}</p>
                                            <Image src={value.image} alt="" width="240px" height="400px"/>
                                            <p>{value.price} $</p>
                                        
                                            </div>
                                            </div>
                                        }
                                        </>
                                        }
                                        </>
                                    )
                                })
                                ) 
                            })      
                            )
                            
                        })
                        }
                        </div>
            </>

       </> 
    )
}

export default Browse