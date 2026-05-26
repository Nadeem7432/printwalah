import React, { useEffect, useRef, useState } from 'react'
import  './Print.css'

const Print = (props) => {


  const iframeRef = useRef(null);
  const [blobUrl,setBlobUrl] = useState(null);


  const HandlePrint = ()=>{
    const iframe = iframeRef.current;
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }

  useEffect(()=>{

    const loadPdfAsBlob = async ()=>{

        if(props.url){
          try{
              const response = await fetch(props.url);
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
  },[props.url])

  
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

