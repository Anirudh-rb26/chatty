import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  // Mock suggestions database
  const suggestions = [
    "Explain React hooks",
    "How to build a Next.js app",
    "Best practices for TypeScript",
    "CSS Grid vs Flexbox",
    "What is a closure in JavaScript",
    "Understanding async/await",
    "REST API best practices",
    "Database optimization techniques",
    "Web performance optimization",
    "Security best practices for web apps",
  ];

  if (!query) {
    return NextResponse.json({ results: suggestions.slice(0, 5) });
  }

  const filtered = suggestions
    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  return NextResponse.json({ results: filtered });
}
