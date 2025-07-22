// src/components/ui/Checkbox.js
import React from 'react';

const Checkbox = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  error, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="form-group">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded cursor-pointer
                     border-gray-300 transition duration-200 ease-in-out ${className}`}
          {...props}
        />
        
        {label && (
          <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <div className="mt-1 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
};

export default Checkbox;