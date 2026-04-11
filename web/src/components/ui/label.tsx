import type { LabelHTMLAttributes, ReactElement } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = '', ...props }: LabelProps): ReactElement {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    />
  );
}
