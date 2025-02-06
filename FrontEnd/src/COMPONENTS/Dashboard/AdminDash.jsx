import React, { useState } from 'react';
import axios from 'axios';
import { Check } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import SideBar from '../Others/SideBar';

export const AdminDash = () => {
  const [task, setTask] = useState({ semester: "", taskDetails: "" });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/task/create", task);
      alert("Task Created Successfully!");
      setTask({ semester: "", taskDetails: "" }); // Reset form
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="container w-screen h-screen bg-slate-400 font-['gilroy'] text-white flex">
      
        <SideBar/>
        <div className="flex flex-col items-start justify-start p-10 w-[80%] h-screen ">
        <form onSubmit={handleSubmit}>
          <h2>TASK TITLE</h2>
          {/* <input 
            type='text' 
            // name="title"
            required
            value={task.title} 
            onChange={handleChange} 
            placeholder='Enter Task Title' 
            className='text-black p-2 w-full' 
          /> */}
          <br />
          
          <h2>Semester</h2>
          <input 
            type="number" 
            name="semester"
            required
            value={task.semester} 
            onChange={handleChange} 
            placeholder='DD/MM/YYYY' 
            className='text-black p-2 w-full' 
          />
          <br />

          <h2>TASK DESCRIPTION</h2>
          <textarea 
            name="taskDetails" 
            value={task.taskDetails} 
            required
            onChange={handleChange} 
            rows={3} 
            className='text-black p-2 w-full' 
          />
          <br />


          <button type="submit" className="bg-blue-500 p-3 mt-5 text-white">
            Create Task
          </button>
        </form>
        </div>
      </div>
  );
};
