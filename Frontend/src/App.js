import React, { useEffect, useState } from 'react'
import Navbaar from './navbaar/Nav'
import Main from './main/Main'
import io from 'socket.io-client'
import axios from 'axios'
import Print from './printPage/Print' 
import { Route, Routes, useNavigate } from 'react-router'

const App = () => {

   const navigate = useNavigate();
   

  const [myid,setId] = useState(null);
  const [FileUrl,setFileUrl] = useState(null);
  // const [socket,setSocket] = useState(null);

  const postData = async (data)=>{

    await axios.post("https://printwalah.onrender.com/sendData",{
          user_id:data
    })
  } 

  useEffect(()=>{

    const mySocket = io('https://printwalah.onrender.com');

    mySocket.on("connect",()=>{
      console.log("connected to server")
    })

     mySocket.on("justForMe",(data)=>{
       postData(data)
       setId(data)  
    })

    mySocket.on("sendData",(ReceiveFileUrl)=>{ 

      if(ReceiveFileUrl !== FileUrl){
          setFileUrl(ReceiveFileUrl);   
      }
    }) 

  },[])

      if(FileUrl == null){

      return (
         <main>

          <Navbaar/>

          {/* <Main imageUrl={myid}/> */}

          <Routes>
               <Route path='/' element={<Main imageUrl={myid}/>}/>
               <Route path='/print' element={<Print/>}/>
              
           </Routes>

        </main>
  )
  }
  else{
    return(
    <>
     <Navbaar/>
    <Print url={FileUrl}/>
    </>)
  }
}

export default App
