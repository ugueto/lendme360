# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LendMe360 is an AI-powered 360 Feedback Tool designed for Lendable Employees and Managers. The application enables users to request and provide feedback, while managers can review feedback for their direct reports and finalize the feedback process.

## Technology Stack

- **Framework**: Next.js 16.1+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom color palette
- **Font**: Nunito (Google Fonts via next/font)
- **Authentication**: Supabase
- **Runtime**: Node.js
- **Deployment**: Vercel

## Color Palette

The application uses a consistent color scheme:
- **Main**: `#00274b` - Primary brand color (dark blue)
- **Secondary**: `#b1d9ff` - Light blue for accents
- **Tertiary**: `#d5ebff` - Lighter blue for backgrounds
- **Text**: `#FFFFFF` and `#000000` depending on background

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

```
/app
  /globals.css              - Global styles and Tailwind directives
  /layout.tsx               - Root layout with metadata and Nunito font
  /page.tsx                 - Landing page (home)
  /login/page.tsx           - Authentication page (Sign In / Create Account)
  /dashboard/
    /page.tsx               - Main dashboard with feedback request tabs
    /SendRequestModal.tsx   - Modal form for sending feedback requests
/components
  /Navbar.tsx               - Main navigation bar with sign-in link
/lib
  /supabase.ts              - Supabase client configuration
```

## Architecture

### User Roles
- **User/Reviewer**: Can request and provide feedback
- **Manager**: Can review feedback for direct reports and finalize processes

### Authentication Flow
The login page (`/login`) provides:
- **Sign In form**: Email and password
- **Create Account form**: First name, last name, email, password, role selection
- Tab-based switching between Sign In and Create Account
- Supabase integration ready (requires `.env.local` configuration)

### Environment Variables
Copy `.env.local.example` to `.env.local` and configure:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Dashboard
The dashboard (`/dashboard`) contains three tabs:
- **Sent**: View and track feedback requests sent to colleagues
- **Received**: View and respond to feedback requests
- **Manage**: Review feedback for direct reports

#### Send Request Modal
The modal form for sending feedback requests includes:
- Name and Email fields
- Relationship dropdown: Manager, Peer, Direct Report, Cross-functional
- Collaboration Frequency checkboxes: Daily, Weekly, Monthly, Rarely

### Component Patterns
- Client components use `'use client'` directive
- Tailwind CSS v4 for styling with custom colors defined in globals.css
- TypeScript interfaces for prop typing
- Next.js Link component for navigation
- Modal components receive `isOpen`, `onClose`, and callback props
