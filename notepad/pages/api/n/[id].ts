import {prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request:NextApiRequest,response: NextApiResponse) {

    const {title, content} = request.body;
    const id = request.query.id;
  
    if(request.method === 'PUT'){
        //await
       const updatedNote =  await prisma.note.update({
           where:{
            id: Number(id)

           },
           data:{
            title,
            content
           }
        });
        response.json(updatedNote);
    } else{
        console.log("Note cannot be modified ")
    }
}