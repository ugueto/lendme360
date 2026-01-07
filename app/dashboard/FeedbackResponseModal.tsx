'use client'

import { useState, useEffect } from 'react'
import { useSpeechToText } from '@/hooks/useSpeechToText'

interface FeedbackResponse {
  startDoing: string
  stopDoing: string
  continueDoing: string
  otherComments: string
}

interface FeedbackResponseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FeedbackResponse) => void
  requesterName: string
  isViewMode?: boolean
  existingResponse?: FeedbackResponse | null
}

type FieldName = 'startDoing' | 'stopDoing' | 'continueDoing' | 'otherComments'

export default function FeedbackResponseModal({
  isOpen,
  onClose,
  onSubmit,
  requesterName,
  isViewMode = false,
  existingResponse = null,
}: FeedbackResponseModalProps) {
  const [startDoing, setStartDoing] = useState('')
  const [stopDoing, setStopDoing] = useState('')
  const [continueDoing, setContinueDoing] = useState('')
  const [otherComments, setOtherComments] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeRecordingField, setActiveRecordingField] = useState<FieldName | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhanceError, setEnhanceError] = useState<string | null>(null)

  const { isRecording, isTranscribing, error: speechError, startRecording, stopRecording } = useSpeechToText()

  useEffect(() => {
    if (existingResponse) {
      setStartDoing(existingResponse.startDoing)
      setStopDoing(existingResponse.stopDoing)
      setContinueDoing(existingResponse.continueDoing)
      setOtherComments(existingResponse.otherComments)
    }
  }, [existingResponse])

  if (!isOpen) return null

  const setFieldValue = (field: FieldName, value: string) => {
    switch (field) {
      case 'startDoing':
        setStartDoing((prev) => prev ? `${prev} ${value}` : value)
        break
      case 'stopDoing':
        setStopDoing((prev) => prev ? `${prev} ${value}` : value)
        break
      case 'continueDoing':
        setContinueDoing((prev) => prev ? `${prev} ${value}` : value)
        break
      case 'otherComments':
        setOtherComments((prev) => prev ? `${prev} ${value}` : value)
        break
    }
  }

  const handleMicrophoneClick = async (field: FieldName) => {
    if (isRecording && activeRecordingField === field) {
      // Stop recording and transcribe
      const transcribedText = await stopRecording()
      if (transcribedText) {
        setFieldValue(field, transcribedText)
      }
      setActiveRecordingField(null)
    } else if (!isRecording && !isTranscribing) {
      // Start recording
      setActiveRecordingField(field)
      await startRecording()
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!startDoing.trim()) {
      newErrors.startDoing = 'This field is required'
    }

    if (!stopDoing.trim()) {
      newErrors.stopDoing = 'This field is required'
    }

    if (!continueDoing.trim()) {
      newErrors.continueDoing = 'This field is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
      startDoing: startDoing.trim(),
      stopDoing: stopDoing.trim(),
      continueDoing: continueDoing.trim(),
      otherComments: otherComments.trim(),
    })

    handleClose()
  }

  const handleClose = () => {
    if (!isViewMode) {
      setStartDoing('')
      setStopDoing('')
      setContinueDoing('')
      setOtherComments('')
      setErrors({})
    }
    setActiveRecordingField(null)
    setEnhanceError(null)
    onClose()
  }

  const handleEnhance = async () => {
    if (!startDoing.trim() && !stopDoing.trim() && !continueDoing.trim() && !otherComments.trim()) {
      setEnhanceError('Please add some feedback before enhancing')
      return
    }

    setIsEnhancing(true)
    setEnhanceError(null)

    try {
      const response = await fetch('/api/enhance-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback: {
            startDoing,
            stopDoing,
            continueDoing,
            otherComments,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance feedback')
      }

      const enhanced = await response.json()
      setStartDoing(enhanced.startDoing)
      setStopDoing(enhanced.stopDoing)
      setContinueDoing(enhanced.continueDoing)
      setOtherComments(enhanced.otherComments)
    } catch {
      setEnhanceError('Failed to enhance feedback. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }

  const MicrophoneButton = ({ field }: { field: FieldName }) => {
    const isActive = isRecording && activeRecordingField === field
    const isProcessing = isTranscribing && activeRecordingField === field

    return (
      <button
        type="button"
        onClick={() => handleMicrophoneClick(field)}
        disabled={isViewMode || (isRecording && activeRecordingField !== field) || isTranscribing}
        className={`p-2 rounded-lg transition-all ${
          isActive
            ? 'bg-red-500 text-white animate-pulse'
            : isProcessing
            ? 'bg-yellow-500 text-white'
            : 'bg-tertiary text-main hover:bg-secondary'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isActive ? 'Click to stop recording' : isProcessing ? 'Transcribing...' : 'Click to start recording'}
      >
        {isProcessing ? (
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#ffffff] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-main">
              {isViewMode ? 'View Feedback' : 'Provide Feedback'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isViewMode ? 'Feedback submitted for' : 'Feedback request from'}{' '}
              <span className="font-semibold text-main">{requesterName}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Speech-to-Text Banner */}
        {!isViewMode && (
          <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-tertiary to-secondary/50 rounded-lg border border-secondary">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-main rounded-lg">
                <svg className="w-5 h-5 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-main">Try Speech-to-Text</span>
                  <span className="px-2 py-0.5 bg-main text-[#ffffff] text-xs font-bold rounded-full">BETA</span>
                </div>
                <p className="text-sm text-gray-600">
                  Speed up your feedback process! Click the microphone icon next to any field to dictate your thoughts and click it again to stop recording.
                </p>
              </div>
            </div>
            {speechError && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{speechError}</p>
            )}
          </div>
        )}

        {/* AI Enhancement Banner */}
        {!isViewMode && (
          <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border border-green-300">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="w-5 h-5 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-green-800">Enhance with AI</span>
                </div>
                <p className="text-sm text-green-700">
                  Let AI polish your feedback! Click the <strong>Enhance with AI</strong> button at the bottom of the form to improve your bullet points with concise, useful details.
                </p>
              </div>
            </div>
            {enhanceError && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{enhanceError}</p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Start Doing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="start-doing" className="block text-sm font-semibold text-main">
                Start Doing
              </label>
              {!isViewMode && <MicrophoneButton field="startDoing" />}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              What should this person start doing to be more effective?
            </p>
            <textarea
              id="start-doing"
              value={startDoing}
              onChange={(e) => setStartDoing(e.target.value)}
              disabled={isViewMode}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] resize-none ${
                errors.startDoing ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                activeRecordingField === 'startDoing' ? 'ring-2 ring-red-500 border-red-500' : ''
              }`}
              placeholder={isViewMode ? '' : 'Describe some actions and habits that could help your colleague and why.'}
            />
            {errors.startDoing && <p className="mt-1 text-sm text-red-500">{errors.startDoing}</p>}
          </div>

          {/* Stop Doing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="stop-doing" className="block text-sm font-semibold text-main">
                Stop Doing
              </label>
              {!isViewMode && <MicrophoneButton field="stopDoing" />}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              What should this person stop doing or do less of?
            </p>
            <textarea
              id="stop-doing"
              value={stopDoing}
              onChange={(e) => setStopDoing(e.target.value)}
              disabled={isViewMode}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] resize-none ${
                errors.stopDoing ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                activeRecordingField === 'stopDoing' ? 'ring-2 ring-red-500 border-red-500' : ''
              }`}
              placeholder={isViewMode ? '' : 'Describe what this colleague should refrain from doing or do less, and add examples of when and why these are not helpful.'}
            />
            {errors.stopDoing && <p className="mt-1 text-sm text-red-500">{errors.stopDoing}</p>}
          </div>

          {/* Continue Doing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="continue-doing" className="block text-sm font-semibold text-main">
                Continue Doing
              </label>
              {!isViewMode && <MicrophoneButton field="continueDoing" />}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              What is this person doing well that they should continue?
            </p>
            <textarea
              id="continue-doing"
              value={continueDoing}
              onChange={(e) => setContinueDoing(e.target.value)}
              disabled={isViewMode}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] resize-none ${
                errors.continueDoing ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''} ${
                activeRecordingField === 'continueDoing' ? 'ring-2 ring-red-500 border-red-500' : ''
              }`}
              placeholder={isViewMode ? '' : 'Describe what this colleague is amazing at and why it helps. Mention the big moments where you noticed these things.'}
            />
            {errors.continueDoing && <p className="mt-1 text-sm text-red-500">{errors.continueDoing}</p>}
          </div>

          {/* Other Comments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="other-comments" className="block text-sm font-semibold text-main">
                Any Other Comments
                <span className="font-normal text-gray-500 ml-1">(Optional)</span>
              </label>
              {!isViewMode && <MicrophoneButton field="otherComments" />}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Any additional feedback or comments you&apos;d like to share.
            </p>
            <textarea
              id="other-comments"
              value={otherComments}
              onChange={(e) => setOtherComments(e.target.value)}
              disabled={isViewMode}
              rows={3}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] resize-none ${
                isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''
              } ${
                activeRecordingField === 'otherComments' ? 'ring-2 ring-red-500 border-red-500' : ''
              }`}
              placeholder={isViewMode ? '' : 'Enter any additional comments, everything helps!'}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            {!isViewMode && (
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isRecording || isTranscribing || isEnhancing}
                className="w-full px-4 py-3 bg-green-600 text-[#ffffff] rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEnhancing ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Enhance with AI
                  </>
                )}
              </button>
            )}
            <div className="flex gap-3">
              {isViewMode ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full px-4 py-3 bg-main text-[#ffffff] rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRecording || isTranscribing || isEnhancing}
                    className="flex-1 px-4 py-3 bg-main text-[#ffffff] rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Feedback
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
