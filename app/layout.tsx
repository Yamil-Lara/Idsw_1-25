import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Buscador de vehiculos',
  description: 'proyecto is',
  generator: 'h.u#2',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
