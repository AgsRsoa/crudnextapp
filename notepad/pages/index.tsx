import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '../lib/prisma';
import { link, truncateSync } from 'fs';
import { useRouter } from 'next/router';
import { StringMappingType } from 'typescript';


const inter = Inter({ subsets: ['latin'] })

interface FormData {
  title: string
  content: string
  id: string
}

interface Notes {
  notes: {
  id:string
  title:string
  content: string 
}[]
}

export default function Home({notes}:Notes) {

  const [form, setForm ] = useState<FormData>({title: '', content: '', id: ''});
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);//nouveau state pour tracer si editing mode est actif
  const [editNoteId, setEditNoteId]=useState<string|null>(null);//state pour stocker l'id de la note en cours de modfication

  //appelle le client avec le current path pas besoin de refresh pour voir la nouvelle note ajoutée
  const refreshData = () =>{
    router.replace(router.asPath)
  }

  const create = async( data: FormData) =>{
    try {
      fetch('http://localhost:3000/api/create', 
      { body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method:'POST'
      }).then(()=>{setForm({title:'',content:'',id:''}); refreshData();})
    } catch (error) {
      console.log(error);
    }

  };
  
  const handleSubmit = async(data: FormData ) =>{

    if(isEditing && editNoteId){
      try {
        fetch(`http://localhost:3000/api/n/${data.id}`,{
          body:JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          method:'PUT'
        })

        //Clear le form et Quitte le mode editing
        setForm({title:'',content:'',id:''});
        setIsEditing(false);
        setEditNoteId(null);
        
        //refresh la liste
        refreshData();
      } catch (error) {
        console.log(error)
      }

    }


    else{    try {
      create(data)
    } catch (error) {
      console.log(error);
    }}


  };

  const deleteNote = async(id: string )=>{
    try {
      fetch(`http://localhost:3000/api/note/${id}`,
      {headers:{
        "Content-Type": "application/json",
      },
      method:'DELETE'     
    }).then(()=>{refreshData()})
      
    } catch (error) {
      console.log(error)
      
    }
  };

  const updateNote = (note: FormData) =>{
    //setForm avec le titre et content de la note courante 
    setForm({...note});
    setEditNoteId(note.id);
    setIsEditing(true);
    //Modifier l'UI pour peupler les champs du form avec les current values au moment du click
    //Envoyer une PUT request au submit du form 



  };

  const cancelEdit = () =>{
    setForm({title: '',content: '', id: ''})
    setIsEditing(false);
    setEditNoteId(null);
  }


  



  return (
   
    <div>
      <h1 className='text-center font-bold text-2xl mt-4 mb-8'>Note Pad</h1>
      <form onSubmit={e =>{e.preventDefault(); handleSubmit(form); }} className='flex flex-col space-y-6 items-center'>
        <input 
        type="text"
        id="title"
        name="title"
        placeholder='Title' 
        value={form.title} 
        onChange={(e =>setForm({...form,title: e.target.value}))} 
        className='border-2 rounded border-gray-600 p-1 w-96'/>

        <textarea 
        id="content"
        name="content"
        placeholder='Content' 
        value={form.content} 
        onChange={(e =>setForm({...form,content: e.target.value}))} 
        className='border-2 rounded border-gray-600 p-1 w-96'/>
        <button type='submit' className='bg-blue-500 text-white rounded p-1 w-96'>Add a new note</button>
      </form>
      <div className='mt-8 flex justify-center'>
        <ul>
          {notes.map((note) =>
             <li key={note.id} className='mb-2'>
                <h1 className='font-bold'>{note.title}</h1>
                <p>{note.content}</p>
                <button onClick={()=>deleteNote(note.id)} className='bg-transparent hover:bg-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'>❌</button>
               <button onClick={()=>{updateNote(note)}}>🖊️</button> 
              </li>
          )}
        </ul>
      </div>
    </div>

  
  )
}

//Pour afficher les notes via props, getServerSideProps

export const getServerSideProps: GetServerSideProps = async() =>{
  const notes =  await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true
    }
  });

  return { props:{notes} }
}