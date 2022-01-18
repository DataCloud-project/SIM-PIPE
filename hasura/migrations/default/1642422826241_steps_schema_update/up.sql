
alter table "simpipe"."steps" add column "image" text not null;

alter table "simpipe"."steps" add column "pipeline_step_number" Integer not null;

alter table "simpipe"."steps" add constraint "steps_pipeline_step_number_run_id_key" unique ("pipeline_step_number", "run_id");