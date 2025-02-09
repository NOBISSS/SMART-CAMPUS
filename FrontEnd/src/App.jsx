import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Login } from './COMPONENTS/Auth/Login'
import { Nav } from './COMPONENTS/Nav'
import TEST from './COMPONENTS/TEST'
import { TESTING1 } from './COMPONENTS/TESTING1'
import { AdminDash } from './COMPONENTS/Dashboard/AdminDash'
import { Route, Routes } from 'react-router-dom'
import { TaskCRUD } from './COMPONENTS/Dashboard/TaskCRUD'

function App() {
  return (
    <>
      {/* <Nav></Nav> */}
       
      
      
      <Routes>
      <Route path='/*' element={<Login/>}></Route>
        <Route  element={<AdminDash/>}></Route>
      <Route path='/TaskCRUD' element={<TaskCRUD/>}></Route>
      </Routes>
    </>
  )
}

export default App
