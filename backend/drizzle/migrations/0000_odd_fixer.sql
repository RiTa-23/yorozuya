CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`stock` integer NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gold` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`quantity` integer NOT NULL
);
