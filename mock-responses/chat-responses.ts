export const mockResponses = [
  `# React Hooks: A Comprehensive Guide

React Hooks are functions that let you "hook into" React state and lifecycle features. They enable you to use state and other React features in functional components, eliminating the need for class components in most cases.

## Most Common Hooks

### useState
The \`useState\` hook lets you add state to functional components:

\`\`\`jsx
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

### useEffect
Performs side effects in functional components:

\`\`\`jsx
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Timer executed');
  }, 1000);
  
  return () => clearTimeout(timer);
}, []);
\`\`\`

### useContext
Access context values without nesting:

\`\`\`jsx
const theme = useContext(ThemeContext);
\`\`\`

## Rules of Hooks

1. Only call hooks at the top level of your component
2. Only call hooks from React function components or custom hooks
3. Never call hooks conditionally

## Custom Hooks

You can extract component logic into reusable functions:

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data));
  }, [url]);
  
  return data;
}
\`\`\`

Hooks have revolutionized how we write React components, making code more reusable and easier to understand.`,

  `# Building a Next.js Application: Complete Tutorial

Next.js is a powerful React framework that provides everything you need to build fast, production-ready applications.

## Getting Started

Start with the official scaffolding tool:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## File-Based Routing

Next.js uses the App Router with file-based routing. Create files in the \`app\` directory:

\`\`\`
app/
  page.tsx          # /
  about/page.tsx    # /about
  blog/[id]/page.tsx # /blog/:id
\`\`\`

## Server and Client Components

By default, all components are Server Components:

\`\`\`jsx
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component (needs 'use client')
'use client'
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## API Routes

Create API endpoints in the \`app/api\` directory:

\`\`\`typescript
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}

export async function POST(req: Request) {
  const data = await req.json();
  return Response.json({ success: true, data });
}
\`\`\`

## Deployment

Deploy instantly to Vercel with zero configuration. Next.js automatically optimizes your app for production.

This framework combines the best practices for modern web development with an amazing developer experience.`,

  `# TypeScript Best Practices: Writing Scalable Code

TypeScript adds static typing to JavaScript, helping you catch errors early and write more maintainable code.

## Enable Strict Mode

Always enable strict mode in your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
\`\`\`

## Avoid \`any\`

Never use \`any\` unless absolutely necessary:

\`\`\`typescript
// Bad
function process(data: any) {
  return data.value;
}

// Good
interface Data {
  value: string;
}

function process(data: Data) {
  return data.value;
}
\`\`\`

## Type Inference

Let TypeScript infer types when obvious:

\`\`\`typescript
// TypeScript knows this is a string
const name = "Alice";

// Explicit when needed
const count: number = 42;
\`\`\`

## Discriminated Unions

Use discriminated unions for type-safe handling:

\`\`\`typescript
type Result = 
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: string };

function handle(result: Result) {
  if (result.status === 'success') {
    console.log(result.data);
  } else {
    console.log(result.error);
  }
}
\`\`\`

## Type Guards

Write reusable type guard functions:

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(value)) {
  console.log(value.toUpperCase());
}
\`\`\`

Mastering these practices will make your TypeScript code more robust and maintainable.`,

  `# CSS Grid vs Flexbox: When to Use Each

Both CSS Grid and Flexbox are powerful layout tools. Understanding when to use each is crucial for modern web development.

## Flexbox: One-Dimensional Layouts

Flexbox excels at laying out items in a single direction (row or column):

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.item {
  flex: 1;
}
\`\`\`

Use Flexbox for:
- Navigation menus
- Tool bars
- Component spacing
- Alignment of elements

## Grid: Two-Dimensional Layouts

Grid is perfect for complex two-dimensional layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.header {
  grid-column: 1 / -1;
}

.sidebar {
  grid-column: 1;
  grid-row: 2;
}
\`\`\`

Use Grid for:
- Page layouts
- Dashboard designs
- Complex multi-column layouts
- Photo galleries

## Combining Both

Often, the best approach combines both:

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

.header {
  grid-column: 1 / -1;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
\`\`\`

Understanding both tools empowers you to create flexible, responsive layouts efficiently.`,
];
