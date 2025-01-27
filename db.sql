-- public.todos definition

-- Drop table

-- DROP TABLE public.todos;

CREATE TABLE public.todos (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	is_done bool DEFAULT false NULL,
	createdat timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updatedat timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT todos_pkey PRIMARY KEY (id)
);