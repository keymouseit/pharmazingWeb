import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


const FontSizeDropdown = ({onChange, currentState}: any) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [font , setFontSize ] = React.useState(16)
    const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96];

    useEffect(()=>{
        setFontSize(currentState.fontSize)
    },[currentState])
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleSelect = (size:any) => {
      onChange(size);
      setIsOpen(false);
    };



//   const handleChange = (size:any) => {
//     onChange(size);
//   };


  return (
    <div className="relative inline-block text-left">
      <div className="cursor-pointer" onClick={toggleDropdown}>
        <div className="inline-flex justify-between w-full px-4 py-1 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
          {font || 16}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-10 w-full mt-1 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg max-h-[130px] overflow-scroll">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {fontSizes.map((size) => (
              <div
                key={size}
                className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 ${size === (font || 16) && 'bg-gray-300'}`}
                onClick={() => handleSelect(size)}
                role="menuitem"
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSizeDropdown;