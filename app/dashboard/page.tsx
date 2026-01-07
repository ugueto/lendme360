'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import SendRequestModal from './SendRequestModal'
import FeedbackResponseModal from './FeedbackResponseModal'
import HowItWorksModal from './HowItWorksModal'
import DirectReportModal from './DirectReportModal'

type FeedbackTab = 'sent' | 'received' | 'manage'
type RequestStatus = 'Pending' | 'Submitted' | 'Completed'

interface FeedbackRequest {
  id: string
  name: string
  date: string
  status: RequestStatus
}

interface FeedbackResponse {
  startDoing: string
  stopDoing: string
  continueDoing: string
  otherComments: string
}

interface ReceivedRequest extends FeedbackRequest {
  response?: FeedbackResponse
}

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

// Mock data for demonstration
const mockSentRequests: FeedbackRequest[] = [
  { id: '1', name: 'Sarah Johnson', date: '2024-01-15', status: 'Completed' },
  { id: '2', name: 'Michael Chen', date: '2024-01-18', status: 'Submitted' },
  { id: '3', name: 'Emma Williams', date: '2024-01-20', status: 'Pending' },
  { id: '4', name: 'James Brown', date: '2024-01-22', status: 'Pending' },
]

const mockReceivedRequests: ReceivedRequest[] = [
  { id: '1', name: 'Alex Thompson', date: '2024-01-14', status: 'Pending' },
  { id: '2', name: 'Lisa Garcia', date: '2024-01-16', status: 'Pending' },
  {
    id: '3',
    name: 'David Kim',
    date: '2024-01-10',
    status: 'Submitted',
    response: {
      startDoing: 'Consider documenting decisions more thoroughly for future reference.',
      stopDoing: 'Avoid scheduling meetings during focus time blocks.',
      continueDoing: 'Great job facilitating team discussions and ensuring everyone has a voice.',
      otherComments: 'Overall a pleasure to work with!',
    }
  },
  { id: '4', name: 'Rachel Martinez', date: '2024-01-19', status: 'Pending' },
]

