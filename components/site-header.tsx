"use client";

import { usePathname } from "next/navigation";
import { SidebarIcon } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

const LABELS: Record<string, string> = {
	tools: "Tools",
	users: "All users",
};

function titleize(segment: string) {
	return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SiteHeader() {
	const { toggleSidebar } = useSidebar();
	const pathname = usePathname();

	const parts = pathname.split("?")[0].split("/").filter(Boolean);
	const isAdmin = parts[0] === "admin";
	const crumbs = (isAdmin ? parts.slice(1) : parts).map((seg, i, arr) => ({
		label: LABELS[seg] ?? titleize(seg),
		href: `/${(isAdmin ? ["admin"] : []).concat(arr.slice(0, i + 1)).join("/")}`,
		isLast: i === arr.length - 1,
	}));

	return (
		<header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
			<div className="flex h-(--header-height) w-full items-center gap-2 px-4">
				<Button
					className="h-8 w-8"
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
				>
					<SidebarIcon />
				</Button>

				<Separator orientation="vertical" className="mr-2 h-4" />

				<Breadcrumb className="hidden sm:block">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
						</BreadcrumbItem>

						{crumbs.map((c) => (
							<span key={c.href} className="contents">
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									{c.isLast ? (
										<BreadcrumbPage>
											{c.label}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={c.href}>
											{c.label}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</span>
						))}
					</BreadcrumbList>
				</Breadcrumb>

				<SearchForm className="w-full sm:ml-auto sm:w-auto" />
			</div>
		</header>
	);
}
