# Bitly-Style URL Shortener

This is a full-stack URL shortener web application built with Next.js (App Router), TypeScript, TailwindCSS, and a PostgreSQL database powered by Neon.

## Features

-   **URL Shortening**: Convert long URLs into short, easy-to-share links.
-   **Custom Slugs**: Users can provide an optional custom slug for their short links.
-   **Random Slugs**: If no custom slug is provided, a unique random slug is automatically generated.
-   **Redirection**: The application redirects short links (`/[slug]`) to their original long URL.
-   **Click Tracking**: Automatically counts the number of clicks for each short link.
-   **Link Management**: View a list of all created short links, including the slug, original URL, click count, and creation date.
-   **Delete Links**: Easily delete short links from the dashboard.
-   **API for Stats**: View statistics for a specific link by visiting `/api/stats/[slug]`.

## Technology Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [TailwindCSS](https://tailwindcss.com/)
-   **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
-   **Database Client**: [pg](https://node-postgres.com/)

## Project Structure

The project follows a strict folder structure as specified:
```
- app/
  - api/
    - shorten/route.ts       # POST: Create a new short link
    - links/route.ts         # GET: Fetch all links, DELETE: Remove a link
    - stats/[slug]/route.ts  # GET: Fetch stats for a specific slug
  - [slug]/route.ts          # GET: Redirect to the original URL and track clicks
  - globals.css
  - layout.tsx
  - page.tsx                 # Main frontend UI
- lib/
  - db.ts                    # Database connection logic
  - validateUrl.ts           # URL validation and normalization helpers
- public/
  - favicon.ico
- .env.example               # Example for environment variables
- package.json
- tailwind.config.ts
- next.config.mjs
- tsconfig.json
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A free [Neon](https://neon.tech/) account for the PostgreSQL database.

### 1. Clone the Repository

First, clone this repository to your local machine.

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### 2. Install Dependencies

Install all the necessary packages using npm.

```bash
npm install
```

### 3. Set Up the Database

1.  **Create a Neon Project**: Log in to your Neon account and create a new project.
2.  **Get the Connection String**: In your project dashboard, find the **Connection Details** and copy the PostgreSQL connection string.
3.  **Create the `links` Table**: In the Neon SQL Editor, run the following command to create the necessary table:
    ```sql
    CREATE TABLE links (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ```

### 4. Configure Environment Variables

1.  Create a new file named `.env` in the root of your project. You can do this by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and add your Neon database connection string.

    ```
    POSTGRIZZLY_URL="your_postgres_connection_string_here"
    ```

### 5. Run the Development Server

Start the application in development mode.

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running.
