import React from 'react'

const SelectInput = ({ label, placeholder, name, onChange, value, options }) => {
  return (
    <div className='mb-4'>

      <label
        htmlFor={name}
        className='block text-gray-900 mb-2 font-semibold'
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        onChange={onChange}
        value={value}
        className='w-full px-4 py-2 rounded border text-xs'
      >

        {options.map((opt, index) => (
          <option
            key={`${opt.value}-${index}`}
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}

      </select>

    </div>
  )
}

export default SelectInput