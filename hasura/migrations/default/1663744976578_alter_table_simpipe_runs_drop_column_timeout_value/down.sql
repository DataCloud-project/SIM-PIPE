comment on column "simpipe"."runs"."timeout_value" is E'Simulation run';
alter table "simpipe"."runs" alter column "timeout_value" set default 0;
alter table "simpipe"."runs" alter column "timeout_value" drop not null;
alter table "simpipe"."runs" add column "timeout_value" int4;
