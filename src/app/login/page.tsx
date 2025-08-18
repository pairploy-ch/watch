'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle } from 'lucide-react'

const ParticlesBackground = dynamic(() => import('@/components/ui/ParticlesBackground').then(mod => mod.ParticlesBackground), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
});

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.replace('/admin')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <ParticlesBackground />
      <div className="flex items-center justify-center min-h-screen p-4 bg-black">
        {/* Login Container */}
        <div className="w-full max-w-md">
          {/* Main Login Card */}
          <div className="relative">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 rounded-2xl blur-xl"></div>
            
            {/* Login Card */}
            <div className="relative bg-[#141519] rounded-2xl p-8 ">
              
              {/* Header Section */}
              <div className="text-center mb-8">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0  rounded-full blur-md opacity-60"></div>
                    <div className="relative  rounded-full p-4">
                      <Image 
                        src="/logo-bg.png" 
                        alt="Luxe Watch Logo" 
                        width={200} 
                        height={200} 
                        className="relative z-10"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E6C36A] to-[#B8860B] bg-clip-text text-transparent mb-2">
                  CHRONOS-DB
                </h1> */}
                <p className="text-white text-xl font-olds">
                  Admin Portal Access
                </p>
                
                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 mt-4 px-4 py-2 bg-[#232427] rounded-full ">
                  <Shield size={16} className="text-[#B79B76]" />
                  <span className="text-xs text-gray-300">Secure Authentication</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium flex items-center space-x-2 font-olds">
                    {/* <Mail size={16} className="text-gray-400" /> */}
                    <span>EMAIL ADDRESS</span>
                  </Label>
                  <div className="relative">
                    <Input
                    style={{background: 'none'}}
                      id="email"
                      type="email"
                      placeholder="admin@chronos-db.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className={`
                        w-full px-4 py-3   rounded-sm text-white placeholder-[#3E3E41] transition-all duration-200 focus:outline-none focus:ring-0
                      `}
                    />
                    {emailFocused && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-[#E6C36A] rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-medium flex items-center space-x-2">
                    {/* <Lock size={16} className="text-gray-400" /> */}
                    <span>PASSWORD</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                        className={`
                        w-full px-4 py-3   rounded-sm text-white placeholder-[#3E3E41] transition-all duration-200 focus:outline-none focus:ring-0
                      `}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <span>Password must be at least 6 characters long</span>
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="primary-btn w-full rounded-sm"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      {/* <Shield size={18} /> */}
                      <span>LOGIN</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">
                  Protected by enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}