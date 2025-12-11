import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	return (
		<main className="min-h-screen flex items-center justify-center">
			<div>
				<h1 className="text-2xl font-semibold">
					Welcome, {session.user.name ?? session.user.email}
				</h1>
				<p className="mt-2 text-sm text-zinc-500">
					This is a protected dashboard.
				</p>
			</div>
		</main>
	);
}
