'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useAffiliate } from '@/lib/affiliate'
import { IconUsers, IconRocket, IconMenu2, IconX } from '@tabler/icons-react'
import { WalletButton } from '../solana/solana-provider'
import { ClusterUiSelect } from '../cluster/cluster-ui'

export function UiLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { affiliate } = useAffiliate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Swap', emoji: '🔄' },
    { href: '/market', label: 'Market', emoji: '📊' },
    { 
      href: '/deals', 
      label: 'Deals',
      emoji: '🚀',
      icon: <IconRocket size={16} />
    },
    { 
      href: '/affiliate', 
      label: 'Affiliate',
      emoji: '👥',
      icon: <IconUsers size={16} />,
      badge: affiliate?.shares && Object.keys(affiliate.shares).length > 0 
        ? Object.values(affiliate.shares).reduce((a, b) => a + b, 0)
        : null
    },
    { href: '/info', label: 'Info', emoji: 'ℹ️' },
    { href: '/about', label: 'About', emoji: '💫' }
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1 items-center">
          <Link className="text-xl font-semibold" href="/">
            🌌 Cislunar Exchange
          </Link>
          
          {/* Desktop Navigation */}
          <div className="ml-8 hidden md:flex items-center space-x-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-lg flex items-center gap-2 ${
                  pathname === link.href ? 'bg-primary text-primary-content' : 'hover:bg-base-100'
                }`}
              >
                <span className="text-lg">{link.emoji}</span>
                {link.label}
                {link.badge && (
                  <span className="badge badge-sm badge-secondary">{link.badge}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Wallet */}
          <div className="hidden md:flex items-center ml-auto gap-2">
            <ClusterUiSelect />
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="ml-auto md:hidden btn btn-ghost btn-circle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-base-200 p-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-2 ${
                pathname === link.href ? 'bg-primary text-primary-content' : 'hover:bg-base-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-lg">{link.emoji}</span>
              {link.label}
              {link.badge && (
                <span className="badge badge-sm badge-secondary ml-auto">{link.badge}</span>
              )}
            </Link>
          ))}
          
          <div className="border-t border-base-300 my-4" />
          
          <div className="space-y-4 px-4">
            <ClusterUiSelect />
            <WalletButton />
          </div>
        </div>
      </div>

      {children}
      <Toaster position="bottom-right" />
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="space-x-2">
            <button className="btn btn-ghost" onClick={hide}>
              Close
            </button>
            {submit ? (
              <button className="btn btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  title,
  subtitle,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {title}
          {subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str: string, start = 4, end = 4) {
  if (str.length <= start + end) return str
  return `${str.slice(0, start)}...${str.slice(-end)}`
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <Link href={`https://explorer.solana.com/tx/${signature}`} target="_blank" className="btn btn-xs btn-primary">
          View Transaction
        </Link>
      </div>,
    )
  }
}

