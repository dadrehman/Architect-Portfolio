// src/components/ui/TextArea.js
import React from 'react';

const TextArea = ({ 
  label, 
  name, 
  placeholder = '', 
  value, 
  onChange, 
  error, 
  rows = 4,
  disabled = false,
  required = false,
  className = '',
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
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                   bg-white border focus:border-blue-500 focus:ring-2 
                   focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 
                   ease-in-out text-gray-900 min-h-[100px] resize-y
                   ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      
      {error && (
        <div className="mt-1 text-sm text-red-600">{error}</div>
      )}
      
      {hint && !error && (
        <div className="text-sm text-gray-500 mt-1">{hint}</div>
      )}
    </div>
  );
};

export default TextArea;