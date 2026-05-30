import { useEffect, useRef, useState } from 'react'
import { Home, Copy, Clipboard, RefreshCw, Globe, Share2, MousePointer2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GlazeContextMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)

  useEffect(() => {
    function onContext(e) {
      if (e.ctrlKey) return // allow native browser menu with ctrl+right
      e.preventDefault()
      setPos({ x: e.clientX, y: e.clientY })
      setOpen(true)
    }

    function onAny() {
      setOpen(false)
    }

    window.addEventListener('contextmenu', onContext)
    window.addEventListener('pointerdown', onAny)
    window.addEventListener('scroll', onAny, true)
    window.addEventListener('blur', onAny)

    return () => {
      window.removeEventListener('contextmenu', onContext)
      window.removeEventListener('pointerdown', onAny)
      window.removeEventListener('scroll', onAny, true)
      window.removeEventListener('blur', onAny)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const el = menuRef.current
    if (!el) return
    const { innerWidth, innerHeight } = window
    const rect = el.getBoundingClientRect()
    let nx = pos.x
    let ny = pos.y
    if (pos.x + rect.width > innerWidth) nx = innerWidth - rect.width - 8
    if (pos.y + rect.height > innerHeight) ny = innerHeight - rect.height - 8
    if (nx !== pos.x || ny !== pos.y) setPos({ x: nx, y: ny })
  }, [open, pos.x, pos.y])

  const handleCopy = async () => {
    try {
      const text = window.getSelection().toString() || document.title || window.location.href
      await navigator.clipboard.writeText(text)
    } catch (e) {}
    setOpen(false)
  }

  const handlePaste = async () => {
    try {
      const txt = await navigator.clipboard.readText()
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        active.value = active.value + txt
      }
    } catch (e) {}
    setOpen(false)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handlePortfolio = () => {
    window.open('https://www.zabdiel.tech', '_blank')
    setOpen(false)
  }

  const handleDashboard = () => {
    router.push('/dashboard')
    setOpen(false)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch (e) {}
    setOpen(false)
  }

  const handleToggleCursor = () => {
    window.dispatchEvent(new CustomEvent('glaze-toggle-cursor'))
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      ref={menuRef}
      style={{ left: pos.x, top: pos.y }}
      className="fixed rounded-lg p-2 w-56 bg-glaze-surface border border-glaze-border shadow-glass z-[100]"
    >
      <ul className="flex flex-col gap-1">
        <li className="flex items-center gap-3 px-3 py-2 hover:bg-glaze-highlight rounded cursor-pointer" onClick={handleCopy}>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </li>
        <li className="flex items-center gap-3 px-3 py-2 hover:bg-glaze-highlight rounded cursor-pointer" onClick={handlePaste}>
          <Clipboard className="w-4 h-4" />
          <span>Paste</span>
        </li>
        <li className="flex items-center gap-3 px-3 py-2 hover:bg-glaze-highlight rounded cursor-pointer" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </li>
        <li className="border-t border-glaze-border my-1" />
        <li className="flex items-center gap-3 px-3 py-2 hover:bg-glaze-highlight rounded cursor-pointer" onClick={handlePortfolio}>
          <Globe className="w-4 h-4" />
          <span>Portfolio</span>
        </li>
        <li className="flex items-center gap-3 px-3 py-2 hover:bg-glaze-highlight rounded cursor-pointer" onClick={handleDashboard}>
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </li>
        <li className="flex items-center gap-3 px-3 py-2 hover:bg-glaze-highlight rounded cursor-pointer" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          <span>Share Page</span>
        </li>
        <li className="flex items-center gap-3 px-3 py-2 hover:bg-glaze-highlight rounded cursor-pointer" onClick={handleToggleCursor}>
          <MousePointer2 className="w-4 h-4" />
          <span>Toggle Cursor</span>
        </li>
      </ul>
    </div>
  )
}
