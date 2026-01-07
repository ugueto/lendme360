# LendMe360

An AI-powered 360 Feedback Tool for Lendable employees and managers.

# Introduction

Please see a LendMe360 Intro video [here](https://www.loom.com/share/a46d44b3ab7a437c808646712f6b3abc).

# Views and Paths
- Landing Page -> /
- Sign In -> /login
- App -> /dashboard

## Features

- **Request Feedback** - Send feedback requests to colleagues
- **Provide Feedback** - Give feedback using the Start/Stop/Continue framework
- **Speech-to-Text** - Dictate feedback using OpenAI Whisper (Beta)
- **Enhance with AI** - Enhance your feedback bullet points with OpenAI's GPT-5
- **Manager Dashboard** - Review direct reports' feedback cycles and add notes
- **Email Restriction** - Only @lendable.com and @lendable.co.uk domains allowed
- **Feedback Report** - Build an AI-powered report at the end of your feedback process with OpenAI's GPT-5.

## TO DO:

- **Backend + Auth** - Add Supabase authentication + DB schema
- Remove all hardcoded values
- Make AI-Generated Summary Report in the Manager tab editable.
- Edit 'New Feedback Request' form to include the possibility of multiple reviewers in one form.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase
- **Speech-to-Text**: OpenAI Whisper API
- **Font**: Nunito (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/ugueto/lendme360.git
cd lendme360
npm install
```

### Environment Variables

> [IMPORTANT]  
> Without an OpenAI API key, you will not be able to use any AI features.

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── page.tsx              # Landing page
├── login/                # Authentication
├── dashboard/            # Main dashboard
│   ├── page.tsx          # Sent/Received/Manage tabs
│   ├── SendRequestModal.tsx
│   ├── FeedbackResponseModal.tsx
│   ├── DirectReportModal.tsx
│   └── HowItWorksModal.tsx
└── api/
    └── transcribe/       # Whisper API endpoint
```

## License

MIT
