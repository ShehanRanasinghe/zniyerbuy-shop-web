// Input — Reusable form input components: text Input, Textarea, and Select
// All support label, icon, required indicator, and spread of HTML attributes

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

// Option type for the Select component
interface SelectOption {
  value: string;
  label: string;
}

// Base input — labeled text field with optional icon
export function Input({
  label,
  name,
  type = 'text',
  borderColor = '#D4834D',
  required = false,
  icon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; borderColor?: string; icon?: IconDefinition }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#F5F1ED' }}>
          {icon && <FontAwesomeIcon icon={icon} />}
          {label}
          {required && <span style={{ color: '#E84E0F' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        className="w-full px-4 py-3 rounded-xl font-medium border-2 focus:outline-none focus:ring-2 transition-all"
        style={{
          backgroundColor: '#3D3530',
          borderColor: borderColor,
          color: '#F5F1ED',
        }}
        required={required}
        {...props}
      />
    </div>
  );
}

// Multi-line textarea with same label pattern as Input
export function Textarea({
  label,
  name,
  borderColor = '#D4834D',
  required = false,
  rows = 4,
  icon,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; borderColor?: string; icon?: IconDefinition }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#F5F1ED' }}>
          {icon && <FontAwesomeIcon icon={icon} />}
          {label}
          {required && <span style={{ color: '#E84E0F' }}> *</span>}
        </label>
      )}
      <textarea
        name={name}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl font-medium border-2 focus:outline-none focus:ring-2 transition-all resize-none"
        style={{
          backgroundColor: '#3D3530',
          borderColor: borderColor,
          color: '#F5F1ED',
        }}
        required={required}
        {...props}
      />
    </div>
  );
}

// Dropdown select with typed options array
export function Select({
  label,
  name,
  options,
  borderColor = '#D4834D',
  required = false,
  icon,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: SelectOption[]; borderColor?: string; icon?: IconDefinition }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#F5F1ED' }}>
          {icon && <FontAwesomeIcon icon={icon} />}
          {label}
          {required && <span style={{ color: '#E84E0F' }}> *</span>}
        </label>
      )}
      <select
        name={name}
        className="w-full px-4 py-3 rounded-xl font-medium border-2 focus:outline-none focus:ring-2 transition-all"
        style={{
          backgroundColor: '#3D3530',
          borderColor: borderColor,
          color: '#F5F1ED',
        }}
        required={required}
        {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
