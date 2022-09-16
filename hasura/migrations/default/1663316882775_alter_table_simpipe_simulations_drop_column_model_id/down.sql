comment on column "simpipe"."simulations"."model_id" is E'Simulations';
alter table "simpipe"."simulations" add constraint "simulations_modelId_key" unique (model_id);
alter table "simpipe"."simulations" alter column "model_id" drop not null;
alter table "simpipe"."simulations" add column "model_id" uuid;
