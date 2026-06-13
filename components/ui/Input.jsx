import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Input component with consistent styling

export function Input({ label, name, type = 'text', borderColor = '#D4834D', required = false, icon, ...props }) {
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

export function Textarea({ label, name, borderColor = '#D4834D', required = false, rows = 4, icon, ...props }) {
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

export function Select({ label, name, options, borderColor = '#D4834D', required = false, icon, ...props }) {
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
