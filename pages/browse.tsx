import type { NextPage } from "next";
import React, { useEffect } from "react";
import type { GetStaticProps } from "next";
import prisma from "../lib/prismadb";
import BlazeSlider from "blaze-slider";
import 'blaze-slider/dist/blaze.css';
import Image from "next/image";



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
       
       <div className="blaze-slider mt-10">
            <div className="blaze-container">
                <div className="blaze-track-container">
                    <div className="blaze-track grid items-center py-5">
                        {props.serilaizedData.map((value : any, index : number) => {
                            return (
                                
                            value.books.map(( value: any, index: number) => {
                                console.log(value)
                                return (
                                    <>
                                    <div className="border border-slate-500 rounded-md flex items-center 
                                    text-center flex-col hover:cursor-pointer hover:scale-105 transition">
                                    <div key={index} id="booksWrapper" className="">
                                        <p>{value.name}</p>
                                        <p className="h-44 hidden z-10"></p>
                                        <Image src={value.image} width="240px" height="400px"/>
                                        <p>{value.price} $</p>
                                        
                                    </div>
                                    </div>
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
       </> 
    )
}

export default Browse