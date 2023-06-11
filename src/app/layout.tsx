import { Modal } from '@/components/Modal'
import './globals.css'

export const metadata = {
  title: 'Trello 2.0 Clone',
  description: 'Trello draggable clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-new-gray-200'>
        {children}
        <Modal />
      </body>
    </html>
  )
}
