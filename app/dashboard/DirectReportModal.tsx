'use client'

import { useState, useEffect, useRef } from 'react'

interface FeedbackSubmission {
  id: string
  submitterName: string
  submitterEmail: string
  relationship: string
  date: string
  response: {
    startDoing: string
    stopDoing: string
    continueDoing: string
    otherComments: string
  }
}

interface DirectReport {
  id: string
  name: string
  email: string
  role: string
  cycleStatus: 'Ongoing' | 'Completed'
  feedbackCount: number
  feedbackSubmissions: FeedbackSubmission[]
  managerNotes?: string
  completedDate?: string
}

interface DirectReportModalProps {
  isOpen: boolean
  onClose: () => void
  directReport: DirectReport | null
  onComplete: (id: string, notes: string) => void
}

export default function DirectReportModal({
  isOpen,
  onClose,
  directReport,
  onComplete,
}: DirectReportModalProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null)
  const [notes, setNotes] = useState('')
  const [showConfirmComplete, setShowConfirmComplete] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<string | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)
  const previousIdRef = useRef<string | null>(null)

  // Reset state only when a different directReport is selected
  useEffect(() => {
    if (directReport?.id && directReport.id !== previousIdRef.current) {
      previousIdRef.current = directReport.id
      setGeneratedReport(null)
      setReportError(null)
      setSelectedSubmission(null)
      setNotes(directReport.managerNotes || '')
    }
  }, [directReport?.id, directReport?.managerNotes])

  if (!isOpen || !directReport) return null

  const isCompleted = directReport.cycleStatus === 'Completed'

  const handleComplete = () => {
    onComplete(directReport.id, notes)
    setShowConfirmComplete(false)
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'manager':
        return 'bg-purple-100 text-purple-800'
      case 'peer':
        return 'bg-blue-100 text-blue-800'
      case 'direct-report':
        return 'bg-green-100 text-green-800'
      case 'cross-functional':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleGenerateReport = async () => {
    if (directReport.feedbackSubmissions.length === 0) {
      setReportError('No feedback submissions available to generate a report.')
      return
    }

    setIsGeneratingReport(true)
    setReportError(null)

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: directReport.name,
          employeeRole: directReport.role,
          feedbackSubmissions: directReport.feedbackSubmissions.map(sub => ({
            submitterName: sub.submitterName,
            relationship: sub.relationship,
            response: sub.response,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const debugInfo = data.debug ? ` (Debug: ${JSON.stringify(data.debug)})` : ''
        throw new Error((data.error || 'Failed to generate report') + debugInfo)
      }

      if (!data.report) {
        throw new Error('No report was generated. Please try again.')
      }

      setGeneratedReport(data.report)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate report. Please try again.'
      console.error('Report generation error:', error)
      setReportError(message)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleExportPDF = () => {
    if (!reportRef.current || !generatedReport) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      setReportError('Please allow popups to export PDF')
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${directReport.name}'s EOY Feedback Report</title>
          <style>
            @page {
              size: A4;
              margin: 1.5cm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 100%;
              padding: 0;
              margin: 0;
              font-size: 11pt;
            }
            h1 {
              color: #00274b;
              font-size: 18pt;
              margin-bottom: 0.5em;
              border-bottom: 2px solid #00274b;
              padding-bottom: 0.3em;
            }
            h2 {
              color: #00274b;
              font-size: 13pt;
              margin-top: 1em;
              margin-bottom: 0.5em;
            }
            p, li {
              margin: 0.4em 0;
              font-size: 10pt;
            }
            ul {
              padding-left: 1.5em;
              margin: 0.5em 0;
            }
            hr {
              border: none;
              border-top: 1px solid #ddd;
              margin: 1em 0;
            }
            em {
              color: #666;
              font-size: 9pt;
            }
            strong {
              color: #00274b;
            }
          </style>
        </head>
        <body>
          ${generatedReport
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^---$/gm, '<hr>')
            .split('\n')
            .map(line => {
              if (line.startsWith('<h') || line.startsWith('<li') || line.startsWith('<hr')) return line
              if (line.trim()) return '<p>' + line + '</p>'
              return ''
            })
            .join('\n')
          }
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  // Simple markdown to HTML renderer
  const renderMarkdown = (markdown: string) => {
    return markdown
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-xl font-bold text-main mb-3 pb-2 border-b-2 border-main">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-lg font-semibold text-main mt-4 mb-2">{line.slice(3)}</h2>
        }
        // Horizontal rule
        if (line === '---') {
          return <hr key={index} className="my-4 border-gray-300" />
        }
        // List items
        if (line.startsWith('- ')) {
          const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
          return <li key={index} className="ml-4 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: content }} />
        }
        // Italic text (for footer)
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          return <p key={index} className="text-xs text-gray-500 italic mt-2">{line.slice(1, -1)}</p>
        }
        // Regular paragraph with bold/italic support
        if (line.trim()) {
          const content = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
          return <p key={index} className="text-sm text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: content }} />
        }
        return null
      })
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#ffffff] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-tertiary/50">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center">
                <span className="text-[#ffffff] font-bold text-lg">
                  {directReport.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-main">{directReport.name}</h2>
                <p className="text-sm text-gray-600">{directReport.role}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isCompleted
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {directReport.cycleStatus}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-tertiary rounded-lg p-4">
              <div className="text-3xl font-bold text-main">{directReport.feedbackCount}</div>
              <div className="text-sm text-gray-600">Feedback Requests Received</div>
            </div>
            <div className="bg-tertiary rounded-lg p-4">
              <div className="text-3xl font-bold text-main">{directReport.feedbackSubmissions.length}</div>
              <div className="text-sm text-gray-600">Submissions Completed</div>
            </div>
          </div>

          {/* Feedback Submissions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-main mb-4">Feedback Submissions</h3>
            {directReport.feedbackSubmissions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No feedback submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {directReport.feedbackSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSubmission?.id === submission.id
                        ? 'border-main bg-tertiary/50'
                        : 'border-gray-200 hover:border-secondary hover:bg-gray-50'
                    }`}
                    onClick={() =>
                      setSelectedSubmission(
                        selectedSubmission?.id === submission.id ? null : submission
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <span className="text-main font-semibold">
                            {submission.submitterName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-[#000000]">{submission.submitterName}</div>
                          <div className="text-sm text-gray-500">{submission.submitterEmail}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(
                            submission.relationship
                          )}`}
                        >
                          {submission.relationship}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(submission.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            selectedSubmission?.id === submission.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Feedback Content */}
                    {selectedSubmission?.id === submission.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-main mb-1">Start Doing</h4>
                          <p className="text-sm text-gray-700 bg-[#ffffff] p-3 rounded border border-gray-100">
                            {submission.response.startDoing}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-main mb-1">Stop Doing</h4>
                          <p className="text-sm text-gray-700 bg-[#ffffff] p-3 rounded border border-gray-100">
                            {submission.response.stopDoing}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-main mb-1">Continue Doing</h4>
                          <p className="text-sm text-gray-700 bg-[#ffffff] p-3 rounded border border-gray-100">
                            {submission.response.continueDoing}
                          </p>
                        </div>
                        {submission.response.otherComments && (
                          <div>
                            <h4 className="text-sm font-semibold text-main mb-1">Other Comments</h4>
                            <p className="text-sm text-gray-700 bg-[#ffffff] p-3 rounded border border-gray-100">
                              {submission.response.otherComments}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI-Generated Report */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold text-main">AI-Generated Feedback Report</h3>
              </div>
              {!generatedReport && (
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport || directReport.feedbackSubmissions.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-[#ffffff] rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {isGeneratingReport ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Generate AI Report
                    </>
                  )}
                </button>
              )}
            </div>

            {reportError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-600">{reportError}</p>
              </div>
            )}

            {!generatedReport && !isGeneratingReport && (
              <div className="p-6 bg-gradient-to-r from-tertiary to-secondary/30 rounded-lg border border-secondary text-center">
                <svg className="w-12 h-12 text-main mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-sm">
                  {directReport.feedbackSubmissions.length === 0
                    ? 'No feedback submissions available to generate a report.'
                    : 'Click "Generate AI Report" to create a comprehensive feedback summary for this employee.'}
                </p>
              </div>
            )}

            {isGeneratingReport && (
              <div className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 text-center">
                <div className="w-12 h-12 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-purple-700 font-medium">Generating comprehensive feedback report...</p>
                <p className="text-purple-600 text-sm mt-1">Analyzing {directReport.feedbackSubmissions.length} feedback submissions</p>
              </div>
            )}

            {generatedReport && (
              <div className="space-y-4">
                <div
                  ref={reportRef}
                  className="p-6 bg-[#ffffff] rounded-lg border border-gray-200 shadow-sm max-h-[400px] overflow-y-auto"
                >
                  {renderMarkdown(generatedReport)}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleExportPDF}
                    className="flex-1 px-4 py-2 bg-main text-[#ffffff] rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to PDF
                  </button>
                  <button
                    onClick={() => setGeneratedReport(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Manager Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-main mb-3">Manager Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isCompleted}
              rows={4}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent text-[#000000] resize-none ${
                isCompleted ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
              placeholder={isCompleted ? '' : 'Add your notes about this feedback cycle...'}
            />
            {isCompleted && directReport.completedDate && (
              <p className="mt-2 text-sm text-gray-500">
                Completed on {new Date(directReport.completedDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          {showConfirmComplete ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Are you sure? This will mark the feedback cycle as complete and prevent further submissions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmComplete(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-green-600 text-[#ffffff] rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Confirm Complete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {!isCompleted && (
                <button
                  onClick={() => setShowConfirmComplete(true)}
                  className="px-6 py-2 bg-green-600 text-[#ffffff] rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Feedback Cycle
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
