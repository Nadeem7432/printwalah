import React, { useState } from 'react'
import './nav.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Nav = () => {

    const [id, setId] = useState([]);
    const navigation = useNavigate()

    const PrintUsingCode = async ()=>{

        const receive = await axios.get(`https://printwalah.onrender.com/fetch-url/${id}}`)

        try{

            if(receive){
                navigation('/print',{state:{url:receive.data.unique_data[0].file_url}})
            }
            else{
                alert("File Not Receive Try Again")
            }

        }catch(error){
            alert("File Not Found")
        }        
    }

  return (
  
    <nav>
        <div className='main_container'>

            <div className='left_side'>

                <h1 className='print_logo'>Print<span className='walah_logo'>Walah</span></h1> 

            </div>  

            <div className='right_side'>

                <input className='input_box' placeholder='Enter Unique Code' value={id} onChange={(e)=>{setId(e.target.value)}}/>
                <button className='submit_btn' onClick={()=>{PrintUsingCode()}}>Submit</button>

            </div>
        </div>

    </nav>
  )
}

export default Nav
