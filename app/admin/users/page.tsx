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

function cell(value: unknown) {
	if (value === null || value === undefined || value === "") return "-";
	if (typeof value === "boolean") return value ? "true" : "false";
	return String(value);
}

export default async function AllUsersPage() {
	const res = await auth.api.listUsers({
		query: { limit: 100, offset: 0 },
		headers: await headers(),
	});

	const users = res.users ?? [];

	return (
		<div className="space-y-4">
			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="whitespace-nowrap">
							<TableHead>id</TableHead>
							<TableHead>name</TableHead>
							<TableHead>email</TableHead>
							<TableHead>email_verified</TableHead>
							<TableHead>image</TableHead>
							<TableHead>created_at</TableHead>
							<TableHead>updated_at</TableHead>
							<TableHead>username</TableHead>
							<TableHead>display_username</TableHead>
							<TableHead>role</TableHead>
							<TableHead>banned</TableHead>
							<TableHead>ban_reason</TableHead>
							<TableHead>ban_expires</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={13}
									className="py-6 text-center text-sm text-muted-foreground"
								>
									No users
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow
									key={cell(Reflect.get(user, "id"))}
									className="whitespace-nowrap"
								>
									<TableCell>
										{cell(Reflect.get(user, "id"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "name"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "email"))}
									</TableCell>
									<TableCell>
										{cell(
											Reflect.get(user, "email_verified"),
										)}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "image"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "created_at"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "updated_at"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "username"))}
									</TableCell>
									<TableCell>
										{cell(
											Reflect.get(
												user,
												"display_username",
											),
										)}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "role"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "banned"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "ban_reason"))}
									</TableCell>
									<TableCell>
										{cell(Reflect.get(user, "ban_expires"))}
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
