import React from 'react'

const Textarea = ({label , name , value , onChange , placeholder}) => {
  return (
    <div className='mb-4'>
        <label htmlFor={name} className='block text-gray-900 font-semibold'>{label}</label>

        <textarea name={name} id={name}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
        rows='4'
        className='w-full px-4 rounded border placeholder:text-xs py-1'
        ></textarea>
      
    </div>
  )
}

export default Textarea
