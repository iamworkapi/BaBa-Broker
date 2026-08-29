import React, { useEffect } from 'react';
import { AdminButton } from './AdminButton';

export function AdminDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  width = 'max-w-md sm:max-w-lg',
  footer,
  confirmLabel = 'Save Changes',
  onConfirm,
  confirmVariant = 'primary',
  confirmLoading = false,
  cancelLabel = 'Cancel',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose && onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
    >
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right Sliding Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div
          className={`w-screen ${width} bg-white shadow-2xl border-l border-slate-200/90 flex flex-col transform transition-transform duration-300 ease-out font-['Inter',sans-serif] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div className="h-10 w-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg border border-orange-200/60 shadow-2xs shrink-0">
                  <i className={icon} />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 leading-tight truncate">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-slate-400 font-normal mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
              title="Close panel"
            >
              <i className="ri-close-line text-base" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {children}
          </div>

          {/* Sticky Bottom Actions Footer */}
          {(footer || onConfirm) && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0">
              {footer ? (
                footer
              ) : (
                <>
                  <AdminButton variant="secondary" onClick={onClose} size="md">
                    {cancelLabel}
                  </AdminButton>
                  {onConfirm && (
                    <AdminButton
                      variant={confirmVariant}
                      onClick={onConfirm}
                      loading={confirmLoading}
                      size="md"
                    >
                      {confirmLabel}
                    </AdminButton>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDrawer;
