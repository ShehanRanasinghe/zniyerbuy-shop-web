// Button component with consistent styling

export function PrimaryButton({ children, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg"
      style={{ backgroundColor: '#E84E0F' }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, color = '#D4834D', ...props }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
      style={{ backgroundColor: color, color: '#F5F1ED' }}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
      style={{ backgroundColor: '#3D3530', color: '#F5F1ED' }}
      {...props}
    >
      {children}
    </button>
  );
}
