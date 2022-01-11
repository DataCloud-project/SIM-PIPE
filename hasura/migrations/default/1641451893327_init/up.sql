SET check_function_bodies = false;
CREATE SCHEMA simpipe;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
CREATE TYPE simpipe.run_status AS ENUM (
    'waiting',
    'active',
    'completed',
    'failed',
    'cancelled'
);
CREATE TYPE simpipe.step_status AS ENUM (
    'waiting',
    'active',
    'completed',
    'failed',
    'cancelled'
);
CREATE TABLE simpipe.cpu (
    id bigint NOT NULL,
    step_id integer NOT NULL,
    value numeric NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE simpipe.cpu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE simpipe.cpu_id_seq OWNED BY simpipe.cpu.id;
CREATE TABLE simpipe.logs (
    step_id integer NOT NULL,
    text text DEFAULT ''::text NOT NULL
);
CREATE TABLE simpipe.memory (
    id bigint NOT NULL,
    step_id integer NOT NULL,
    value numeric NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE simpipe.memory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE simpipe.memory_id_seq OWNED BY simpipe.memory.id;
CREATE TABLE simpipe.runs (
    simulation_id uuid NOT NULL,
    dsl jsonb NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    status simpipe.run_status DEFAULT 'waiting'::simpipe.run_status NOT NULL,
    started timestamp with time zone,
    ended timestamp with time zone,
    run_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    CONSTRAINT "ended started constraint" CHECK ((((status = 'waiting'::simpipe.run_status) AND (started IS NULL) AND (ended IS NULL)) OR ((status = 'active'::simpipe.run_status) AND (started IS NOT NULL) AND (ended IS NULL)) OR ((status = 'completed'::simpipe.run_status) AND (started IS NOT NULL) AND (ended IS NOT NULL)) OR (((status = 'failed'::simpipe.run_status) OR (status = 'cancelled'::simpipe.run_status)) AND ((ended IS NULL) OR (started IS NOT NULL)))))
);
COMMENT ON TABLE simpipe.runs IS 'Simulation run';
CREATE TABLE simpipe.simulations (
    simulation_id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    model_id uuid NOT NULL
);
COMMENT ON TABLE simpipe.simulations IS 'Simulations';
COMMENT ON COLUMN simpipe.simulations.simulation_id IS 'UUID of the simulation';
COMMENT ON COLUMN simpipe.simulations.created IS 'DateTime of when the simulation was created';
COMMENT ON COLUMN simpipe.simulations.model_id IS 'UUID of the model';
CREATE TABLE simpipe.steps (
    run_id uuid NOT NULL,
    name text NOT NULL,
    step_id integer NOT NULL,
    status simpipe.step_status DEFAULT 'waiting'::simpipe.step_status NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    started timestamp with time zone,
    ended timestamp with time zone
);
CREATE SEQUENCE simpipe.steps_step_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE simpipe.steps_step_id_seq OWNED BY simpipe.steps.step_id;
ALTER TABLE ONLY simpipe.cpu ALTER COLUMN id SET DEFAULT nextval('simpipe.cpu_id_seq'::regclass);
ALTER TABLE ONLY simpipe.memory ALTER COLUMN id SET DEFAULT nextval('simpipe.memory_id_seq'::regclass);
ALTER TABLE ONLY simpipe.steps ALTER COLUMN step_id SET DEFAULT nextval('simpipe.steps_step_id_seq'::regclass);
ALTER TABLE ONLY simpipe.cpu
    ADD CONSTRAINT cpu_pkey PRIMARY KEY (id);
ALTER TABLE ONLY simpipe.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (step_id);
ALTER TABLE ONLY simpipe.memory
    ADD CONSTRAINT memory_pkey PRIMARY KEY (id);
ALTER TABLE ONLY simpipe.runs
    ADD CONSTRAINT runs_pkey PRIMARY KEY (run_id);
ALTER TABLE ONLY simpipe.simulations
    ADD CONSTRAINT "simulations_modelId_key" UNIQUE (model_id);
ALTER TABLE ONLY simpipe.simulations
    ADD CONSTRAINT simulations_pkey PRIMARY KEY (simulation_id);
ALTER TABLE ONLY simpipe.steps
    ADD CONSTRAINT steps_pkey PRIMARY KEY (step_id);
ALTER TABLE ONLY simpipe.steps
    ADD CONSTRAINT steps_run_id_name_key UNIQUE (run_id, name);
ALTER TABLE ONLY simpipe.cpu
    ADD CONSTRAINT cpu_step_id_fkey FOREIGN KEY (step_id) REFERENCES simpipe.steps(step_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY simpipe.logs
    ADD CONSTRAINT logs_step_id_fkey FOREIGN KEY (step_id) REFERENCES simpipe.steps(step_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY simpipe.memory
    ADD CONSTRAINT memory_step_id_fkey FOREIGN KEY (step_id) REFERENCES simpipe.steps(step_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY simpipe.runs
    ADD CONSTRAINT runs_simulation_id_fkey FOREIGN KEY (simulation_id) REFERENCES simpipe.simulations(simulation_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY simpipe.steps
    ADD CONSTRAINT steps_run_id_fkey FOREIGN KEY (run_id) REFERENCES simpipe.runs(run_id) ON UPDATE CASCADE ON DELETE CASCADE;
