import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request:NextApiRequest,response: NextApiResponse) {

const noteId = request.query.id;

if(request.method === 'DELETE'){
    //await
   const note =  await prisma.note.delete({
        where:{ id: Number(noteId)}
    });
    response.json(note);
} else  {
    console.log("Note cannot be deleted")
}
}
