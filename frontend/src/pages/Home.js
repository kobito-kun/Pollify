import React, {useState} from 'react'
import SVGHome from '../assets/undraw.svg';
import Slide from 'react-reveal/Slide';
import Form from '../components/Form';

function Home() {

  const [form, setForm] = useState(false);

  return (
    <div className="w-screen h-auto lg:min-h-screen grid lg:grid-cols-2">
      <div className="flex justify-center items-center">
        {form 
        ?
          <Form />
        :
        <Slide bottom duration={1000}>
          <div className="text-center">
            <h1 className="beneth text-6xl font-thin">Pollify</h1>
            <h3 className="font-thin text-2xl">Instantly deploy polls in a matter of seconds.</h3>
            <button onClick={() => setForm(!form)} className="shadow-lg font-thin uppercase px-4 py-2 bg-red-400 rounded-lg my-2 text-white">Create a poll</button>
          </div>
        </Slide>
        }
      </div>
        <div className="bg-gradient-to-br from-red-400 via-red-500 to-red-600 lg:h-auto h-96 flex justify-center items-center">
          <Slide top duration={1000}>
            <img src={SVGHome} alt="SVG HOME" className="w-2/4 lg:w-3/4 select-none" />
          </Slide>
        </div>
    </div>
  )
}

export default Home
