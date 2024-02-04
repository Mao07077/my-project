import React from 'react';
import logo from '../assets/cclogo.png'
import './headers.css'
const Header = () => {
  return (
            <div className='cont'>
                <img className='logoos' src={logo} /> 
             </div>
  );
}

export { Header };
