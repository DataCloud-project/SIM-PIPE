ALTER TABLE simpipe.runs DROP CONSTRAINT "ended started constraint";

ALTER TABLE simpipe.runs ALTER COLUMN status TYPE text;
ALTER TABLE simpipe.steps ALTER COLUMN status TYPE text;

ALTER TABLE simpipe.runs ALTER COLUMN status SET DEFAULT 'waiting';
ALTER TABLE simpipe.steps ALTER COLUMN status SET DEFAULT 'waiting';

DROP TYPE simpipe.run_status;
DROP TYPE simpipe.step_status;

ALTER TABLE simpipe.runs ADD CONSTRAINT "ended started constraint" CHECK (
  (status = 'waiting' AND (started IS NULL) AND (ended IS NULL)) OR 
  (status = 'active' AND (started IS NOT NULL) AND (ended IS NULL)) OR
  (status = 'completed' AND (started IS NOT NULL) AND (ended IS NOT NULL)) OR
  ((status = 'failed' OR status = 'cancelled') AND
    ((ended IS NULL) OR (started IS NOT NULL))));

ALTER TABLE simpipe.steps ADD CONSTRAINT "ended started constraint" CHECK (
  (status = 'waiting' AND (started IS NULL) AND (ended IS NULL)) OR 
  (status = 'active' AND (started IS NOT NULL) AND (ended IS NULL)) OR
  (status = 'completed' AND (started IS NOT NULL) AND (ended IS NOT NULL)) OR
  ((status = 'failed' OR status = 'cancelled') AND
    ((ended IS NULL) OR (started IS NOT NULL))));

CREATE TABLE simpipe.run_status (
  value text PRIMARY KEY
);

INSERT INTO simpipe.run_status (value) VALUES
  ('waiting'),
  ('active'),
  ('completed'),
  ('failed'),
  ('queued'),
  ('cancelled');

CREATE TABLE simpipe.step_status (
  value text PRIMARY KEY
);

INSERT INTO simpipe.step_status (value) VALUES
  ('waiting'),
  ('active'),
  ('completed'),
  ('failed'),
  ('cancelled');

ALTER TABLE simpipe.runs ADD CONSTRAINT
  run_status_fkey FOREIGN KEY (status) REFERENCES simpipe.run_status;

ALTER TABLE simpipe.steps ADD CONSTRAINT
  run_status_fkey FOREIGN KEY (status) REFERENCES simpipe.step_status;
