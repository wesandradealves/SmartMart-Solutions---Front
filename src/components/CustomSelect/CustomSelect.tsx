import classNames from 'classnames';
import React from 'react';

interface CustomSelectProps {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  onChange: (value: string) => void;
  className?: string;
  value: string;
  placeholder?: string; 
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, error, placeholder, className, onChange, value }) => {
  return (
    <div 
    className={classNames(
      "flex flex-col gap-2",
      className
    )}>
      <select
        className="p-2 text-sm border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" className="text-sm text-gray-800">{placeholder ?? 'Selecione uma opção'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-sm text-gray-800">
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default CustomSelect;