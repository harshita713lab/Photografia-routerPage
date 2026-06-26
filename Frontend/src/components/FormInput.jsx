import React, { useState } from 'react';

const FormInput = ({ field, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(field.id, val);
  };

  const labelClass = field.required ? 'form-label required' : 'form-label';

  switch (field.type) {
    case 'select':
      return (
        <div className="form-field">
          <label className={labelClass}>{field.label}</label>
          <select 
            className="form-select" 
            value={value || ''} 
            onChange={handleChange}
            required={field.required}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options && field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'textarea':
      return (
        <div className="form-field">
          <label className={labelClass}>{field.label}</label>
          <textarea 
            className="form-textarea" 
            value={value || ''} 
            onChange={handleChange}
            placeholder={field.placeholder}
            rows="3"
            required={field.required}
          />
        </div>
      );

    case 'date':
      return (
        <div className="form-field">
          <label className={labelClass}>{field.label}</label>
          <input 
            type="date" 
            className="form-input" 
            value={value || ''} 
            onChange={handleChange}
            required={field.required}
          />
        </div>
      );

    case 'tel':
      return (
        <div className="form-field">
          <label className={labelClass}>{field.label}</label>
          <input 
            type="tel" 
            className="form-input" 
            value={value || ''} 
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
          />
        </div>
      );

    case 'email':
      return (
        <div className="form-field">
          <label className={labelClass}>{field.label}</label>
          <input 
            type="email" 
            className="form-input" 
            value={value || ''} 
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
          />
        </div>
      );

    default:
      return (
        <div className="form-field">
          <label className={labelClass}>{field.label}</label>
          <input 
            type="text" 
            className="form-input" 
            value={value || ''} 
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
          />
        </div>
      );
  }
};

export default FormInput;