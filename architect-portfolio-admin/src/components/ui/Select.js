// src/components/ui/Select.js
import React from 'react';

const Select = ({ 
  label, 
  name, 
  options = [], 
  value, 
  onChange, 
  error, 
  disabled = false,
  required = false,
  className = '',
  placeholder = 'Select an option',
  hint,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                   bg-white border focus:border-blue-500 focus:ring-2 
                   focus:ring-blue-500 focus:ring-opacity-50 transition duration-200
                   appearance-none bg-no-repeat pr-10
                   ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem'
        }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={typeof option === 'object' ? option.value : option} 
            value={typeof option === 'object' ? option.value : option}
          >
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="mt-1 text-sm text-red-600">{error}</div>
      )}
      
      {hint && !error && (
        <div className="text-sm text-gray-500 mt-1">{hint}</div>
      )}
    </div>
  );
};

export default Select;