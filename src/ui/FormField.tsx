import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, error, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-2xs text-error mt-1">{error}</p>
      )}
    </div>
  );
}

const inputBaseClass = 'w-full px-3.5 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-weak transition-colors focus:outline-none focus:border-accent/50';
const inputStyle = {
  background: 'rgba(27, 33, 48, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`${inputBaseClass} ${className}`}
      style={{
        ...inputStyle,
        borderColor: error ? 'rgba(239, 68, 68, 0.5)' : inputStyle.border,
      }}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`${inputBaseClass} resize-none ${className}`}
      style={{
        ...inputStyle,
        minHeight: '72px',
        borderColor: error ? 'rgba(239, 68, 68, 0.5)' : inputStyle.border,
      }}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`${inputBaseClass} ${className}`}
      style={{
        ...inputStyle,
        borderColor: error ? 'rgba(239, 68, 68, 0.5)' : inputStyle.border,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '32px',
      }}
    >
      {children}
    </select>
  );
}
