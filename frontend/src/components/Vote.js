import React from 'react'

function Vote({submitVote, title, count}) {

  return (
    <div onClick={() => submitVote(title)} className="items-center rounded-lg shadow-lg border px-8 py-4 text-center m-1 select-none cursor-pointer hover:shadow-xl duration-300 hover:border-gray-400">
      <h1 className="text-6xl font-extrabold">{count}</h1>
      <span clasName="font-thin">{title}</span>
    </div>
  )
}

export default Vote
