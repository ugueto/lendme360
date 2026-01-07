'use client'

import { useState, useRef, useCallback } from 'react'

interface UseSpeechToTextReturn {
  isRecording: boolean
  isTranscribing: boolean
  error: string | null
  startRecording: () => Promise<void>
  stopRecording: () => Promise<string | null>
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Could not access microphone. Please check your permissions.')
    }
  }, [])

  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        setIsRecording(false)
        resolve(null)
        return
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false)
        setIsTranscribing(true)

        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

          // Stop all tracks
          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop())

          // Send to API for transcription
          const formData = new FormData()
          formData.append('audio', audioBlob, 'recording.webm')

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Transcription failed')
          }

          const data = await response.json()
          setIsTranscribing(false)
          resolve(data.text)
        } catch (err) {
          console.error('Error transcribing:', err)
          setError(err instanceof Error ? err.message : 'Failed to transcribe audio')
          setIsTranscribing(false)
          resolve(null)
        }
      }

      mediaRecorderRef.current.stop()
    })
  }, [])

  return {
    isRecording,
    isTranscribing,
    error,
    startRecording,
    stopRecording,
  }
}
