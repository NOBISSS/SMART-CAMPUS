import React from 'react'
import { Link } from 'react-router-dom'
const SideBar = () => {
  return (
    <div className="sidebar bg-slate-500 w-[20%] h-screen p-5 flex flex-col items-start">
        <h1 className='font-["gilroy"] font-medium text-emerald-300 text-[2vw] ml-2'>HELLO</h1>
        <h1 className='font-["gilroy"] font-semibold text-emerald-400 text-[3vw]'>ADMIN</h1>
        <br />
        <div className="line h-[2px] w-full bg-black"></div>
        <br />
        <div className="elem">
          <ul className='text-[2vw] cursor-pointer'>
            <Link to='/AdminDash'>TASK</Link><br></br>
            <Link to="/TaskCRUD">TASK EDIT</Link>
            <li>CONTACT</li>
            <li>CAREER</li>
          </ul>
        </div>
        </div>
  )
}

export default SideBar