import { type NextRequest, NextResponse } from "next/server";

// Generate mock people names
const generateMockPeople = (count: number) => {
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
  ];

  const people = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    people.push({
      id: `user_${i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    });
  }
  return people;
};

const allPeople = generateMockPeople(1000000); // Simulate 1M+ users

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // Search through mock people database
  const results = allPeople
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.email.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 10)
    .map((p) => ({
      ...p,
      displayName: `${p.name} (${p.email})`,
    }));

  return NextResponse.json({ results });
}
