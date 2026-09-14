# AI Bug Tracker

An AI-powered software defect tracking and management system designed to help development teams report, manage, analyze, and resolve software bugs efficiently.

## Project Overview

AI Bug Tracker is a full-stack web application that combines traditional bug tracking with Artificial Intelligence features.

The system provides role-based access for Testers, Developers, and Managers and supports the complete bug workflow from reporting to closure.

## Features

### Bug Management
- Create and report software bugs
- View and manage reported bugs
- Assign bugs to developers
- Update bug status and priority
- Track bug severity and category
- Search and filter bugs
- Manage bugs through the complete workflow

### Bug Workflow

Bugs follow a controlled workflow:

`Reported → Assigned → In Progress → Resolved → Verified → Closed`

A bug cannot skip workflow stages, helping maintain consistency in defect management.

### Role-Based Access

The application supports three user roles:

- **Tester** – Reports and tracks bugs
- **Developer** – Works on assigned bugs and resolutions
- **Manager** – Manages projects and oversees defect tracking

### AI-Powered Features

The system includes AI-assisted functionality to improve defect resolution:

- AI-powered bug resolution suggestions
- Root-cause analysis assistance
- Automatic bug triage
- Similar bug detection
- Test-case generation
- AI-assisted sprint planning
- AI chatbot assistance

### Dashboard & Analytics

The dashboard provides insights into the project's defect status, including:

- Total bugs
- Reported bugs
- Assigned bugs
- In-progress bugs
- Resolved bugs
- Verified bugs
- Closed bugs
- Bug severity distribution
- Bug category distribution
- Bug status distribution
- Developer workload
- Bug trends

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts

### Backend
- Python
- Flask
- Flask-JWT-Extended
- Flask-CORS
- Flasgger

### Database
- MySQL

### AI & Intelligent Features
- Google Gemini
- Vector embeddings
- Pinecone

### Deployment
- Vercel – Frontend
- Render – Backend
- Aiven – MySQL Database

## System Architecture

The application follows a full-stack architecture:

```text
                    ┌─────────────────────┐
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React Frontend      │
                    │ Vercel              │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │ Flask Backend       │
                    │ Render              │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
     ┌─────────────────┐                ┌─────────────────┐
     │ MySQL Database  │                │ AI Services     │
     │ Aiven           │                │ Gemini/Pinecone │
     └─────────────────┘                └─────────────────┘