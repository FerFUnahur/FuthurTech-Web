import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext(null)

const typeConfig = {
  success: { icon: 'bi-check-circle-fill', bgClass: 'bg-success' },
  danger:  { icon: 'bi-x-circle-fill', bgClass: 'bg-danger' },
  warning: { icon: 'bi-exclamation-triangle-fill', bgClass: 'bg-warning text-dark' },
  info:    { icon: 'bi-info-circle-fill', bgClass: 'bg-info' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 2000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map(t => setTimeout(() => removeToast(t.id), t.duration || 2000))
    return () => timers.forEach(clearTimeout)
  }, [toasts, removeToast])

  const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast])
  const error = useCallback((msg, dur) => addToast(msg, 'danger', dur), [addToast])
  const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast])
  const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast])

  const portal = createPortal(
    <div className="toast-overlay">
      {toasts.map(toast => {
        const cfg = typeConfig[toast.type] || typeConfig.info
        return (
          <div
            key={toast.id}
            className={`toast-modal ${cfg.bgClass}`}
            onClick={() => removeToast(toast.id)}
          >
            <i className={`bi ${cfg.icon} me-2 fs-5`}></i>
            <span>{toast.message}</span>
          </div>
        )
      })}
    </div>,
    document.body
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {portal}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}