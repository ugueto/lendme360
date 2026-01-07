# LendMe360

An AI-powered 360 Feedback Tool for Lendable employees and managers.

# Video Intro

[insert video here]

## Features

- **Request Feedback** - Send feedback requests to colleagues
- **Provide Feedback** - Respond using the Start/Stop/Continue framework
- **Speech-to-Text** - Dictate feedback using OpenAI Whisper (Beta)
- **Manager Dashboard** - Review direct reports' feedback cycles and add notes
- **Email Restriction** - Only @lendable.com and @lendable.co.uk domains allowed

## TO DO

- **Backend + Auth** - Add Supabase authentication + DB schema
- Remove hardcoded values
- Make AI-Generated Summary Report in the Manager tab editable.

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
git clone https://github.com/your-org/lendme360.git
cd lendme360
npm install
```

### Environment Variables

Create a `.env.local` file (you'll need these ENV vars for some functionality):

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