const mockDirectReports: DirectReport[] = [
  {
    id: '1',
    name: 'Emily Watson',
    email: 'emily.watson@lendable.com',
    role: 'Software Engineer',
    cycleStatus: 'Ongoing',
    feedbackCount: 5,
    feedbackSubmissions: [
      {
        id: 'fs-1',
        submitterName: 'John Smith',
        submitterEmail: 'john.smith@lendable.com',
        relationship: 'Peer',
        date: '2024-01-20',
        response: {
          startDoing: 'Could benefit from sharing knowledge more proactively with the team through tech talks or documentation.',
          stopDoing: 'Sometimes takes on too much work without delegating - it\'s okay to ask for help!',
          continueDoing: 'Excellent code quality and attention to detail. Always delivers on time.',
          otherComments: 'Emily is a fantastic team member and I enjoy collaborating with her.',
        },
      },
      {
        id: 'fs-2',
        submitterName: 'Sarah Chen',
        submitterEmail: 'sarah.chen@lendable.com',
        relationship: 'Cross-functional',
        date: '2024-01-22',
        response: {
          startDoing: 'Would love to see more involvement in product planning discussions.',
          stopDoing: 'No major concerns.',
          continueDoing: 'Great at explaining technical concepts to non-technical stakeholders.',
          otherComments: '',
        },
      },
      {
        id: 'fs-3',
        submitterName: 'Marcus Johnson',
        submitterEmail: 'marcus.johnson@lendable.com',
        relationship: 'Direct-report',
        date: '2024-01-23',
        response: {
          startDoing: 'More regular 1:1 check-ins would be appreciated.',
          stopDoing: 'Sometimes the feedback can be too direct - a softer approach might help.',
          continueDoing: 'Very supportive and always available when I have questions. Great mentor!',
          otherComments: 'I\'ve learned so much working under Emily.',
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Thomas Brown',
    email: 'thomas.brown@lendable.com',
    role: 'Senior Product Manager',
    cycleStatus: 'Ongoing',
    feedbackCount: 4,
    feedbackSubmissions: [
      {
        id: 'fs-4',
        submitterName: 'Alice Roberts',
        submitterEmail: 'alice.roberts@lendable.com',
        relationship: 'Peer',
        date: '2024-01-18',
        response: {
          startDoing: 'Consider involving engineering earlier in the product discovery phase.',
          stopDoing: 'Sometimes changes priorities mid-sprint which can be disruptive.',
          continueDoing: 'Excellent stakeholder management and clear communication of product vision.',
          otherComments: 'Tom is great to work with overall.',
        },
      },
    ],
  },
  {
    id: '3',
    name: 'Jessica Lee',
    email: 'jessica.lee@lendable.co.uk',
    role: 'Data Analyst',
    cycleStatus: 'Completed',
    feedbackCount: 3,
    feedbackSubmissions: [
      {
        id: 'fs-5',
        submitterName: 'Daniel Park',
        submitterEmail: 'daniel.park@lendable.com',
        relationship: 'Manager',
        date: '2024-01-10',
        response: {
          startDoing: 'Could take more ownership of presenting insights to senior leadership.',
          stopDoing: 'Nothing specific comes to mind.',
          continueDoing: 'Thorough analysis and always backs up recommendations with data.',
          otherComments: 'Jessica has grown tremendously this quarter.',
        },
      },
      {
        id: 'fs-6',
        submitterName: 'Olivia White',
        submitterEmail: 'olivia.white@lendable.com',
        relationship: 'Peer',
        date: '2024-01-12',
        response: {
          startDoing: 'More documentation on data pipelines would help the team.',
          stopDoing: 'No concerns.',
          continueDoing: 'Always willing to help others understand the data. Great collaborator!',
          otherComments: '',
        },
      },
    ],
    managerNotes: 'Jessica had a strong feedback cycle. Main theme is encouraging her to take more visible leadership roles. Plan to discuss promotion path in next 1:1.',
    completedDate: '2024-01-15',
  },
  {
    id: '4',
    name: 'Ryan Mitchell',
    email: 'ryan.mitchell@lendable.co.uk',
    role: 'UX Designer',
    cycleStatus: 'Ongoing',
    feedbackCount: 6,
    feedbackSubmissions: [],
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FeedbackTab>('sent')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sentRequests, setSentRequests] = useState<FeedbackRequest[]>(mockSentRequests)
  const [receivedRequests, setReceivedRequests] = useState<ReceivedRequest[]>(mockReceivedRequests)
  const [selectedReceivedRequest, setSelectedReceivedRequest] = useState<ReceivedRequest | null>(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)
  const [directReports, setDirectReports] = useState<DirectReport[]>(mockDirectReports)
  const [selectedDirectReport, setSelectedDirectReport] = useState<DirectReport | null>(null)
  const [isDirectReportModalOpen, setIsDirectReportModalOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSendRequest = (data: {
    name: string
    email: string
    relationship: string
    collaborationFrequency: string[]
  }) => {
    const newRequest: FeedbackRequest = {
      id: Date.now().toString(),
      name: data.name,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    }
    setSentRequests([newRequest, ...sentRequests])
    setIsModalOpen(false)
  }

  const handleOpenReceivedRequest = (request: ReceivedRequest) => {
    setSelectedReceivedRequest(request)
    setIsViewMode(request.status === 'Submitted')
    setIsResponseModalOpen(true)
  }

  const handleSubmitFeedbackResponse = (response: FeedbackResponse) => {
    if (!selectedReceivedRequest) return

    setReceivedRequests((prev) =>
      prev.map((req) =>
        req.id === selectedReceivedRequest.id
          ? { ...req, status: 'Submitted' as RequestStatus, response }
          : req
      )
    )
    setIsResponseModalOpen(false)
    setSelectedReceivedRequest(null)
  }

  const getStatusStyles = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Submitted':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOpenDirectReport = (report: DirectReport) => {
    setSelectedDirectReport(report)
    setIsDirectReportModalOpen(true)
  }

  const handleCompleteFeedbackCycle = (id: string, notes: string) => {
    setDirectReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              cycleStatus: 'Completed' as const,
              managerNotes: notes,
              completedDate: new Date().toISOString().split('T')[0],
            }
          : report
      )
    )
    setIsDirectReportModalOpen(false)
    setSelectedDirectReport(null)
  }

  return (
    <div className="min-h-screen bg-tertiary">
      {/* Header */}
      <header className="bg-main shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[#ffffff] hover:opacity-80 transition-opacity">
              LendMe360
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="text-[#ffffff] text-sm font-medium hover:text-secondary transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How It Works
              </button>
              <div className="w-px h-6 bg-secondary/50"></div>
              <span className="text-[#ffffff] text-sm">Welcome, Juan</span>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-main font-semibold text-sm">J</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[#ffffff] text-sm font-medium hover:text-secondary transition-colors flex items-center gap-1 ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#ffffff] rounded-lg shadow-lg">
          {/* Page Title */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-main">Feedback Requests</h1>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'sent'
                    ? 'border-main text-main'
                    : 'border-transparent text-gray-500 hover:text-main hover:border-gray-300'
                }`}
              >
                Sent
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'received'
                    ? 'border-main text-main'
                    : 'border-transparent text-gray-500 hover:text-main hover:border-gray-300'
                }`}
              >
                Received
                {receivedRequests.filter(r => r.status === 'Pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {receivedRequests.filter(r => r.status === 'Pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'manage'
                    ? 'border-main text-main'
                    : 'border-transparent text-gray-500 hover:text-main hover:border-gray-300'
                }`}
              >
                Manage
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Sent Tab */}
            {activeTab === 'sent' && (
              <div>
                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Track the feedback requests you&apos;ve sent to colleagues.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-main text-[#ffffff] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Feedback Request
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-tertiary">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sentRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                                <span className="text-main font-semibold text-sm">
                                  {request.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-[#000000] font-medium">{request.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {new Date(request.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {sentRequests.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                            No feedback requests sent yet. Click &quot;Send Request&quot; to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Received Tab */}
            {activeTab === 'received' && (
              <div>
                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Respond to feedback requests from your colleagues. Click on a pending request to provide your feedback.
                  </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-tertiary">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Requested By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Date Received
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {receivedRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                                <span className="text-main font-semibold text-sm">
                                  {request.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-[#000000] font-medium">{request.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {new Date(request.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenReceivedRequest(request)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                request.status === 'Pending'
                                  ? 'bg-main text-[#ffffff] hover:opacity-90'
                                  : 'bg-tertiary text-main hover:bg-secondary'
                              }`}
                            >
                              {request.status === 'Pending' ? 'Provide Feedback' : 'View Feedback'}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {receivedRequests.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            No feedback requests received yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Manage Tab */}
            {activeTab === 'manage' && (
              <div>
                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Review feedback cycles for your direct reports. Click on a team member to view their feedback and finalize the process.
                  </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-tertiary">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Team Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Feedback Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Cycle Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-main uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {directReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-main rounded-full flex items-center justify-center mr-3">
                                <span className="text-[#ffffff] font-semibold">
                                  {report.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-[#000000] font-medium">{report.name}</div>
                                <div className="text-sm text-gray-500">{report.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {report.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-main h-2 rounded-full"
                                  style={{
                                    width: `${report.feedbackCount > 0 ? (report.feedbackSubmissions.length / report.feedbackCount) * 100 : 0}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">
                                {report.feedbackSubmissions.length}/{report.feedbackCount}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                report.cycleStatus === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {report.cycleStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenDirectReport(report)}
                              className="px-4 py-2 bg-main text-[#ffffff] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {directReports.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            No direct reports found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Send Request Modal */}
      <SendRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendRequest}
      />

      {/* Feedback Response Modal */}
      {selectedReceivedRequest && (
        <FeedbackResponseModal
          isOpen={isResponseModalOpen}
          onClose={() => {
            setIsResponseModalOpen(false)
            setSelectedReceivedRequest(null)
          }}
          onSubmit={handleSubmitFeedbackResponse}
          requesterName={selectedReceivedRequest.name}
          isViewMode={isViewMode}
          existingResponse={selectedReceivedRequest.response}
        />
      )}

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Direct Report Modal */}
      <DirectReportModal
        isOpen={isDirectReportModalOpen}
        onClose={() => {
          setIsDirectReportModalOpen(false)
          setSelectedDirectReport(null)
        }}
        directReport={selectedDirectReport}
        onComplete={handleCompleteFeedbackCycle}
      />
    </div>
  )
}
