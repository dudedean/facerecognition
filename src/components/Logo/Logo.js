import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 125, width: 125 }} >
                <div className="Tilt-inner pa3"> <img src={brain} style={{paddingTop:'5px'}} alt="brain" /> </div>
            </Tilt>
        </div>
    );
}

export default Logo;