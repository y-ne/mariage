"use client";

import * as React from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import type { UserRow } from "./columns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

function pickRole(r: UserRow["role"]): "admin" | "user" {
	if (Array.isArray(r)) return r.includes("admin") ? "admin" : "user";
	return r === "admin" ? "admin" : "user";
}

async function patchJson(url: string, body: Record<string, unknown>) {
	const res = await fetch(url, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const json = (await res.json().catch(() => ({}))) as { message?: string };
	if (!res.ok) throw new Error(json.message || "Request failed");
	return json;
}

export function EditUserDialog({ user }: { user: UserRow }) {
	const router = useRouter();

	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState(user.name);
	const [username, setUsername] = React.useState(user.username);
	const [role, setRole] = React.useState<"admin" | "user">(
		pickRole(user.role),
	);
	const [saving, setSaving] = React.useState(false);

	React.useEffect(() => {
		if (!open) return;
		setName(user.name);
		setUsername(user.username);
		setRole(pickRole(user.role));
	}, [open, user]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* shadcn: opening a dialog from dropdown => modal={false} */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => navigator.clipboard.writeText(user.id)}
					>
						Copy user id
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DialogTrigger asChild>
						{/* important: prevent dropdown from closing before dialog triggers */}
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							Edit
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit user</DialogTitle>
					<DialogDescription>
						Update name, username, and role.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Name</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label>Username</Label>
						<Input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label>Role</Label>
						<Select
							value={role}
							onValueChange={(v) =>
								setRole(v as "admin" | "user")
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="user">user</SelectItem>
								<SelectItem value="admin">admin</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						disabled={saving}
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
					<Button
						disabled={saving}
						onClick={async () => {
							try {
								setSaving(true);
								await patchJson(`/api/admin/users/${user.id}`, {
									name,
									username,
									role,
								});
								toast.success("User updated");
								setOpen(false);
								router.refresh();
							} catch (e: unknown) {
								toast.error(
									e instanceof Error ? e.message : "Failed",
								);
							} finally {
								setSaving(false);
							}
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
