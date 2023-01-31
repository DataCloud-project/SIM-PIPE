SET check_function_bodies = false;
CREATE SCHEMA simpipe;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

-- Simulations
CREATE TABLE simpipe.simulations (
    simulation_id uuid DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created timestamp without time zone DEFAULT now() NOT NULL,
    pipeline_description jsonb NOT NULL,
    user_id text NOT NULL
);
COMMENT ON TABLE simpipe.simulations IS 'Simulations';
COMMENT ON COLUMN simpipe.simulations.simulation_id IS 'UUID of the simulation, random by default';
COMMENt ON COLUMN simpipe.simulations.name IS 'Name of the simulation, it is unique';
COMMENT ON COLUMN simpipe.simulations.created IS 'DateTime of when the simulation was created';
COMMENT ON COLUMN simpipe.simulations.pipeline_description IS 'Description of the pipeline in JSON';
COMMENT ON COLUMN simpipe.simulations.user_id IS 'User ID of the owner of the simulation';

-- Run status
CREATE TABLE simpipe.run_status (
    value text NOT NULL PRIMARY KEY
);
COMMENT ON TABLE simpipe.run_status IS 'Status of a run';
INSERT INTO simpipe.run_status (value) VALUES
  ('waiting'),
  ('queued'),
  ('active'),
  ('completed'),
  ('failed'),
  ('cancelled');

-- Step status
CREATE TABLE simpipe.step_status (
    value text NOT NULL PRIMARY KEY
);
COMMENT ON TABLE simpipe.step_status IS 'Status of a step';
INSERT INTO simpipe.step_status (value) VALUES
  ('queued'),
  ('active'),
  ('completed'),
  ('failed'),
  ('cancelled');

-- Runs
CREATE TABLE simpipe.runs (
    run_id uuid DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
    simulation_id uuid NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'waiting'::text NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    started timestamp without time zone,
    ended timestamp without time zone,
    CONSTRAINT "ended started constraint" CHECK ((((status = 'waiting'::text) AND (started IS NULL) AND (ended IS NULL)) OR ((status = 'active'::text) AND (started IS NOT NULL) AND (ended IS NULL)) OR ((status = 'completed'::text) AND (started IS NOT NULL) AND (ended IS NOT NULL)) OR (((status = 'failed'::text) OR (status = 'cancelled'::text)) AND ((ended IS NULL) OR (started IS NOT NULL))) OR ((started IS NULL) AND (ended IS NULL)))),
    CONSTRAINT "valid timestamps" CHECK ((started IS NULL OR started >= created) AND (ended IS NULL OR ended >= started))
);
COMMENT ON TABLE simpipe.runs IS 'Simulation run';
COMMENT ON COLUMN simpipe.runs.run_id IS 'UUID of the run, random by default';
COMMENT ON COLUMN simpipe.runs.simulation_id IS 'UUID of the simulation, must exist in the simulations table';
COMMENT ON COLUMN simpipe.runs.name IS 'Name of the run, it is unique per simulation';
COMMENT ON COLUMN simpipe.runs.status IS 'Status of the run, must be one of the values in the run_status enum';
COMMENT ON COLUMN simpipe.runs.created IS 'DateTime of when the run was created';
COMMENT ON COLUMN simpipe.runs.started IS 'DateTime of when the run was started, NULL if not started';
COMMENT ON COLUMN simpipe.runs.ended IS 'DateTime of when the run was ended, NULL if not ended';
ALTER TABLE ONLY simpipe.runs
    ADD CONSTRAINT run_status_fkey FOREIGN KEY (status) REFERENCES simpipe.run_status(value);
ALTER TABLE ONLY simpipe.runs
    ADD CONSTRAINT unique_run_name_per_simulation UNIQUE (name, simulation_id);
