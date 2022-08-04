comment on column "simpipe"."runs"."env_list" is E'Simulation run';
alter table "simpipe"."runs" alter column "env_list" drop not null;
alter table "simpipe"."runs" add column "env_list" _text;
