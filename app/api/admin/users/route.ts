import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

type SessionLike = {
	user?: { role?: string | string[] | null };
} | null;

function isAdmin(session: SessionLike) {
	const role = session?.user?.role;
	const roles = Array.isArray(role) ? role : [role].filter(Boolean);
	return roles.includes("admin");
}

export async function POST(req: Request) {
	const origin = req.headers.get("origin");
	const allow = new Set(
		[process.env.BETTER_AUTH_URL, "https://wakimae.com"].filter(Boolean),
	);
	if (origin && !allow.has(origin)) {
		return NextResponse.json(
			{ message: "Forbidden origin" },
			{ status: 403 },
		);
	}

	const h = await headers();

	const session = await auth.api.getSession({ headers: h });
	if (!session || !isAdmin(session)) {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	const body = await req.json().catch(() => null);

	const email = body?.email;
	const password = body?.password;
	const name = body?.name;
	const role = body?.role ?? "user";

	if (!email || !password || !name) {
		return NextResponse.json(
			{ message: "Missing fields" },
			{ status: 400 },
		);
	}

	try {
		const newUser = await auth.api.createUser({
			body: { email, password, name, role },
			headers: h,
		});

		return NextResponse.json({ user: newUser }, { status: 201 });
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to create user";
		return NextResponse.json({ message }, { status: 400 });
	}
}
