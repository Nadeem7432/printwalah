import React, { useEffect, useRef, useState } from 'react'
import  './Print.css'
import { useLocation } from 'react-router-dom';

const Print = (props) => {


  const iframeRef = useRef(null);
  const [blobUrl,setBlobUrl] = useState(null);

    const location = useLocation();


  const HandlePrint = ()=>{
    const iframe = iframeRef.current;
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }

  useEffect(()=>{

    const loadPdfAsBlob = async ()=>{

        if(props.url || location.state.url){
          try{
              const response = await fetch(props.url || location.state.url);
              const blobData = await response.blob();
              const localUrl = URL.createObjectURL(blobData);
              setBlobUrl(localUrl);
          }catch(error){
              console.log(error)
          }
        }
    }
    loadPdfAsBlob();

    return ()=>{
      if(blobUrl){
        URL.revokeObjectURL(blobUrl);
      }
    }
  },[props.url,location])

  
  return (
    <div className='main_div'>

      <div className='for_button'>

            <button className='print_button' onClick={()=>{HandlePrint()}}>Print</button>
      </div>
     
        <iframe ref={iframeRef} className='iframe' src={blobUrl} title='pdfPrint'/>
      
    </div>
  )
}

export default Print

