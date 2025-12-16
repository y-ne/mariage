import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DataTable } from "./data-table";
import type { UserRow } from "./columns";

type R = Record<string, unknown>;

function str(v: unknown) {
	return typeof v === "string" ? v : "";
}

function bool(v: unknown) {
	return typeof v === "boolean" ? v : false;
}

function role(v: unknown): string | string[] {
	if (typeof v === "string") return v;
	if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v;
	return "user";
}

function iso(v: unknown) {
	if (typeof v === "string") return v;
	if (v instanceof Date) return v.toISOString();
	return "";
}

export default async function AllUsersPage() {
	const res = await auth.api.listUsers({
		query: { limit: 100, offset: 0 },
		headers: await headers(),
	});

	const data: UserRow[] = (res.users ?? []).map((u) => {
		const x = u as unknown as R;
		return {
			id: str(x.id),
			name: str(x.name),
			email: str(x.email),
			username: str(x.username),
			role: role(x.role),
			banned: bool(x.banned),
			createdAt: iso(x.createdAt ?? x.created_at),
		};
	});

	return (
		<div className="w-full space-y-4 p-6">
			<DataTable data={data} />
		</div>
	);
}
