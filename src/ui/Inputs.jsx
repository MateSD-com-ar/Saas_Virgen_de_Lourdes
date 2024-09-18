import React from 'react';

const Inputs = ({ type, placeholder, className, value, onChange, name }) => {
  return (
    <input
      className={className}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
    />
  );
};

export default Inputs;
