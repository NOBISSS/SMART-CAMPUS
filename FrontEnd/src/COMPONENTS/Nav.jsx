import React from 'react'

export const Nav = () => {
  return (
    <div className='bg-slate-100 w-full h-[70px] font-["Gilroy"]'>
        <div className='Nav flex items-center p-5 pr-20 h-full w-full justify-between'>
            <div className='Logo font-["Gilroy"] text-[2vw] ml-10'>GraviTas</div>
            <div className="links">
                <ul className='flex gap-10 text-[1.5vw] '>
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact</li>
                    <li>Carrer</li>
                </ul>
            </div>
        </div>
    </div>
  )
}
