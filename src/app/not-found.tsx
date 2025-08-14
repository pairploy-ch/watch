import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-9xl font-black gold-text">404</h2>
      <p className="text-2xl md:text-3xl font-bold mt-4">Page Not Found</p>
      <p className="text-gray-400 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Button asChild className="mt-8 gold-bg text-black font-bold">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  )
}