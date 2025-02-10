import React from 'react'

const TaskList = () => {
  return (
    <div id='tasklist' className='overflow-x-auto h-[55%] w-full py-5 mt-10 flex justify-start items-center gap-5 flex-nowrap'>
    <div className="flex-shrink-0 h-full w-[350px] p-5 bg-red-400 rounded-xl">
        <div className="flex justify-between items-center">
            <h3 className='bg-red-600 px-3 py-1 rounded'>High</h3>
            <h4 className=''>20 Feb 2024</h4>
        </div>
        <h2 className="mt-5 text-3xl font-semibold">Make Youtube Video</h2>
        <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, unde molestiae. Autem sed rerum dicta.</p>
</div>
    <div className="flex-shrink-0 h-full w-[350px] p-5 bg-green-400 rounded-xl">
        <div className="flex justify-between items-center">
            <h3 className='bg-red-600 px-3 py-1 rounded'>High</h3>
            <h4 className=''>20 Feb 2024</h4>
        </div>
        <h2 className="mt-5 text-3xl font-semibold">Make Youtube Video</h2>
        <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, unde molestiae. Autem sed rerum dicta.</p>
</div>
    <div className="flex-shrink-0 h-full w-[350px] p-5 bg-blue-400 rounded-xl">
        <div className="flex justify-between items-center">
            <h3 className='bg-red-600 px-3 py-1 rounded'>High</h3>
            <h4 className=''>20 Feb 2024</h4>
        </div>
        <h2 className="mt-5 text-3xl font-semibold">Make Youtube Video</h2>
        <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, unde molestiae. Autem sed rerum dicta.</p>
</div>
    <div className="flex-shrink-0 h-full w-[350px] p-5 bg-yellow-400 rounded-xl">
        <div className="flex justify-between items-center">
            <h3 className='bg-red-600 px-3 py-1 rounded'>High</h3>
            <h4 className=''>20 Feb 2024</h4>
        </div>
        <h2 className="mt-5 text-3xl font-semibold">Make Youtube Video</h2>
        <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, unde molestiae. Autem sed rerum dicta.</p>
</div>
    </div>
  )
}

export default TaskList