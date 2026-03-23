/**
 * Panel - Dark translucent panel with cyan border.
 * Used for weapon stash, inventory, settings, and info displays.
 */

import { type ReactNode, type HTMLAttributes } from 'react';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  header?: string;
  onClose?: () => void;
}

export function Panel({ children, header, onClose, className = '', ...props }: PanelProps) {
  return (
    <div
      className={`
        bg-panel-bg border border-panel-border backdrop-blur-sm
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-panel-border">
          <span className="text-xs font-[var(--font-display)] uppercase tracking-wider text-cyan-primary">
            {header}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-cyan-primary/60 hover:text-cyan-primary text-sm cursor-pointer"
            >
              X
            </button>
          )}
        </div>
      )}
      <div className="p-2">
        {children}
      </div>
    </div>
  );
}