ALTER TABLE ONLY simpipe.runs
    ADD CONSTRAINT runs_simulation_id_fkey FOREIGN KEY (simulation_id) REFERENCES simpipe.simulations(simulation_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Steps
CREATE TABLE simpipe.steps (
    step_id uuid DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
    pipeline_step_number integer NOT NULL,
    run_id uuid NOT NULL,
    name text NOT NULL,
    image text NOT NULL,
    timeout integer DEFAULT 30 NOT NULL,
    status text DEFAULT 'waiting'::text NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    started timestamp without time zone,
    ended timestamp without time zone,
    CONSTRAINT "ended started constraint" CHECK ((((status = 'waiting'::text) AND (started IS NULL) AND (ended IS NULL)) OR ((status = 'active'::text) AND (started IS NOT NULL) AND (ended IS NULL)) OR ((status = 'completed'::text) AND (started IS NOT NULL) AND (ended IS NOT NULL)) OR (((status = 'failed'::text) OR (status = 'cancelled'::text)) AND ((ended IS NULL) OR (started IS NOT NULL))))),
    CONSTRAINT "normal timeout" CHECK (((timeout >= 1) AND (timeout < 86400))),
    CONSTRAINT "positive step number" CHECK ((pipeline_step_number >= 0)),
    CONSTRAINT "valid timestamps" CHECK ((started IS NULL OR started >= created) AND (ended IS NULL OR ended >= started))
);
COMMENT ON TABLE simpipe.steps IS 'Steps in a run';
COMMENT ON COLUMN simpipe.steps.step_id IS 'UUID of the step, random by default';
COMMENT ON COLUMN simpipe.steps.pipeline_step_number IS 'Step number in the pipeline, must be unique per run and a positive integer';
COMMENT ON COLUMN simpipe.steps.run_id IS 'UUID of the run, must exist in the runs table';
COMMENT ON COLUMN simpipe.steps.name IS 'Name of the step, it is unique per run';
COMMENT ON COLUMN simpipe.steps.image IS 'Docker image of the step';
COMMENT ON COLUMN simpipe.steps.timeout IS 'Timeout of the step in seconds, must be between 1 and 86400';
COMMENT ON COLUMN simpipe.steps.status IS 'Status of the step, must be one of the values in the step_status enum';
COMMENT ON COLUMN simpipe.steps.created IS 'DateTime of when the step was created';
COMMENT ON COLUMN simpipe.steps.started IS 'DateTime of when the step was started, NULL if not started';
COMMENT ON COLUMN simpipe.steps.ended IS 'DateTime of when the step was ended, NULL if not ended';
ALTER TABLE ONLY simpipe.steps
    ADD CONSTRAINT steps_pipeline_step_number_run_id_key UNIQUE (pipeline_step_number, run_id);
ALTER TABLE ONLY simpipe.steps
    ADD CONSTRAINT steps_run_id_name_key UNIQUE (run_id, name);
ALTER TABLE ONLY simpipe.steps
    ADD CONSTRAINT run_status_fkey FOREIGN KEY (status) REFERENCES simpipe.step_status(value);
ALTER TABLE ONLY simpipe.steps
    ADD CONSTRAINT steps_run_id_fkey FOREIGN KEY (run_id) REFERENCES simpipe.runs(run_id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Envs
CREATE TABLE simpipe.envs (
    env_id uuid DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
    step_id uuid NOT NULL,
    name text NOT NULL,
    value text NOT NULL
);
COMMENT ON TABLE simpipe.envs IS 'Environment variables in runs';
COMMENT ON COLUMN simpipe.envs.env_id IS 'UUID of the env, random by default';
COMMENT ON COLUMN simpipe.envs.step_id IS 'UUID of the step, must exist in the steps table';
COMMENT ON COLUMN simpipe.envs.name IS 'Name of the env, it is unique per step';
COMMENT ON COLUMN simpipe.envs.value IS 'Value of the env';
ALTER TABLE ONLY simpipe.envs
    ADD CONSTRAINT envs_step_id_name_key UNIQUE (step_id, name);
ALTER TABLE ONLY simpipe.envs
    ADD CONSTRAINT envs_step_id_fkey FOREIGN KEY (step_id) REFERENCES simpipe.steps(step_id)
    ON UPDATE CASCADE ON DELETE CASCADE;

-- Logs
CREATE TABLE simpipe.logs (
    step_id uuid NOT NULL PRIMARY KEY,
    text text DEFAULT ''::text NOT NULL
);
COMMENT ON TABLE simpipe.logs IS 'Logs of the runs';
COMMENT ON COLUMN simpipe.logs.step_id IS 'UUID of the step, must exist in the steps table';
COMMENT ON COLUMN simpipe.logs.text IS 'Text of the log';
ALTER TABLE ONLY simpipe.logs
    ADD CONSTRAINT logs_step_id_fkey FOREIGN KEY (step_id) REFERENCES simpipe.steps(step_id) ON UPDATE CASCADE ON DELETE CASCADE;

-- CPU view
CREATE VIEW simpipe.cpu AS
SELECT data."time",
      data.value,
      series.container_label_user_id as user_id,
      series.container_label_simulation_id as simulation_id,
      series.container_label_run_id as run_id,
      series.container_label_step_id as step_id
      FROM prom_data.container_cpu_user_seconds_total as data
      LEFT JOIN prom_series.container_cpu_user_seconds_total as series
        ON series.series_id = data.series_id;

-- Memory view
CREATE VIEW simpipe.memory_usage_bytes AS
SELECT data."time",
      data.value,
      series.container_label_user_id as user_id,
      series.container_label_simulation_id as simulation_id,
      series.container_label_run_id as run_id,
      series.container_label_step_id as step_id
      FROM prom_data.container_memory_usage_bytes as data
      LEFT JOIN prom_series.container_memory_usage_bytes as series
        ON series.series_id = data.series_id;

-- Memory max usage view
CREATE VIEW simpipe.memory_max_usage_bytes AS
SELECT data."time",
      data.value,
      series.container_label_user_id as user_id,
      series.container_label_simulation_id as simulation_id,
      series.container_label_run_id as run_id,
      series.container_label_step_id as step_id
      FROM prom_data.container_memory_max_usage_bytes as data
      LEFT JOIN prom_series.container_memory_max_usage_bytes as series
        ON series.series_id = data.series_id;

-- Network received bytes view
CREATE VIEW simpipe.network_received_bytes AS
SELECT data."time",
      data.value,
      series.container_label_user_id as user_id,
      series.container_label_simulation_id as simulation_id,
      series.container_label_run_id as run_id,
      series.container_label_step_id as step_id
      FROM prom_data.container_network_receive_bytes_total as data
      LEFT JOIN prom_series.container_network_receive_bytes_total as series
        ON series.series_id = data.series_id;

-- Network transmit bytes view
CREATE VIEW simpipe.network_transmit_bytes AS
SELECT data."time",
      data.value,
      series.container_label_user_id as user_id,
      series.container_label_simulation_id as simulation_id,
      series.container_label_run_id as run_id,
      series.container_label_step_id as step_id
      FROM prom_data.container_network_transmit_bytes_total as data
      LEFT JOIN prom_series.container_network_transmit_bytes_total as series
        ON series.series_id = data.series_id;

-- Network fs reads merged view
CREATE VIEW simpipe.fs_reads_merged AS
SELECT data."time",
      data.value,
      series.container_label_user_id as user_id,
      series.container_label_simulation_id as simulation_id,
      series.container_label_run_id as run_id,
      series.container_label_step_id as step_id
      FROM prom_data.container_fs_reads_merged_total as data
      LEFT JOIN prom_series.container_fs_reads_merged_total as series
        ON series.series_id = data.series_id;

-- Network fs writes merged view
CREATE VIEW simpipe.fs_writes_merged AS
SELECT data."time",
      data.value,
      series.container_label_user_id as user_id,
      series.container_label_simulation_id as simulation_id,
      series.container_label_run_id as run_id,
      series.container_label_step_id as step_id
      FROM prom_data.container_fs_writes_merged_total as data
      LEFT JOIN prom_series.container_fs_writes_merged_total as series
        ON series.series_id = data.series_id;