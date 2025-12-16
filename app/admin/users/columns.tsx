"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { EditUserDialog } from "./edit-user-dialog";

export type UserRow = {
	id: string;
	name: string;
	email: string;
	username: string;
	role: string | string[];
	banned: boolean;
	createdAt: string;
};

function roleText(r: UserRow["role"]) {
	return Array.isArray(r) ? r.join(", ") : r || "";
}

export const columns: ColumnDef<UserRow>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
			>
				Email <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("email")}</div>
		),
	},
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "username", header: "Username" },
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => roleText(row.original.role),
	},
	{
		accessorKey: "banned",
		header: "Status",
		cell: ({ row }) => (row.original.banned ? "banned" : "active"),
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => row.original.createdAt || "-",
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => <EditUserDialog user={row.original} />,
	},
];
