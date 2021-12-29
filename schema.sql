SET check_function_bodies = false;
CREATE SCHEMA dev;
CREATE TABLE dev.cpu (
    id bigint NOT NULL,
    step_id integer NOT NULL,
    value numeric NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE dev.cpu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE dev.cpu_id_seq OWNED BY dev.cpu.id;
CREATE TABLE dev.logs (
    step_id integer NOT NULL,
    text text DEFAULT ''::text NOT NULL
);
CREATE TABLE dev.memory (
    id bigint NOT NULL,
    step_id integer NOT NULL,
    value numeric NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE dev.memory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE dev.memory_id_seq OWNED BY dev.memory.id;
CREATE TABLE dev.runs (
    run_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    simulation_id uuid NOT NULL,
    dsl jsonb NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    status public.run_status DEFAULT 'waiting'::public.run_status NOT NULL,
    started timestamp with time zone,
    ended timestamp with time zone,
    CONSTRAINT "ended started constraint" CHECK ((((status = 'waiting'::public.run_status) AND (started IS NULL) AND (ended IS NULL)) OR ((status = 'active'::public.run_status) AND (started IS NOT NULL) AND (ended IS NULL)) OR ((status = 'completed'::public.run_status) AND (started IS NOT NULL) AND (ended IS NOT NULL)) OR (((status = 'failed'::public.run_status) OR (status = 'cancelled'::public.run_status)) AND ((ended IS NULL) OR (started IS NOT NULL)))))
);
COMMENT ON TABLE dev.runs IS 'Simulation run';
CREATE TABLE dev.simulations (
    simulation_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    model_id uuid NOT NULL
);
COMMENT ON TABLE dev.simulations IS 'Simulations';
COMMENT ON COLUMN dev.simulations.simulation_id IS 'UUID of the simulation';
COMMENT ON COLUMN dev.simulations.created IS 'DateTime of when the simulation was created';
COMMENT ON COLUMN dev.simulations.model_id IS 'UUID of the model';
CREATE TABLE dev.steps (
    step_id integer NOT NULL,
    run_id uuid NOT NULL,
    name text NOT NULL,
    status public.step_status DEFAULT 'waiting'::public.step_status NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    started timestamp with time zone,
    ended timestamp with time zone
);
CREATE SEQUENCE dev.steps_step_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE dev.steps_step_id_seq OWNED BY dev.steps.step_id;
ALTER TABLE ONLY dev.cpu ALTER COLUMN id SET DEFAULT nextval('dev.cpu_id_seq'::regclass);
ALTER TABLE ONLY dev.memory ALTER COLUMN id SET DEFAULT nextval('dev.memory_id_seq'::regclass);
ALTER TABLE ONLY dev.steps ALTER COLUMN step_id SET DEFAULT nextval('dev.steps_step_id_seq'::regclass);
ALTER TABLE ONLY dev.cpu
    ADD CONSTRAINT cpu_pkey PRIMARY KEY (id);
ALTER TABLE ONLY dev.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (step_id);
ALTER TABLE ONLY dev.memory
    ADD CONSTRAINT memory_pkey PRIMARY KEY (id);
ALTER TABLE ONLY dev.runs
    ADD CONSTRAINT runs_pkey PRIMARY KEY (run_id);
ALTER TABLE ONLY dev.simulations
    ADD CONSTRAINT "simulations_modelId_key" UNIQUE (model_id);
ALTER TABLE ONLY dev.simulations
    ADD CONSTRAINT simulations_pkey PRIMARY KEY (simulation_id);
ALTER TABLE ONLY dev.steps
    ADD CONSTRAINT steps_pkey PRIMARY KEY (step_id);
ALTER TABLE ONLY dev.steps
    ADD CONSTRAINT steps_run_id_name_key UNIQUE (run_id, name);
ALTER TABLE ONLY dev.cpu
    ADD CONSTRAINT cpu_step_id_fkey FOREIGN KEY (step_id) REFERENCES dev.steps(step_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dev.logs
    ADD CONSTRAINT logs_step_id_fkey FOREIGN KEY (step_id) REFERENCES dev.steps(step_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dev.memory
    ADD CONSTRAINT memory_step_id_fkey FOREIGN KEY (step_id) REFERENCES dev.steps(step_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dev.runs
    ADD CONSTRAINT runs_simulation_id_fkey FOREIGN KEY (simulation_id) REFERENCES dev.simulations(simulation_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dev.steps
    ADD CONSTRAINT steps_run_id_fkey FOREIGN KEY (run_id) REFERENCES dev.runs(run_id) ON UPDATE CASCADE ON DELETE CASCADE;