'use client'

import { useState } from 'react'
import { AppModal } from '../ui/ui-layout'
import { IconUpload, IconX, IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'

export function CompanyCreator({ 
  show, 
  onClose 
}: { 
  show: boolean
  onClose: () => void 
}) {
  const [ticker, setTicker] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [telegramLink, setTelegramLink] = useState('')
  const [websiteLink, setWebsiteLink] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const { connected } = useWallet()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }
    
    // TODO: Implement company creation logic
    console.log({ 
      ticker, 
      description, 
      image,
      telegramLink,
      websiteLink,
      twitterLink 
    })
    toast.success('Company created successfully!')
    onClose()
  }

  return (
    <AppModal title="Fund My Company" show={show} hide={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            ticker
          </label>
          <div className="flex items-center">
            <span className="text-xl mr-2">$</span>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter company ticker"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 min-h-[100px]"
            placeholder="Describe your space company"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">
            image or video
          </label>
          <div 
            className="border-2 border-dashed border-gray-800 rounded-lg p-6"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <IconX size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <IconUpload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-400 text-center mb-4">drag and drop an image or video</p>
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-800"
                >
                  select file
                </button>
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          {showMoreOptions ? 'hide' : 'show'} more options 
          {showMoreOptions ? <IconChevronUp className="ml-1" /> : <IconChevronDown className="ml-1" />}
        </button>

        {showMoreOptions && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2">
                Telegram link
              </label>
              <input
                type="url"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="(optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2">
                Website link
              </label>
              <input
                type="url"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="(optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2">
                Twitter or X link
              </label>
              <input
                type="url"
                value={twitterLink}
                onChange={(e) => setTwitterLink(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1b1e] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="(optional)"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg"
          >
            Create Company
          </button>
        </div>
      </form>
    </AppModal>
  )
} 