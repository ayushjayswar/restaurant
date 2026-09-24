import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaXmark } from "react-icons/fa6"
import { FaDownload } from "react-icons/fa"

// public folder mein file ka naam bilkul ForkFlame.apk hona chahiye
const APK_URL = '/ForkFlame.apk'
const APK_DOWNLOAD_NAME = 'ForkFlame.apk'

const InstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false)
    const [error, setError] = useState('')
    const location = useLocation()

    useEffect(() => {
        // Har route change / refresh pe popup 1.5 second baad dikhega
        const timer = setTimeout(() => {
            setShowPrompt(true)
        }, 1500)

        return () => clearTimeout(timer)
    }, [location.pathname])

    const handleInstall = async () => {
        setError('')
        try {
            // Pehle check karo ki asli APK mil rahi hai (HTML nahi)
            const res = await fetch(APK_URL, { method: 'HEAD' })
            const type = res.headers.get('content-type') || ''
            if (!res.ok || type.includes('text/html')) {
                setError('App file abhi available nahi hai. Thodi der baad try karein.')
                return
            }

            // APK download trigger karega
            const link = document.createElement('a')
            link.href = APK_URL
            link.download = APK_DOWNLOAD_NAME
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Sirf abhi ke liye hide hoga, refresh ya route change pe phir dikhega
            setShowPrompt(false)
        } catch (e) {
            setError('Download nahi ho paya. Internet check karke dobara try karein.')
        }
    }

    const handleClose = () => {
        // Sirf abhi ke liye hide hoga, refresh ya route change pe phir dikhega
        setShowPrompt(false)
    }

    if (!showPrompt) return null

    return (
        <div
            className='fixed bottom-0 left-0 right-0 z-[60] border-t border-orange-600 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] animate-slide-up'
            style={{ backgroundColor: '#f97316' }}
        >
            <div className='container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-3'>
                <div className='flex items-center justify-between gap-3'>

                    <div className='flex items-center gap-3 min-w-0'>
                        <div className='w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 shadow-md bg-white'>
                            <img
                                src="/logo2.png"
                                alt="Fork & Flame App"
                                className='w-full h-full object-cover'
                            />
                        </div>

                        <div className='min-w-0'>
                            <p className='font-bold text-white text-sm sm:text-base truncate'>
                                Fork&Flame App
                            </p>
                            <p className='text-xs sm:text-sm text-orange-50 truncate'>
                                {error || 'Faster booking, exclusive offers & more'}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 shrink-0'>
                        <button
                            onClick={handleInstall}
                            className='flex items-center gap-1.5 bg-white text-orange-600 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-semibold hover:bg-orange-50 duration-300 active:scale-95 whitespace-nowrap'
                        >
                            <FaDownload className='text-xs' />
                            Install
                        </button>

                        <button
                            onClick={handleClose}
                            className='text-white/80 hover:text-white p-1.5 duration-300'
                            aria-label="Close"
                        >
                            <FaXmark className='text-lg' />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default InstallPrompt