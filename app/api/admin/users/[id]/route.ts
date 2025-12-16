import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type SessionLike = { user?: { role?: string | string[] | null } } | null;

function isAdmin(session: SessionLike) {
	const r = session?.user?.role;
	const roles = Array.isArray(r) ? r : r ? [r] : [];
	return roles.includes("admin");
}

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const h = await headers();

	const session = (await auth.api.getSession({ headers: h })) as SessionLike;
	if (!session || !isAdmin(session)) {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	const body = (await req.json().catch(() => ({}))) as {
		name?: unknown;
		username?: unknown;
		role?: unknown;
	};

	const data: Record<string, unknown> = {};
	if (typeof body.name === "string") data.name = body.name;
	if (typeof body.username === "string") data.username = body.username;

	if (Object.keys(data).length) {
		await auth.api.adminUpdateUser({
			body: { userId: id, data },
			headers: h,
		});
	}

	if (body.role === "admin" || body.role === "user") {
		await auth.api.setRole({
			body: { userId: id, role: body.role },
			headers: h,
		});
	}

	return NextResponse.json({ ok: true });
}
