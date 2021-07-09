import React from 'react';
import Slide from 'react-reveal/Slide';

function Kobi() {
  return (
    <Slide top duration={1000}>
      <div className="absolute top-5 left-5">
        <span className="flex leading-4 font-bold hover:text-blue-600 duration-300 cursor-pointer select-none">
          <i className="fab fa-github mr-2"></i>
          <p>Kobi</p>
        </span>
      </div>
    </Slide>
  )
}

export default Kobi
