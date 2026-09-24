import React from 'react'

const InputField = ({label, name, value, onChange, type='text', placeholder, maxlength}) => {

    const today = new Date().toISOString().split('T')[0]

    return (
        <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'></div>

            <label
                htmlFor={name}
                className='block text-shadow-gray-900 mb-2 font-semibold'
            >
                {label}
            </label>

            {maxlength && (
                <span className='text-us text-gray-900'>
                    {value.length}/{maxlength}
                </span>
            )}

            <input 
                type={type} 
                id={name} 
                name={name}
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                min={type === "date" ? today : undefined}
                className='w-full px-4 py-2 rounded border placeholder:text-xs'
            />
        </div>
    )
}

export default InputField