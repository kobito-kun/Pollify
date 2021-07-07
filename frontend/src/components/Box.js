import React from 'react'

function Box({setCurrentPollValues, currentPollValues, text}) {

  const deleteThis = () => {
    let output = [];
    currentPollValues.forEach(x => {
      if(x !== text){
        output.push(x);
      }
    })
    setCurrentPollValues([...output])
  }

  return (
    <div onDoubleClick={() => deleteThis()} className="cursor-pointer select-none inline-block px-2 py-1 rounded-lg hover:bg-gray-400 duration-300 hover:text-white bg-gray-200 m-1">
      {text}
    </div>
  )
}

export default Box
