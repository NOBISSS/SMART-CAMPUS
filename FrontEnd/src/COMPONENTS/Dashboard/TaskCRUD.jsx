import React from 'react'
import SideBar from '../Others/SideBar'

export const TaskCRUD = (props) => {
  return (
    <div className='flex'>
        <SideBar/>
        <div className='p-10 bg-slate-700 w-screen h-screen '>
          <div className='TASK-LIST flex items-center justify-around bg-slate-300 rounded-lg h-[50px]'>
              <h1 className='TASK-TITLE'>MAKE A NOTES ON C LANGUAGE</h1>
          </div>
        </div>
    </div>
  )
}
