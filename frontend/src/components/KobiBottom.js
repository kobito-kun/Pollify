import React from 'react'
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';

function KobiBottom() {
  return (
    <Slide bottom duration={1000}>
      <div className="absolute lg:text-white top-5 right-5">
        <Link to="/" className="font-thin select-none hover:text-blue-600 duration-300 cursor-pointer">
          <i className="fas fa-home mr-2"></i>Home
        </Link>
      </div>
    </Slide>
  )
}

export default KobiBottom
