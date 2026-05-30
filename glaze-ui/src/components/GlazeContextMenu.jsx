"use client"
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

    function onPointerDown(event) {
      // only close if the click is outside the menu
      const el = menuRef.current
      if (!el) return
      if (!el.contains(event.target)) {
        setOpen(false)
      }
    }

    function onScroll() {
      // close on any scroll (to avoid menu floating over page)
      setOpen(false)
    }

    function onBlur() {
      setOpen(false)
    }

    window.addEventListener('contextmenu', onContext)
    window.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('contextmenu', onContext)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('blur', onBlur)
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
      className="fixed pointer-events-auto overflow-hidden rounded-2xl border border-glaze-border bg-[#0a0a0f]/95 p-2 shadow-glass backdrop-blur-2xl ring-1 ring-white/10 z-[1000]"
    >
      <ul className="flex flex-col gap-1">
        <li className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-glaze-text transition-colors hover:bg-white/8 cursor-pointer pointer-events-auto" onClick={handleCopy}>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </li>
        <li className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-glaze-text transition-colors hover:bg-white/8 cursor-pointer pointer-events-auto" onClick={handlePaste}>
          <Clipboard className="w-4 h-4" />
          <span>Paste</span>
        </li>
        <li className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-glaze-text transition-colors hover:bg-white/8 cursor-pointer pointer-events-auto" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </li>
        <li className="my-1 border-t border-white/10" />
        <li className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-glaze-text transition-colors hover:bg-white/8 cursor-pointer pointer-events-auto" onClick={handlePortfolio}>
          <Globe className="w-4 h-4" />
          <span>Portfolio</span>
        </li>
        <li className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-glaze-text transition-colors hover:bg-white/8 cursor-pointer pointer-events-auto" onClick={handleDashboard}>
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </li>
        <li className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-glaze-text transition-colors hover:bg-white/8 cursor-pointer pointer-events-auto" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          <span>Share Page</span>
        </li>
        <li className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-glaze-text transition-colors hover:bg-white/8 cursor-pointer pointer-events-auto" onClick={handleToggleCursor}>
          <MousePointer2 className="w-4 h-4" />
          <span>Toggle Cursor</span>
        </li>
      </ul>
    </div>
  )
}
