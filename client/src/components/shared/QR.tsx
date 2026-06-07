import React, { useMemo } from 'react'
import useSnapQR from 'snap-qr'
import { useTheme } from 'next-themes'
import { Download } from 'lucide-react'

const QR = ({ url }: { url: string }) => {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'
    const qrColor = isDark ? '#ffffff' : '#000000'

    const options = useMemo(() => ({
        backgroundOptions: {
            color: 'transparent',
        },
        dotsOptions: {
            color: qrColor,
        },
        cornersSquareOptions: {
            color: qrColor,
        },
        cornersDotOptions: {
            color: qrColor,
        }
    }), [qrColor])

    const { SnapQRComponent, onDownloadClick } = useSnapQR(url, options)

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        const tableNumber = url.match(/tableId=([^&]+)/)?.[1] || 'qr'
        onDownloadClick({
            name: `table-${tableNumber}-qr`,
            extension: 'png'
        })
    }

  return (
    <div >
        <div className="">
            <SnapQRComponent className="w-full h-full" />
        </div>
        
        <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-background border border-border shadow-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
            title="Download QR Code"
        >
            <Download className="h-4 w-4" />
        </button>
    </div>
  )
}

export default QR