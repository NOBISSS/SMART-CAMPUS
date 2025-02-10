import React from 'react'
import { Link } from 'react-router-dom'
const handleLogout = () => {
  localStorage.removeItem('token'); // Remove token
  window.location.reload(); // Refresh page
};
const SideBar = () => {
  return (
    <div className="sidebar bg-slate-500 w-[20%] h-screen p-5 flex flex-col items-start">
        <h1 className='font-["poppins"] font-medium text-emerald-300 text-[2vw] ml-2'>HELLO</h1>
        <h1 className='font-["poppins"] font-semibold text-emerald-400 text-[3vw] -mt-5'>ADMIN</h1>
        <br />
        <div className="line h-[2px] w-full bg-black"></div>
        <br />
        <div className="elem">
          <ul className='text-[2vw] cursor-pointer'>
            <Link to='/AdminDash'>TASK</Link><br></br>
            <Link to="/TaskCRUD">EDIT TASK</Link>
            <li>CONTACT</li>
            <li>CAREER</li>
            <Link to='/' onClick={handleLogout} className='bg-red-600 rounded-md text-[2vw]'>LOGOUT</Link>
          </ul>
        </div>
        </div>
  )
}

export default SideBar