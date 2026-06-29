# Zenify

Zenify is a modern, full-stack music streaming platform designed to provide a seamless audio experience across web and desktop environments. Built with a focus on performance, aesthetics, and user experience.

## Architecture & Tech Stack

- **Web Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS v4
- **Authentication:** NextAuth.js for secure user sessions
- **Storage:** AWS S3 integration for robust media management
- **Search:** Fuse.js for fast client-side fuzzy searching
- **Desktop Client:** Dedicated desktop wrapper built with Go (`/desktop`)
- **Uploader Utility:** Go-based tool for uploading and managing audio files (`/uploader`)

## Key Features

- Seamless audio playback with queue management (Bottom Player)
- Artist profiles, album views, and custom playlist creation
- Responsive and modern UI design tailored for any device
- Integrated native desktop experience

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Go (for desktop client and uploader)
- AWS S3 or compatible storage credentials

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Configure your environment variables in the `.env` file (NextAuth secrets, AWS credentials, etc.).

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Repository Structure

- `/src` - Next.js web application (pages, components, utilities)
- `/desktop` - Go source code for the native desktop client
- `/uploader` - Go utility for processing and uploading media
- `/scripts` - Development scripts and mock generators

## Disclaimer / Usage

**This project is built strictly for personal use.** It is not intended for commercial distribution, monetization, or public sale.

---

*Credit: Created with claude opus 4.8 max and gemini 3.1 Pro (high)*
