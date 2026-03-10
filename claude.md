# Project Instructions for Claude

## Project Context

This is a full-stack web application consisting of a Next.js frontend and a Node.js/TypeScript backend.

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Drizzle ORM.
- **Backend**: Node.js, TypeScript (in the `backend/` directory).

## General Structure

- `/app` - Next.js App Router pages and layouts.
- `/components` - React components (often using shadcn/ui and Tailwind).
- `/backend` - The backend API logic written in TypeScript.

## General Guidelines

- Always write clean, maintainable, and type-safe code.
- Use explicit variable names and add comments where code logic is complex.
- When making modifications, read the surrounding code and stick to the existing patterns.
- Avoid introducing unnecessary dependencies unless explicitly requested.
- Provide complete code snippets when making recommendations, but focus edits on exactly what needs to change.

## Frontend Rules (Next.js & React)

- Use standard Next.js App Router conventions (Client vs. Server components).
- Use React hooks and functional components exclusively.
- For styling, use Tailwind CSS utility classes.
- Use `lucide-react` for icons.

## Backend Rules (Node.js & TypeScript)

- Use strict TypeScript typing. Do not use `any` unless absolutely necessary.
- Follow the modular architecture present in the `backend/` directory (controllers, services, etc.).
- Ensure backend code is formatted cleanly (the backend uses Prettier).

## Database & State

- State management and API fetching should align with the project's existing approaches.
- When adding database features, consider the `drizzle-orm` setup in the frontend or whatever ORM is standard in the backend.

## Response Style

- Be concise and to the point.
- Answer questions directly without excessive pleasantries.
- When drafting solutions, provide step-by-step explanations followed by the required diffs or complete file contents.
