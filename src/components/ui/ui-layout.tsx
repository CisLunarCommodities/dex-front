'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { IconRocket, IconMenu2, IconX, IconBulb } from '@tabler/icons-react'
import { WalletButton } from '../solana/solana-provider'
import { IncubateForm } from '../incubate/incubate-form'
import toast from 'react-hot-toast'

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [showIncubateForm, setShowIncubateForm] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'About', href: '/about', icon: 'ℹ️' },
  ]

  return (
    <header className="bg-base-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/cce.png" 
                alt="CCE Logo" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
              <span className="text-xl font-bold">CisLunar Commodities Exchange</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium hover:text-primary flex items-center gap-2 ${
                    pathname === item.href ? 'text-primary' : 'text-base-content'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={() => setShowIncubateForm(true)}
                className="text-sm font-medium hover:text-primary flex items-center gap-2"
              >
                <IconBulb size={20} />
                <span>Incubate</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <WalletButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-base-300"
            >
              {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Incubate Form Modal */}
      <IncubateForm show={showIncubateForm} onClose={() => setShowIncubateForm(false)} />
    </header>
  )
}

export function AppHero({ children, title, subtitle }: { children?: ReactNode; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">{title}</h1>
          {subtitle && <p className="py-6">{subtitle}</p>}
          {children}
        </div>
      </div>
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

export function ellipsify(str: string, start = 4, end = 4) {
  if (str.length <= start + end) return str
  return `${str.slice(0, start)}...${str.slice(-end)}`
}

export function useTransactionToast() {
  const { toast } = useToast()
  return (signature: string) => {
    toast.success(
      <div className="text-center">
        <div className="text-lg">Transaction sent</div>
        <Link href={`https://explorer.solana.com/tx/${signature}`} target="_blank" className="btn btn-xs btn-primary">
          View Transaction
        </Link>
      </div>,
    )
  }
}

function useToast(): { toast: any } {
  throw new Error('Function not implemented.')
}

