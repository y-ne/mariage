import {
	pgTable,
	bigint,
	text,
	uuid,
	timestamp,
	boolean,
	numeric,
	jsonb,
} from "drizzle-orm/pg-core";

export const skel = pgTable("skel", {
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	skelUuid: uuid("skel_uuid").defaultRandom().notNull(),
	skelString: text("skel_string").notNull(),
	skelInteger: bigint("skel_integer", { mode: "number" }).notNull(),
	skelFlag: boolean("skel_flag").notNull().default(false),
	skelAmount: numeric("skel_amount", { precision: 18, scale: 2 }),
	skelData: jsonb("skel_data").$type<Record<string, unknown>>(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});
