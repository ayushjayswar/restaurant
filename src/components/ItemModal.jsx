import React from 'react'

const ItemModal = ({isopen , onClose , item}) => {
    
    if (!isopen || !item){
        return null;
    }
  return (

    <div className=' fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      
      <div className='bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative'>

        <button onClick={onClose} className='absolute items-center top-2 right-4 hover:text-white text-xl border w-8 rounded-full bg-red-800 text-white cursor-pointer '>
            &times;
        </button>
        <img src={item.image} alt={item.title} 
        className='rounded w-full h-48 object-cover mb-4'
        />
        <p className=' text-black text-2xl font-bold '>{item.title}</p>
        <p className=' text-gray-800 text-lg '>{item.description}</p>
        <p className=' text-red-700 font-bold  '>{item.price}</p>
        
        

      </div>
    </div>
  )
}

export default ItemModal
