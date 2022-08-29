comment on column "simpipe"."runs"."dsl" is E'Simulation run';
alter table "simpipe"."runs" alter column "dsl" drop not null;
alter table "simpipe"."runs" add column "dsl" jsonb;
