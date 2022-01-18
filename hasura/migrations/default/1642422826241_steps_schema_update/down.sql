
alter table "simpipe"."steps" drop constraint "steps_pipeline_step_number_run_id_key";
alter table "simpipe"."steps" drop column "pipeline_step_number";
alter table "simpipe"."steps" drop column "image";