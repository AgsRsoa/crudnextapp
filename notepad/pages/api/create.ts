import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request:NextApiRequest,response: NextApiResponse) {

    const { title, content } = request.body;

    try {
        //create,delete,findmany
        await prisma.note.create({
            data: {
                title,
                content
            }
        })
        response.status(200).json({message: 'Note successfully created '})
    } catch (error) {
        console.log('Fail to create a note');
        
    }
    
}