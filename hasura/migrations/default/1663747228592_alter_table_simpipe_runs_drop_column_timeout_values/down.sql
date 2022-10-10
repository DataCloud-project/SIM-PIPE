comment on column "simpipe"."runs"."timeout_values" is E'Simulation run';
alter table "simpipe"."runs" alter column "timeout_values" drop not null;
alter table "simpipe"."runs" add column "timeout_values" _int4;
