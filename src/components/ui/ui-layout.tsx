'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import * as React from 'react'
import {ReactNode} from 'react'
import toast, {Toaster} from 'react-hot-toast'

import {AccountChecker} from '../account/account-ui'
import {ClusterChecker, ClusterUiSelect, ExplorerLink} from '../cluster/cluster-ui'
import {WalletButton} from '../solana/solana-provider'

export function UiLayout({children}: {children: ReactNode}) {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1 items-center">
          <Link className="text-xl font-semibold" href="/">
            Cislunar Exchange
          </Link>
          <div className="ml-8 flex items-center space-x-2">
            <Link
              href="/"
              className={`px-3 py-1 rounded-lg ${pathname === '/' ? 'bg-primary text-primary-content' : 'hover:bg-base-100'}`}
            >
              Swap
            </Link>
            <Link
              href="/market"
              className={`px-3 py-1 rounded-lg ${pathname === '/market' ? 'bg-primary text-primary-content' : 'hover:bg-base-100'}`}
            >
              Market
            </Link>
            <Link
              href="/info"
              className={`px-3 py-1 rounded-lg ${pathname === '/info' ? 'bg-primary text-primary-content' : 'hover:bg-base-100'}`}
            >
              Info
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1 rounded-lg ${pathname === '/about' ? 'bg-primary text-primary-content' : 'hover:bg-base-100'}`}
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ClusterUiSelect />
          <WalletButton />
        </div>
      </div>

      <ClusterChecker>
        <AccountChecker />
        <main className="flex-1">{children}</main>
      </ClusterChecker>
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
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="flex gap-2">
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
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
      </div>,
    )
  }
}
