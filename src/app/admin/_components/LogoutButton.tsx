'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <Button 
      onClick={handleLogout}
      variant="outline" 
      className="w-full bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white">
      Logout
    </Button>
  )
}