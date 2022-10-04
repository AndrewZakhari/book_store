import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import React from "react";
import Image from "next/image";
import { useState } from "react";
const axios = require('axios');


interface form  {
   [key : string] : any
}





const Post : NextPage = () => {

    const [error, setError] = useState("")
    const [Todo, setTodo] = useState(true)

   async function handlePost(e : form){
        e.preventDefault(); 
    const arr = [e.target.image.files[0], e.target.price.value, e.target.description.value]
    const imageType = e.target.image.files[0].name.split('.')[1] 
    console.log(imageType === 'jpg')
    if(imageType !== 'jpg' && imageType !== "jpeg"){
        console.log("Image Type Not Supported")
        setError("Image Type Not Supported")
    }else{
        console.log("Image Type Supported")
        setError("")
            const form = e.currentTarget;
            
            const fileInput = form.elements.image

            const formData = new FormData();
            
            for (const file of fileInput.files){
                formData.append('file', file);
            }

            formData.append("upload_preset", "my_uploads")

            const data = await fetch(process.env.CLOUDINARY_UPLOAD_URL , {
                method: "POST",
                body: formData
            })
            const res = await data.json()
            

            1
           const api = await axios({
                url: "/api/post",
                method: 'POST',
                headers: {"Content-Type" : "application/json"},
                data: {
                    image : res.secure_url, 
                    price : e.target.price.value,
                    description: e.target.description.value
                }
            })
            console.log(api)
        }
    }
    


    if(Todo){
    return (
        <>
        <div className="align-middle grid  place-content-center">
            <form className="grid gap-3 place-items-center rounded-lg p-3 col-start-1 col-end-2 grid-cols-1 border-2 w-100 shadow-lg items-center text-center" onSubmit={handlePost}>
                {error !== "" && 
                <p className="text-white bg-red-600 rounded-md p-2 ">{error}</p>
                }
                <label className="">Upload Book's Image</label>
                <input required type="file" name="image" />
                <label>Price:</label>
                <input required className="border rounded-md border-black" type="number" name="price"/>
                <label>Description</label>
                <textarea  name="description" placeholder="Write a description"></textarea>
                <button className="bg-blue-700 align-middle rounded-md w-20 text-white" type="submit">Submit</button>
            </form>
 
        </div>
        </>
    )
}else{
    return(
    <h1>Under Construction</h1>
    )
}
            }
        

export default Post