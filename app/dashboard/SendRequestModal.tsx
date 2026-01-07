'use client'

import { useState } from 'react'

interface SendRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    email: string
    relationship: string
    collaborationFrequency: string[]
  }) => void
}

const RELATIONSHIPS = [
  { value: 'manager', label: 'Manager' },
  { value: 'peer', label: 'Peer' },
  { value: 'direct-report', label: 'Direct Report' },
  { value: 'cross-functional', label: 'Cross-functional' },
]

const COLLABORATION_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'rarely', label: 'Rarely' },
]

export default function SendRequestModal({ isOpen, onClose, onSubmit }: SendRequestModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [relationship, setRelationship] = useState('')
  const [collaborationFrequency, setCollaborationFrequency] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleFrequencyChange = (value: string) => {
    setCollaborationFrequency((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!relationship) {
      newErrors.relationship = 'Please select a relationship'
    }

    if (collaborationFrequency.length === 0) {
      newErrors.collaborationFrequency = 'Please select at least one option'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      relationship,
      collaborationFrequency,
    })

    // Reset form
    setName('')
    setEmail('')
    setRelationship('')
    setCollaborationFrequency([])
    setErrors({})
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setRelationship('')
    setCollaborationFrequency([])
    setErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#ffffff] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-main">Send Feedback Request</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="request-name" className="block text-sm font-medium text-[#000000] mb-2">
              Name
            </label>
            <input
              type="text"
              id="request-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter colleague's name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="request-email" className="block text-sm font-medium text-[#000000] mb-2">
              Email
            </label>
            <input
              type="email"
              id="request-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="colleague@lendable.co.uk"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Relationship */}
          <div className="mb-4">
            <label htmlFor="relationship" className="block text-sm font-medium text-[#000000] mb-2">
              Relationship
            </label>
            <select
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] bg-[#ffffff] ${
                errors.relationship ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select relationship</option>
              {RELATIONSHIPS.map((rel) => (
                <option key={rel.value} value={rel.value}>
                  {rel.label}
                </option>
              ))}
            </select>
            {errors.relationship && <p className="mt-1 text-sm text-red-500">{errors.relationship}</p>}
          </div>

          {/* Collaboration Frequency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#000000] mb-3">
              Collaboration Frequency
            </label>
            <div className="space-y-2">
              {COLLABORATION_FREQUENCIES.map((freq) => (
                <label
                  key={freq.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={collaborationFrequency.includes(freq.value)}
                    onChange={() => handleFrequencyChange(freq.value)}
                    className="w-5 h-5 rounded border-gray-300 text-main focus:ring-main cursor-pointer"
                  />
                  <span className="text-[#000000]">{freq.label}</span>
                </label>
              ))}
            </div>
            {errors.collaborationFrequency && (
              <p className="mt-2 text-sm text-red-500">{errors.collaborationFrequency}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-main text-[#ffffff] rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
