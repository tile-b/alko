import React, { useEffect, useRef, useState } from 'react';
import { FaGear } from "react-icons/fa6";

import './sidenav.css';

function SideNav({ allImages, list, handleCheckboxChange }) {
  const [navWidth, setNavWidth] = useState(0);

  const openNav = () => {
    setNavWidth(200);
  };
  const closeNav = () => {
    setNavWidth(0);
  };

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setNavWidth(0);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ paddingLeft: '10px', display: 'inline-flex' }}>
      <div className="sidenav" style={{ width: navWidth }} ref={menuRef}>
        <button className="closebtn" onClick={closeNav}>&times;</button>
        
        {/* Checkbox List */}
        <div style={{ paddingTop: '40px' }}>
          {allImages.map(({ src, label }) => (
            <label
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: 'rgb(126 86 86 / 63%)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
            >
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(src, e.target.checked)}
                checked={list.includes(src)}
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              />
              {/* Display Image Next to Checkbox with Black Border */}
              <img 
                src={src} 
                alt={label} 
                style={{
                  width: '30px',
                  height: '30px',
                  marginRight: '10px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid black', // Black border around the image
                }}
              />
              <span style={{ textTransform: 'capitalize', fontWeight: '800' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>
      <span style={{ fontSize: '30px', cursor: 'pointer', paddingRight: '5px' }} onClick={openNav}>
        <FaGear />
      </span>
    </div>
  );
}

export default SideNav;
