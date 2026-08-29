import React, { useEffect } from 'react';
import { AdminButton } from './AdminButton';

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'max-w-md',
  footer,
  confirmLabel,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col z-10 animate-scaleUp`}
      >
        {/* Header */}
        {(title || icon) && (
          <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg border border-orange-200/60 shadow-2xs shrink-0">
                  <i className={icon} />
                </div>
              )}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-slate-400 font-normal mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            >
              <i className="ri-close-line text-base" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(100vh-14rem)] space-y-4">
          {children}
        </div>

        {/* Footer */}
        {(footer || onConfirm) && (
          <div className="flex items-center justify-end gap-2.5 p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60">
            {footer ? (
              footer
            ) : (
              <>
                <AdminButton variant="secondary" onClick={onClose} size="sm">
                  {cancelLabel}
                </AdminButton>
                {onConfirm && (
                  <AdminButton
                    variant={confirmVariant}
                    onClick={onConfirm}
                    loading={confirmLoading}
                    size="sm"
                  >
                    {confirmLabel || 'Confirm'}
                  </AdminButton>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminModal;
