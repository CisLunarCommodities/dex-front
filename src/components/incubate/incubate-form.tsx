'use client'

import { useState } from 'react'
import { AppModal } from '../ui/ui-layout'
import toast from 'react-hot-toast'

interface IncubateFormProps {
  show: boolean
  onClose: () => void
}

export function IncubateForm({ show, onClose }: IncubateFormProps) {
  const [email, setEmail] = useState('')
  const [projectName, setProjectName] = useState('')
  const [xHandle, setXHandle] = useState('')
  const [website, setWebsite] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct mailto link with form data
    const subject = encodeURIComponent(`Incubation Application: ${projectName}`)
    const body = encodeURIComponent(`
Project Name: ${projectName}
Email: ${email}
X Handle: ${xHandle}
Website: ${website}
    `)
    
    window.location.href = `mailto:spaicexailonmusk@proton.me?subject=${subject}&body=${body}`
    
    toast.success('Redirecting to email client...')
    onClose()
  }

  return (
    <AppModal title="Apply for Incubation" show={show} hide={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="We'll use this to contact you"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Enter your project name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            X Handle
          </label>
          <input
            type="text"
            value={xHandle}
            onChange={(e) => setXHandle(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="@handle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            Website
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="https://"
          />
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary"
        >
          Submit Application
        </button>
      </form>
    </AppModal>
  )
} 