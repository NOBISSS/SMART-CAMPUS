import React, { useState } from 'react'

export const Login = () => {
    const [input, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
  

    // Step 3: Handle form submission
    const handleSubmit = async (e) => {
      
  
      // Step 4: Send API request
      try {
const response = await fetch('http://localhost:8000/api/v1/admin/getuser/', {
          method: 'GET',
          headers: {  
            'Content-Type': 'application/json',
          },
        //   body: JSON.stringify({ input, password }), // Send email & password as JSON
          credentials:'include'
        });
        
        const data = await response.json(); // Convert response to JSON
        console.log(data.data)
        if (response.ok) {
          setMessage('Login successful! ✅');
          localStorage.setItem('token', data.token); // Step 5: Store token if needed
        } else {
          setMessage(data.message || 'Login failed! ❌');
        }
      } catch (error) {
        setMessage('Error: ' + error.message);
      }
    };
    return (
            
        <div className='w-screen h-screen flex items-center justify-center bg-slate-950'>
            
            <div className='border-2 rounded-xl border-emerald-600 p-24 bg-slate-800 font-["Gilroy"]'>
            <h1 className='text-emerald-500 font-extrabold text-[2.5vw] text-center mb-5'>LOGIN</h1>    
                <form onSubmit={handleSubmit}
                    className='flex flex-col items-center justify-center '
                >
                    
                    <input name='input' value={input} 
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }} 
                    type="text" required placeholder='Enter Your Email'
                    className='text-white border-2 outline-none border-emerald-600 rounded-full font-medium text-xl py-2 
                placeholder:text-grey-400
                bg-transparent px-6'
                    >
                    </input>
                    <input name='password' onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                        value={password} type="password" required placeholder='Enter Your Password'
                        className='text-white border-2 outline-none border-emerald-600 rounded-full font-medium text-xl py-2 
                placeholder:text-grey-400
                bg-transparent px-6 mt-3'
                    >
                    </input>
                    <button className='bg-yellow-500 border-2 border-none outline-none border-emerald-600 rounded-full font-semibold text-xl py-2 
                    placeholder:text-grey-400 hover:bg-emerald-700
                bg-transparent px-32 mt-10 text-white'>Log in</button>

                </form>
            </div>
        </div>
    )
}
