CREATE TABLE `decisions` (
	`id` text PRIMARY KEY NOT NULL,
	`area` text NOT NULL,
	`status` text NOT NULL,
	`note` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`area` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`severity` integer NOT NULL,
	`status` text DEFAULT 'Received' NOT NULL,
	`created` text NOT NULL,
	`language` text NOT NULL,
	`source` text NOT NULL
);
