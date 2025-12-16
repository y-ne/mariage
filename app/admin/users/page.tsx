import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default async function AllUsersPage() {
	const { users } = await auth.api.listUsers({
		query: { limit: 100, offset: 0 },
		headers: await headers(),
	});

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Username</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="text-right">Banned</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="py-6 text-center text-sm text-muted-foreground"
								>
									No users
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.name ?? "-"}</TableCell>
									<TableCell>{user.email ?? "-"}</TableCell>
									<TableCell>
										{String(
											Reflect.get(user, "username") ??
												"-",
										)}
									</TableCell>
									<TableCell>{user.role ?? "-"}</TableCell>
									<TableCell className="text-right">
										{user.banned ? "yes" : "no"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
