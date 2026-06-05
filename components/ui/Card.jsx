// Card component with consistent styling

export function Card({ children, border = '#3D3530', ...props }) {
  return (
    <div
      className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
      style={{ backgroundColor: '#2D2620', border: `1px solid ${border}` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, ...props }) {
  return (
    <div className="mb-6" {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, ...props }) {
  return (
    <h3 className="text-xl font-bold" style={{ color: '#F5F1ED' }} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, ...props }) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, ...props }) {
  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid #3D3530' }} {...props}>
      {children}
    </div>
  );
}
