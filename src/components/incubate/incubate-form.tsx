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
    
    // TODO: Implement form submission logic
    console.log({ 
      email,
      projectName,
      xHandle,
      website
    })
    
    toast.success('Application submitted successfully!')
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
            Project X Handle
          </label>
          <div className="flex items-center">
            <span className="text-xl mr-2">@</span>
            <input
              type="text"
              value={xHandle}
              onChange={(e) => setXHandle(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter project's X username"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            Project Website
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Optional: Enter your project website"
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