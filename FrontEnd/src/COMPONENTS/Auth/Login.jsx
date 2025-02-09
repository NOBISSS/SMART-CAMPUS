import React, { useState, useEffect } from 'react';
import { AdminDash } from '../Dashboard/AdminDash';

export const Login = () => {
    const [input, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLog, setIsLog] = useState(false);

    // ✅ Check localStorage for token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLog(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/login/', {
                method: 'POST',
                headers: {  
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input, password }), 
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful! ✅');
                console.log('Login successful! ✅');
                localStorage.setItem('token', data.token); // Store token in localStorage
                setIsLog(true); // Set login state to true
            } else {
                setMessage(data.message || 'Login failed! ❌');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    // ✅ If logged in, show AdminDash
    if (isLog) {
        return <AdminDash />;
    }

    return (
        <div className='w-screen h-screen flex items-center justify-center bg-slate-950'>
            <div className='border-2 rounded-xl border-emerald-600 p-24 bg-slate-800 font-["Gilroy"]'>
                <h1 className='text-emerald-500 font-extrabold text-[2.5vw] text-center mb-5'>LOGIN</h1>    
                <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center '>
                    <input name='input' value={input} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="text" required placeholder='Enter Your Email'
                        className='text-white border-2 outline-none border-emerald-600 rounded-full font-medium text-xl py-2 
                        placeholder:text-grey-400 bg-transparent px-6'
                    />
                    <input name='password' 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password} type="password" required placeholder='Enter Your Password'
                        className='text-white border-2 outline-none border-emerald-600 rounded-full font-medium text-xl py-2 
                        placeholder:text-grey-400 bg-transparent px-6 mt-3'
                    />
                    <button className='bg-yellow-500 border-2 border-none outline-none border-emerald-600 rounded-full font-semibold text-xl py-2 
                    placeholder:text-grey-400 hover:bg-emerald-700 bg-transparent px-32 mt-10 text-white' >
                        Log in
                    </button>
                </form>
                <p className="text-white mt-4">{message}</p>
            </div>
        </div>
    );
};
