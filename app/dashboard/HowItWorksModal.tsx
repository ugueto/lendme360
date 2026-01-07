'use client'

interface HowItWorksModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#ffffff] rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-[#ffffff]">
          <h2 className="text-2xl font-bold text-main">How It Works</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* The Process */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-main rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-main">The Annual Feedback Process</h3>
            </div>
            <div className="bg-tertiary rounded-lg p-5">
              <p className="text-[#000000] leading-relaxed mb-4">
                Every year, each Lendable employee participates in a 360-degree feedback cycle as part of their annual performance review. This process helps everyone grow by gathering diverse perspectives from the people they work with.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-[#ffffff] rounded-lg p-4 border-l-4 border-main">
                  <div className="font-semibold text-main mb-1">Step 1</div>
                  <p className="text-sm text-gray-700">Request feedback from 3-6 colleagues (peers, managers, direct reports, or cross-functional partners)</p>
                </div>
                <div className="flex-1 bg-[#ffffff] rounded-lg p-4 border-l-4 border-secondary">
                  <div className="font-semibold text-main mb-1">Step 2</div>
                  <p className="text-sm text-gray-700">Colleagues submit their feedback through the Start/Stop/Continue framework</p>
                </div>
                <div className="flex-1 bg-[#ffffff] rounded-lg p-4 border-l-4 border-main">
                  <div className="font-semibold text-main mb-1">Step 3</div>
                  <p className="text-sm text-gray-700">Managers review and approve feedback, then discuss during your annual review</p>
                </div>
              </div>
            </div>
          </section>

          {/* For Users */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-main">For Users</h3>
            </div>
            <div className="space-y-4">
              {/* Sent Tab */}
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-main text-[#ffffff] px-3 py-1 rounded-full text-sm font-semibold">Sent</span>
                  <span className="text-gray-500 text-sm">Request feedback from others</span>
                </div>
                <ul className="space-y-2 text-[#000000]">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Click <strong>&quot;New Feedback Request&quot;</strong> to ask a colleague for feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Track the status of each request: <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">Pending</span> <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">Submitted</span> <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">Completed</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Aim for 3-6 feedback requests from diverse working relationships</span>
                  </li>
                </ul>
              </div>

              {/* Received Tab */}
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-main text-[#ffffff] px-3 py-1 rounded-full text-sm font-semibold">Received</span>
                  <span className="text-gray-500 text-sm">Respond to feedback requests</span>
                </div>
                <ul className="space-y-2 text-[#000000]">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>View feedback requests from colleagues who want your input</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Click <strong>&quot;Provide Feedback&quot;</strong> to share your thoughts using Start/Stop/Continue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Be specific, constructive, and include real examples when possible</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* For Managers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-main rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#ffffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-main">For Managers</h3>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-[#000000] mb-4">
                Managers have access to everything above, plus the <span className="bg-main text-[#ffffff] px-3 py-1 rounded-full text-sm font-semibold">Manage</span> tab to oversee their team&apos;s feedback process.
              </p>
              <div className="bg-tertiary rounded-lg p-4">
                <h4 className="font-semibold text-main mb-3">What you can do:</h4>
                <ul className="space-y-2 text-[#000000]">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-main mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View all submitted feedback for each of your direct reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-main mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Review and approve feedback before the annual performance review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-main mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Close the feedback cycle once discussed in the review meeting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-main mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Track progress across your entire team at a glance</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-secondary/30 rounded-lg p-5">
            <h4 className="font-semibold text-main mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tips for Great Feedback
            </h4>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-[#000000]">
              <li className="flex items-start gap-2">
                <span className="text-main font-bold">1.</span>
                <span>Be specific with examples and situations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-main font-bold">2.</span>
                <span>Focus on behaviours, not personality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-main font-bold">3.</span>
                <span>Balance constructive and positive feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-main font-bold">4.</span>
                <span>Be honest but respectful</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-[#ffffff]">
          <button
            onClick={onClose}
            className="w-full bg-main text-[#ffffff] py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
