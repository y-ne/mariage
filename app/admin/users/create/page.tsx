"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function CreateUserPage() {
	const [role, setRole] = useState("user");
	const [submitting, setSubmitting] = useState(false);

	const { data: session, isPending } = authClient.useSession();

	const roleValue = session?.user?.role;
	const roles = Array.isArray(roleValue)
		? roleValue
		: [roleValue].filter(Boolean);
	const isAdmin = roles.includes("admin");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);

		setSubmitting(true);

		try {
			const payload = {
				name: formData.get("name"),
				email: formData.get("email"),
				password: formData.get("password"),
				role,
			};

			const res = await fetch("/api/admin/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const json = await res.json().catch(() => ({}));

			if (!res.ok) {
				toast.error(json.message || "Failed");
				return;
			}

			toast.success("User created");
			form.reset();
			setRole("user");
		} finally {
			setSubmitting(false);
		}
	}

	if (isPending) return null;

	if (!session) {
		return (
			<Card className="max-w-xl">
				<CardHeader>
					<CardTitle>Create user</CardTitle>
				</CardHeader>
				<CardContent>Please sign in.</CardContent>
			</Card>
		);
	}

	if (!isAdmin) {
		return (
			<Card className="max-w-xl">
				<CardHeader>
					<CardTitle>Create user</CardTitle>
				</CardHeader>
				<CardContent>Admins only.</CardContent>
			</Card>
		);
	}

	return (
		<Card className="max-w-xl">
			<CardHeader>
				<CardTitle>Create user</CardTitle>
			</CardHeader>

			<CardContent>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" name="name" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="role">Role</Label>
						<Select value={role} onValueChange={setRole}>
							<SelectTrigger id="role">
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="user">user</SelectItem>
								<SelectItem value="admin">admin</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button type="submit" disabled={submitting}>
						{submitting ? "Creating..." : "Create"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
