/**
 * Modal - Full screen overlay for settings, pause menu, etc.
 */

import { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Content */}
      <div className="relative bg-panel-bg border border-panel-border max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-panel-border">
            <h2 className="font-[var(--font-display)] text-cyan-primary uppercase tracking-wider text-sm">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-cyan-primary/60 hover:text-cyan-primary cursor-pointer"
            >
              X
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
