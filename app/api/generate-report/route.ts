import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface FeedbackSubmission {
  submitterName: string
  relationship: string
  response: {
    startDoing: string
    stopDoing: string
    continueDoing: string
    otherComments: string
  }
}

interface ReportRequest {
  employeeName: string
  employeeRole: string
  feedbackSubmissions: FeedbackSubmission[]
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { employeeName, employeeRole, feedbackSubmissions } = await request.json() as ReportRequest

    if (!employeeName || !feedbackSubmissions || feedbackSubmissions.length === 0) {
      return NextResponse.json(
        { error: 'Employee name and feedback submissions are required' },
        { status: 400 }
      )
    }

    // Format all feedback for the prompt
    const feedbackSummary = feedbackSubmissions.map((fb, index) => {
      return `
Feedback ${index + 1} from ${fb.submitterName} (${fb.relationship}):
- Start Doing: ${fb.response.startDoing}
- Stop Doing: ${fb.response.stopDoing}
- Continue Doing: ${fb.response.continueDoing}
${fb.response.otherComments ? `- Other Comments: ${fb.response.otherComments}` : ''}`
    }).join('\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content: `You are an expert HR consultant who synthesizes 360-degree feedback into actionable reports.
Your reports are concise, professional, and constructive.
You identify patterns across multiple feedback sources and provide clear, actionable insights.
Keep the report to ONE PAGE maximum - be concise but comprehensive.
Use Markdown formatting.`,
        },
        {
          role: 'user',
          content: `Generate a comprehensive End-of-Year Feedback Report for ${employeeName} (${employeeRole}) based on the following feedback from ${feedbackSubmissions.length} colleagues.

${feedbackSummary}

Create a report with the following structure in Markdown format:

# ${employeeName}'s EOY Feedback Report

## Overview
A brief 2-3 sentence summary of the overall feedback themes.

## Start Doing
Synthesize all "Start Doing" feedback into 3-4 key actionable points. Combine similar feedback, note if multiple people mentioned the same thing.

## Stop Doing
Synthesize all "Stop Doing" feedback into 2-3 key points. Be constructive and specific.

## Continue Doing
Synthesize all "Continue Doing" feedback into 3-4 key strengths. Highlight what colleagues appreciate most.

## Key Insights & Recommendations
Provide 3-4 actionable recommendations based on the patterns in the feedback. Be specific and constructive.

---
*Report generated from ${feedbackSubmissions.length} colleague submissions.*

Remember: Keep it concise - this report should fit on ONE page when printed.`,
        },
      ],
      max_completion_tokens: 16000,
      temperature: 1,
    })

    // Log the full response for debugging
    console.log('OpenAI completion response:', JSON.stringify(completion, null, 2))

    const choice = completion.choices[0]
    const message = choice?.message

    // Check for refusal
    if (message?.refusal) {
      return NextResponse.json(
        { error: `Model refused to generate report: ${message.refusal}` },
        { status: 400 }
      )
    }

    // Handle different content formats
    let report: string | null = null
    const content = message?.content

    // Standard string content
    if (typeof content === 'string') {
      report = content.trim()
    }
    // Array of content blocks (some models return this format)
    else if (Array.isArray(content)) {
      const contentArray = content as Array<{ type: string; text?: string }>
      report = contentArray
        .filter((block) => block.type === 'text')
        .map((block) => block.text || '')
        .join('\n')
        .trim()
    }

    // Log what we extracted
    console.log('Extracted report:', report)
    console.log('Message object:', JSON.stringify(message, null, 2))
    console.log('Choice finish_reason:', choice?.finish_reason)

    if (!report) {
      return NextResponse.json(
        {
          error: 'The model returned an empty response. Please try again.',
          debug: {
            finish_reason: choice?.finish_reason,
            message_keys: message ? Object.keys(message) : [],
            content_type: typeof message?.content,
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
