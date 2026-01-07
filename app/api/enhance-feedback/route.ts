import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface FeedbackToEnhance {
  startDoing: string
  stopDoing: string
  continueDoing: string
  otherComments: string
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

    const { feedback } = await request.json() as { feedback: FeedbackToEnhance }

    if (!feedback) {
      return NextResponse.json(
        { error: 'No feedback provided' },
        { status: 400 }
      )
    }

    const enhanceField = async (fieldName: string, content: string): Promise<string> => {
      if (!content.trim()) return content

      const completion = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that improves workplace feedback. Never give long feedback. Keep it concise. Keep the same tone and intent, but make the feedback more constructive, specific, and actionable. Return only the improved text without any preamble or explanation.',
          },
          {
            role: 'user',
            content: `You have been given these bullet points as feedback to give to another colleague "${content}", improve this feedback with concise, useful details and comments. Don't make it too long.`,
          },
        ],
        max_completion_tokens: 1000,
        temperature: 1,
      })

      return completion.choices[0]?.message?.content?.trim() || content
    }

    const [enhancedStartDoing, enhancedStopDoing, enhancedContinueDoing, enhancedOtherComments] = await Promise.all([
      enhanceField('startDoing', feedback.startDoing),
      enhanceField('stopDoing', feedback.stopDoing),
      enhanceField('continueDoing', feedback.continueDoing),
      enhanceField('otherComments', feedback.otherComments),
    ])

    return NextResponse.json({
      startDoing: enhancedStartDoing,
      stopDoing: enhancedStopDoing,
      continueDoing: enhancedContinueDoing,
      otherComments: enhancedOtherComments,
    })
  } catch (error) {
    console.error('Enhancement error:', error)
    return NextResponse.json(
      { error: 'Failed to enhance feedback' },
      { status: 500 }
    )
  }
}
