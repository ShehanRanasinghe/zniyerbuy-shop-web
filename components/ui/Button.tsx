// Button — Reusable button components with consistent dark-theme styling
// Three variants: Primary (orange), Secondary (configurable color), Ghost (dark)
// All buttons support icon + children content and spread additional props

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ButtonHTMLAttributes } from 'react';

// Props shared by all button variants
interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconDefinition;
}

// Primary button — main call-to-action in orange brand color
export function PrimaryButton({ children, onClick, icon, ...props }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg hover:opacity-90 flex items-center gap-2 justify-center"
      style={{ backgroundColor: '#E84E0F' }}
      {...props}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}

// Secondary button — alternate action with configurable color
export function SecondaryButton({ children, onClick, color = '#D4834D', icon, ...props }: ButtonBaseProps & { color?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:opacity-90 flex items-center gap-2 justify-center"
      style={{ backgroundColor: color, color: '#F5F1ED' }}
      {...props}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}

// Ghost button — subtle dark background for cancel/secondary actions
export function GhostButton({ children, onClick, icon, ...props }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:bg-[#4A4035] flex items-center gap-2 justify-center"
      style={{ backgroundColor: '#3D3530', color: '#F5F1ED' }}
      {...props}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}
