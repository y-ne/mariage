"use client";

import type { ColumnDef } from "@tanstack/react-table";
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
	{ accessorKey: "email", header: "Email" },
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
		header: "",
		cell: ({ row }) => <EditUserDialog user={row.original} />,
	},
];
