"use client";

// import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
	// const router = useRouter();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email");
		const password = formData.get("password");

		if (typeof email !== "string" || typeof password !== "string") {
			toast.error("Invalid form data");
			return;
		}

		const { data, error } = await authClient.signIn.email({
			email,
			password,
		});

		if (error) {
			toast.error(error.message ?? "Login Failed");
			return;
		}

		toast.success(`Signed In as ${data.user.name}`);
	}

	return (
		<main className="min-h-screen flex items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-center text-lg">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-1">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								required
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
							/>
						</div>

						<Button type="submit" className="w-full">
							Sign in
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
