import { Toaster } from 'sonner'

export function NotificationSystem() {
  return (
    <Toaster 
      position="top-right"
      expand={true}
      richColors
      closeButton
      theme="light"
      className="dark:bg-gray-800"
    />
  )
}

