import React, { useEffect, useState } from 'react'

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [showBanner, setShowBanner] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        // Agar app pehle se installed hai (standalone mode mein khula hai), toh banner mat dikhao
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.navigator.standalone === true

        if (isStandalone) return

        const ua = window.navigator.userAgent
        const iOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
        setIsIOS(iOSDevice)

        if (iOSDevice) {
            // iOS Safari 'beforeinstallprompt' support nahi karta,
            // isliye hum manually instructions dikhate hain har refresh pe
            setShowBanner(true)
            return
        }

        // Android/Desktop Chrome ke liye: browser ka install event capture karo
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowBanner(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        // Agar app already install ho chuka hai, event fire hoga aur banner hata denge
        const handleAppInstalled = () => {
            setShowBanner(false)
            setDeferredPrompt(null)
        }
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            await deferredPrompt.userChoice
            setDeferredPrompt(null)
        }
        setShowBanner(false)
    }

    if (!showBanner) return null

    return (
        <div className='fixed bottom-0 left-0 right-0 z-[9999] bg-[#C1440E] text-white px-4 py-3 flex items-center justify-between gap-3 shadow-lg'>
            <div className='flex-1 text-sm'>
                {isIOS ? (
                    <p>
                        📱 Install this app: tap <strong>Share</strong> button, then{' '}
                        <strong>"Add to Home Screen"</strong>
                    </p>
                ) : (
                    <p>📱 Install our app for a faster, app-like experience!</p>
                )}
            </div>

            <div className='flex items-center gap-2'>
                {!isIOS && (
                    <button
                        onClick={handleInstallClick}
                        className='bg-white text-[#C1440E] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors'
                    >
                        Install
                    </button>
                )}
                <button
                    onClick={() => setShowBanner(false)}
                    className='text-white text-xl px-2 hover:opacity-70'
                    aria-label='Close'
                >
                    ×
                </button>
            </div>
        </div>
    )
}

export default InstallPrompt
