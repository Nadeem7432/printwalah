import React from 'react'
import './main.css'
import Mykey from '../icon/key.svg'
import Check from '../icon/check.svg'
import Qr from '../icon/qr.svg'
import Print from '../icon/print.svg'
import Lightning from '../icon/lightning.svg'
import Shield from '../icon/shield.svg'
import QRCode from "react-qr-code";

const Main = (props) => {   

  return (
    
   <div className='main_sectioin'>

    <div className='for_align_center'>

        
        <div className='main_section_left_side'>

            <div className='main_left_side'>

            <div className='card'>

                        <div className='icon'>
                          <img src={Qr} className='img' alt='img'/>
                        </div>

                        <div className='discription'>
                            <h2>Print With Unique Code</h2>
                            <p>Please enter your unique code in the box on the Top right.</p>
                    
                        </div>

                         <div className='check'>
                            <img src={Check} alt='img'/>

                         </div>

            </div>

            <div className='card'>

                       <div className='icon'>
                          <img src={Qr} className='img' alt='img'/>
                        </div>

                        <div className='discription'>
                            <h2>Scan the QR Code</h2>
                            <p>Scan the QR code displayed on the right side.</p>
                    
                        </div>

                         <div className='check'>
                            <img src={Check} alt='img'/>

                         </div>

            </div>

            <div className='card'>

                        <div className='icon'>
                          <img src={Print} className='img2' alt='img'/>
                        </div>

                        <div className='discription'>
                            <h2>Get Your Prints</h2>
                            <p>Access and download your documents photos, and more instantly!</p>
                    
                        </div>

                         <div className='check'>
                            <img src={Check} alt='img'/>

                         </div>

            </div>

            <div className='card'>

                        <div className='icon'>
                          <img src={Lightning} className='img2' alt='img'/>
                        </div>

                        <div className='discription'>
                            <h2>Fast, Easy & Reliable</h2>
                            <p>Get your prints in seconds with our seamless service.</p>
                    
                        </div>

                         <div className='check'>
                         </div>

            </div>

            </div>

        </div>

        <div className='main_section_right_side'>

                <div className='conic_gradient'>

                    <div className='section_start'>

                        <div className='qr_code'>

                           {
                                props.imageUrl ? 
                                <QRCode
                                     size="80%"
                                     bgColor='white'
                                     fgColor='black'
                                     value={props.imageUrl}
                            />
                            : <p className='loading_Text'>Loading...</p>

                            }

                            <h3>Scan this QR code</h3>
                            <p>for instant access to your prints!</p>

                        </div>

                        <div className='information'>

                            <div className='info_left'>
                                <img src={Shield} alt='img' />
                            </div>
                            
                            <div className='info'>
                                <h1>24/7 Service</h1>
                                <p>Super Fast & Secure Printing</p>
                            </div>
                        </div>

                    </div>

                    
                </div>

        </div>
   </div>

   </div>

  )
}

export default Main
