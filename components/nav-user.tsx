"use client";

import { ChevronsUpDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

function initials(name: string) {
	const p = name.trim().split(/\s+/).filter(Boolean);
	return ((p[0]?.[0] ?? "U") + (p[1]?.[0] ?? "")).toUpperCase();
}

export function NavUser() {
	const router = useRouter();
	const { isMobile } = useSidebar();

	const { data: session } = authClient.useSession();
	const user = session?.user;

	const name = user?.name ?? "";
	const email = user?.email ?? "";
	const image = (user as { image?: string | null } | null)?.image ?? "";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={image || ""} alt={name} />
								<AvatarFallback className="rounded-lg">
									{initials(name)}
								</AvatarFallback>
							</Avatar>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{name}
								</span>
								<span className="truncate text-xs">
									{email}
								</span>
							</div>

							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-2">
							<div className="text-sm font-medium truncate">
								{name}
							</div>
							<div className="text-xs text-muted-foreground truncate">
								{email}
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuItem asChild>
							<Link href="/account">
								<User className="mr-2 h-4 w-4" />
								Profile
							</Link>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							disabled={!user}
							onClick={async () => {
								await authClient.signOut({
									fetchOptions: {
										onSuccess: () => {
											router.push("/login");
											router.refresh();
										},
									},
								});
							}}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
