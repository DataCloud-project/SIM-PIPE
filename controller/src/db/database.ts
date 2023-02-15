import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  float8: number;
  json: string;
  jsonb: unknown;
  timestamp: string;
  timestamptz: string;
  uuid: string;
};

/**  The input data to create a run  */
export type CreateRunInput = {
  /**  An optional list of environment variables to set for the steps of the run container  */
  environmentVariables?: InputMaybe<Array<StepEnvironmentVariable>>;
  /**  The name of the run  */
  name: Scalars['String'];
  /**
   *  The simulation to which this run belongs.
   *
   * The user must own the simulation.
   */
  simulationId: Scalars['uuid'];
  /**  An optional list of timeouts to set for the steps of the run container  */
  timeouts?: InputMaybe<Array<StepTimeout>>;
};

export type CreateSimulationInput = {
  /**  The name of the simulation  */
  name: Scalars['String'];
  /**
   *  The description of the simulation pipeline.
   *
   * It is a JSON document but it must be sent as a string,
   * because not all GraphQL clients support sending JSON documents
   * in input variables.
   */
  pipelineDescription: Scalars['json'];
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8ComparisonExp = {
  _eq?: InputMaybe<Scalars['float8']>;
  _gt?: InputMaybe<Scalars['float8']>;
  _gte?: InputMaybe<Scalars['float8']>;
  _in?: InputMaybe<Array<Scalars['float8']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['float8']>;
  _lte?: InputMaybe<Scalars['float8']>;
  _neq?: InputMaybe<Scalars['float8']>;
  _nin?: InputMaybe<Array<Scalars['float8']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

export type JsonbCastExp = {
  String?: InputMaybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast?: InputMaybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _containedIn?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _hasKey?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _hasKeysAll?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _hasKeysAny?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  Asc = 'ASC',
  /** in ascending order, nulls first */
  AscNullsFirst = 'ASC_NULLS_FIRST',
  /** in ascending order, nulls last */
  AscNullsLast = 'ASC_NULLS_LAST',
  /** in descending order, nulls first */
  Desc = 'DESC',
  /** in descending order, nulls first */
  DescNullsFirst = 'DESC_NULLS_FIRST',
  /** in descending order, nulls last */
  DescNullsLast = 'DESC_NULLS_LAST'
}

export type Run = {
  __typename?: 'Run';
  run?: Maybe<Runs>;
  /**  UUID of the run  */
  runId: Scalars['uuid'];
};

/** Environment variables in runs */
export type SimpipeEnvs = {
  __typename?: 'SimpipeEnvs';
  /** UUID of the env, random by default */
  envId: Scalars['uuid'];
  /** Name of the env, it is unique per step */
  name: Scalars['String'];
  /** An object relationship */
  step: Steps;
  /** UUID of the step, must exist in the steps table */
  stepId: Scalars['uuid'];
  /** Value of the env */
  value: Scalars['String'];
};

/** aggregated selection of "simpipe.envs" */
export type SimpipeEnvsAggregate = {
  __typename?: 'SimpipeEnvsAggregate';
  aggregate?: Maybe<SimpipeEnvsAggregateFields>;
  nodes: Array<SimpipeEnvs>;
};

/** aggregate fields of "simpipe.envs" */
export type SimpipeEnvsAggregateFields = {
  __typename?: 'SimpipeEnvsAggregateFields';
  count: Scalars['Int'];
  max?: Maybe<SimpipeEnvsMaxFields>;
  min?: Maybe<SimpipeEnvsMinFields>;
};


/** aggregate fields of "simpipe.envs" */
export type SimpipeEnvsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.envs" */
export type SimpipeEnvsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<Simpipe_Envs_Max_Order_By>;
  min?: InputMaybe<Simpipe_Envs_Min_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.envs" */
export type SimpipeEnvsArrRelInsertInput = {
  data: Array<SimpipeEnvsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<SimpipeEnvsOnConflict>;
};

/** Boolean expression to filter rows from the table "simpipe.envs". All fields are combined with a logical 'AND'. */
export type SimpipeEnvsBoolExp = {
  _and?: InputMaybe<Array<SimpipeEnvsBoolExp>>;
  _not?: InputMaybe<SimpipeEnvsBoolExp>;
  _or?: InputMaybe<Array<SimpipeEnvsBoolExp>>;
  envId?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<UuidComparisonExp>;
  value?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.envs" */
export enum SimpipeEnvsConstraint {
  /** unique or primary key constraint on columns "env_id" */
  EnvsPkey = 'envs_pkey',
  /** unique or primary key constraint on columns "name", "step_id" */
  EnvsStepIdNameKey = 'envs_step_id_name_key'
}

/** input type for inserting data into table "simpipe.envs" */
export type SimpipeEnvsInsertInput = {
  /** UUID of the env, random by default */
  envId?: InputMaybe<Scalars['uuid']>;
  /** Name of the env, it is unique per step */
  name?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Value of the env */
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimpipeEnvsMaxFields = {
  __typename?: 'SimpipeEnvsMaxFields';
  /** UUID of the env, random by default */
  envId?: Maybe<Scalars['uuid']>;
  /** Name of the env, it is unique per step */
  name?: Maybe<Scalars['String']>;
  /** UUID of the step, must exist in the steps table */
  stepId?: Maybe<Scalars['uuid']>;
  /** Value of the env */
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimpipeEnvsMinFields = {
  __typename?: 'SimpipeEnvsMinFields';
  /** UUID of the env, random by default */
  envId?: Maybe<Scalars['uuid']>;
  /** Name of the env, it is unique per step */
  name?: Maybe<Scalars['String']>;
  /** UUID of the step, must exist in the steps table */
  stepId?: Maybe<Scalars['uuid']>;
  /** Value of the env */
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "simpipe.envs" */
export type SimpipeEnvsMutationResponse = {
  __typename?: 'SimpipeEnvsMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<SimpipeEnvs>;
};

/** on_conflict condition type for table "simpipe.envs" */
export type SimpipeEnvsOnConflict = {
  constraint: SimpipeEnvsConstraint;
  update_columns?: Array<SimpipeEnvsUpdateColumn>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};

/** Ordering options when selecting data from "simpipe.envs". */
export type SimpipeEnvsOrderBy = {
  envId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.envs */
export type SimpipeEnvsPkColumnsInput = {
  /** UUID of the env, random by default */
  envId: Scalars['uuid'];
};

/** select columns of table "simpipe.envs" */
export enum SimpipeEnvsSelectColumn {
  /** column name */
  EnvId = 'envId',
  /** column name */
  Name = 'name',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "simpipe.envs" */
export type SimpipeEnvsSetInput = {
  /** UUID of the env, random by default */
  envId?: InputMaybe<Scalars['uuid']>;
  /** Name of the env, it is unique per step */
  name?: InputMaybe<Scalars['String']>;
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Value of the env */
  value?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "simpipe_envs" */
export type SimpipeEnvsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SimpipeEnvsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SimpipeEnvsStreamCursorValueInput = {
  /** UUID of the env, random by default */
  envId?: InputMaybe<Scalars['uuid']>;
  /** Name of the env, it is unique per step */
  name?: InputMaybe<Scalars['String']>;
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Value of the env */
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "simpipe.envs" */
export enum SimpipeEnvsUpdateColumn {
  /** column name */
  EnvId = 'envId',
  /** column name */
  Name = 'name',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Value = 'value'
}

export type SimpipeEnvsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimpipeEnvsSetInput>;
  /** filter the rows which have to be updated */
  where: SimpipeEnvsBoolExp;
};

/** Logs of the runs */
export type SimpipeLogs = {
  __typename?: 'SimpipeLogs';
  /** An object relationship */
  step: Steps;
  /** UUID of the step, must exist in the steps table */
  stepId: Scalars['uuid'];
  /** Text of the log */
  text: Scalars['String'];
};

/** aggregated selection of "simpipe.logs" */
export type SimpipeLogsAggregate = {
  __typename?: 'SimpipeLogsAggregate';
  aggregate?: Maybe<SimpipeLogsAggregateFields>;
  nodes: Array<SimpipeLogs>;
};

/** aggregate fields of "simpipe.logs" */
export type SimpipeLogsAggregateFields = {
  __typename?: 'SimpipeLogsAggregateFields';
  count: Scalars['Int'];
  max?: Maybe<SimpipeLogsMaxFields>;
  min?: Maybe<SimpipeLogsMinFields>;
};


/** aggregate fields of "simpipe.logs" */
export type SimpipeLogsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "simpipe.logs". All fields are combined with a logical 'AND'. */
export type SimpipeLogsBoolExp = {
  _and?: InputMaybe<Array<SimpipeLogsBoolExp>>;
  _not?: InputMaybe<SimpipeLogsBoolExp>;
  _or?: InputMaybe<Array<SimpipeLogsBoolExp>>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<UuidComparisonExp>;
  text?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.logs" */
export enum SimpipeLogsConstraint {
  /** unique or primary key constraint on columns "step_id" */
  LogsPkey = 'logs_pkey'
}

/** input type for inserting data into table "simpipe.logs" */
export type SimpipeLogsInsertInput = {
  step?: InputMaybe<StepsObjRelInsertInput>;
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Text of the log */
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimpipeLogsMaxFields = {
  __typename?: 'SimpipeLogsMaxFields';
  /** UUID of the step, must exist in the steps table */
  stepId?: Maybe<Scalars['uuid']>;
  /** Text of the log */
  text?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimpipeLogsMinFields = {
  __typename?: 'SimpipeLogsMinFields';
  /** UUID of the step, must exist in the steps table */
  stepId?: Maybe<Scalars['uuid']>;
  /** Text of the log */
  text?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "simpipe.logs" */
export type SimpipeLogsMutationResponse = {
  __typename?: 'SimpipeLogsMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<SimpipeLogs>;
};

/** input type for inserting object relation for remote table "simpipe.logs" */
export type SimpipeLogsObjRelInsertInput = {
  data: SimpipeLogsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<SimpipeLogsOnConflict>;
};

/** on_conflict condition type for table "simpipe.logs" */
export type SimpipeLogsOnConflict = {
  constraint: SimpipeLogsConstraint;
  update_columns?: Array<SimpipeLogsUpdateColumn>;
  where?: InputMaybe<SimpipeLogsBoolExp>;
};

/** Ordering options when selecting data from "simpipe.logs". */
export type SimpipeLogsOrderBy = {
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  text?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.logs */
export type SimpipeLogsPkColumnsInput = {
  /** UUID of the step, must exist in the steps table */
  stepId: Scalars['uuid'];
};

/** select columns of table "simpipe.logs" */
export enum SimpipeLogsSelectColumn {
  /** column name */
  StepId = 'stepId',
  /** column name */
  Text = 'text'
}

/** input type for updating data in table "simpipe.logs" */
export type SimpipeLogsSetInput = {
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Text of the log */
  text?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "simpipe_logs" */
export type SimpipeLogsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SimpipeLogsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SimpipeLogsStreamCursorValueInput = {
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Text of the log */
  text?: InputMaybe<Scalars['String']>;
};

/** update columns of table "simpipe.logs" */
export enum SimpipeLogsUpdateColumn {
  /** column name */
  StepId = 'stepId',
  /** column name */
  Text = 'text'
}

export type SimpipeLogsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimpipeLogsSetInput>;
  /** filter the rows which have to be updated */
  where: SimpipeLogsBoolExp;
};

/** Status of a run */
export type SimpipeRunStatus = {
  __typename?: 'SimpipeRunStatus';
  value: Scalars['String'];
};

/** aggregated selection of "simpipe.run_status" */
export type SimpipeRunStatusAggregate = {
  __typename?: 'SimpipeRunStatusAggregate';
  aggregate?: Maybe<SimpipeRunStatusAggregateFields>;
  nodes: Array<SimpipeRunStatus>;
};

/** aggregate fields of "simpipe.run_status" */
export type SimpipeRunStatusAggregateFields = {
  __typename?: 'SimpipeRunStatusAggregateFields';
  count: Scalars['Int'];
  max?: Maybe<SimpipeRunStatusMaxFields>;
  min?: Maybe<SimpipeRunStatusMinFields>;
};


/** aggregate fields of "simpipe.run_status" */
export type SimpipeRunStatusAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeRunStatusSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "simpipe.run_status". All fields are combined with a logical 'AND'. */
export type SimpipeRunStatusBoolExp = {
  _and?: InputMaybe<Array<SimpipeRunStatusBoolExp>>;
  _not?: InputMaybe<SimpipeRunStatusBoolExp>;
  _or?: InputMaybe<Array<SimpipeRunStatusBoolExp>>;
  value?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.run_status" */
export enum SimpipeRunStatusConstraint {
  /** unique or primary key constraint on columns "value" */
  RunStatusPkey = 'run_status_pkey'
}

export enum SimpipeRunStatusEnum {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Queued = 'QUEUED',
  Waiting = 'WAITING'
}

/** Boolean expression to compare columns of type "SimpipeRunStatusEnum". All fields are combined with logical 'AND'. */
export type SimpipeRunStatusEnumComparisonExp = {
  _eq?: InputMaybe<SimpipeRunStatusEnum>;
  _in?: InputMaybe<Array<SimpipeRunStatusEnum>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<SimpipeRunStatusEnum>;
  _nin?: InputMaybe<Array<SimpipeRunStatusEnum>>;
};

/** input type for inserting data into table "simpipe.run_status" */
export type SimpipeRunStatusInsertInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimpipeRunStatusMaxFields = {
  __typename?: 'SimpipeRunStatusMaxFields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimpipeRunStatusMinFields = {
  __typename?: 'SimpipeRunStatusMinFields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "simpipe.run_status" */
export type SimpipeRunStatusMutationResponse = {
  __typename?: 'SimpipeRunStatusMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<SimpipeRunStatus>;
};

/** on_conflict condition type for table "simpipe.run_status" */
export type SimpipeRunStatusOnConflict = {
  constraint: SimpipeRunStatusConstraint;
  update_columns?: Array<SimpipeRunStatusUpdateColumn>;
  where?: InputMaybe<SimpipeRunStatusBoolExp>;
};

/** Ordering options when selecting data from "simpipe.run_status". */
export type SimpipeRunStatusOrderBy = {
  value?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.run_status */
export type SimpipeRunStatusPkColumnsInput = {
  value: Scalars['String'];
};

/** select columns of table "simpipe.run_status" */
export enum SimpipeRunStatusSelectColumn {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "simpipe.run_status" */
export type SimpipeRunStatusSetInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "simpipe_run_status" */
export type SimpipeRunStatusStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SimpipeRunStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SimpipeRunStatusStreamCursorValueInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "simpipe.run_status" */
export enum SimpipeRunStatusUpdateColumn {
  /** column name */
  Value = 'value'
}

export type SimpipeRunStatusUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimpipeRunStatusSetInput>;
  /** filter the rows which have to be updated */
  where: SimpipeRunStatusBoolExp;
};

/** Status of a step */
export type SimpipeStepStatus = {
  __typename?: 'SimpipeStepStatus';
  value: Scalars['String'];
};

/** aggregated selection of "simpipe.step_status" */
export type SimpipeStepStatusAggregate = {
  __typename?: 'SimpipeStepStatusAggregate';
  aggregate?: Maybe<SimpipeStepStatusAggregateFields>;
  nodes: Array<SimpipeStepStatus>;
};

/** aggregate fields of "simpipe.step_status" */
export type SimpipeStepStatusAggregateFields = {
  __typename?: 'SimpipeStepStatusAggregateFields';
  count: Scalars['Int'];
  max?: Maybe<SimpipeStepStatusMaxFields>;
  min?: Maybe<SimpipeStepStatusMinFields>;
};


/** aggregate fields of "simpipe.step_status" */
export type SimpipeStepStatusAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeStepStatusSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "simpipe.step_status". All fields are combined with a logical 'AND'. */
export type SimpipeStepStatusBoolExp = {
  _and?: InputMaybe<Array<SimpipeStepStatusBoolExp>>;
  _not?: InputMaybe<SimpipeStepStatusBoolExp>;
  _or?: InputMaybe<Array<SimpipeStepStatusBoolExp>>;
  value?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.step_status" */
export enum SimpipeStepStatusConstraint {
  /** unique or primary key constraint on columns "value" */
  StepStatusPkey = 'step_status_pkey'
}

export enum SimpipeStepStatusEnum {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Waiting = 'WAITING'
}

/** Boolean expression to compare columns of type "SimpipeStepStatusEnum". All fields are combined with logical 'AND'. */
export type SimpipeStepStatusEnumComparisonExp = {
  _eq?: InputMaybe<SimpipeStepStatusEnum>;
  _in?: InputMaybe<Array<SimpipeStepStatusEnum>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<SimpipeStepStatusEnum>;
  _nin?: InputMaybe<Array<SimpipeStepStatusEnum>>;
};

/** input type for inserting data into table "simpipe.step_status" */
export type SimpipeStepStatusInsertInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimpipeStepStatusMaxFields = {
  __typename?: 'SimpipeStepStatusMaxFields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimpipeStepStatusMinFields = {
  __typename?: 'SimpipeStepStatusMinFields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "simpipe.step_status" */
export type SimpipeStepStatusMutationResponse = {
  __typename?: 'SimpipeStepStatusMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<SimpipeStepStatus>;
};

/** on_conflict condition type for table "simpipe.step_status" */
export type SimpipeStepStatusOnConflict = {
  constraint: SimpipeStepStatusConstraint;
  update_columns?: Array<SimpipeStepStatusUpdateColumn>;
  where?: InputMaybe<SimpipeStepStatusBoolExp>;
};

/** Ordering options when selecting data from "simpipe.step_status". */
export type SimpipeStepStatusOrderBy = {
  value?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.step_status */
export type SimpipeStepStatusPkColumnsInput = {
  value: Scalars['String'];
};

/** select columns of table "simpipe.step_status" */
export enum SimpipeStepStatusSelectColumn {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "simpipe.step_status" */
export type SimpipeStepStatusSetInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "simpipe_step_status" */
export type SimpipeStepStatusStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SimpipeStepStatusStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SimpipeStepStatusStreamCursorValueInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "simpipe.step_status" */
export enum SimpipeStepStatusUpdateColumn {
  /** column name */
  Value = 'value'
}

export type SimpipeStepStatusUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimpipeStepStatusSetInput>;
  /** filter the rows which have to be updated */
  where: SimpipeStepStatusBoolExp;
};

export type Simulation = {
  __typename?: 'Simulation';
  simulation?: Maybe<Simulations>;
  /**  UUID of the simulation  */
  simulationId: Scalars['uuid'];
};

export type StepEnvironmentVariable = {
  /**  The name of the environment variable  */
  name: Scalars['String'];
  /**  The name of the step to set the environment variable for  */
  stepName: Scalars['String'];
  /**  The value of the environment variable  */
  value: Scalars['String'];
};

export type StepTimeout = {
  /**  The name of the step to set the timeout for  */
  stepName: Scalars['String'];
  /**  The timeout in seconds, must be greater than 0 and less than 86400 (24 hours)  */
  timeout: Scalars['Int'];
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type TimestampComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

/** columns and relationships of "simpipe.cpu" */
export type Cpu = {
  __typename?: 'cpu';
  /** An object relationship */
  run?: Maybe<Runs>;
  runId?: Maybe<Scalars['String']>;
  /** An object relationship */
  simulation?: Maybe<Simulations>;
  simulationId?: Maybe<Scalars['String']>;
  /** An object relationship */
  step?: Maybe<Steps>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.cpu" */
export type CpuAggregate = {
  __typename?: 'cpuAggregate';
  aggregate?: Maybe<CpuAggregateFields>;
  nodes: Array<Cpu>;
};

/** aggregate fields of "simpipe.cpu" */
export type CpuAggregateFields = {
  __typename?: 'cpuAggregateFields';
  avg?: Maybe<CpuAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<CpuMaxFields>;
  min?: Maybe<CpuMinFields>;
  stddev?: Maybe<CpuStddevFields>;
  stddevPop?: Maybe<CpuStddev_PopFields>;
  stddevSamp?: Maybe<CpuStddev_SampFields>;
  sum?: Maybe<CpuSumFields>;
  varPop?: Maybe<CpuVar_PopFields>;
  varSamp?: Maybe<CpuVar_SampFields>;
  variance?: Maybe<CpuVarianceFields>;
};


/** aggregate fields of "simpipe.cpu" */
export type CpuAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CpuSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.cpu" */
export type CpuAggregateOrderBy = {
  avg?: InputMaybe<Cpu_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<Cpu_Max_Order_By>;
  min?: InputMaybe<Cpu_Min_Order_By>;
  stddev?: InputMaybe<Cpu_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cpu_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cpu_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cpu_Sum_Order_By>;
  var_pop?: InputMaybe<Cpu_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cpu_Var_Samp_Order_By>;
  variance?: InputMaybe<Cpu_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.cpu" */
export type CpuArrRelInsertInput = {
  data: Array<CpuInsertInput>;
};

/** aggregate avg on columns */
export type CpuAvgFields = {
  __typename?: 'cpuAvgFields';
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.cpu". All fields are combined with a logical 'AND'. */
export type CpuBoolExp = {
  _and?: InputMaybe<Array<CpuBoolExp>>;
  _not?: InputMaybe<CpuBoolExp>;
  _or?: InputMaybe<Array<CpuBoolExp>>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<StringComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** input type for inserting data into table "simpipe.cpu" */
export type CpuInsertInput = {
  run?: InputMaybe<RunsObjRelInsertInput>;
  runId?: InputMaybe<Scalars['String']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  simulationId?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate max on columns */
export type CpuMaxFields = {
  __typename?: 'cpuMaxFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type CpuMinFields = {
  __typename?: 'cpuMinFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.cpu". */
export type CpuOrderBy = {
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.cpu" */
export enum CpuSelectColumn {
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  UserId = 'userId',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type CpuStddevFields = {
  __typename?: 'cpuStddevFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type CpuStddev_PopFields = {
  __typename?: 'cpuStddev_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type CpuStddev_SampFields = {
  __typename?: 'cpuStddev_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "cpu" */
export type CpuStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: CpuStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CpuStreamCursorValueInput = {
  runId?: InputMaybe<Scalars['String']>;
  simulationId?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type CpuSumFields = {
  __typename?: 'cpuSumFields';
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type CpuVar_PopFields = {
  __typename?: 'cpuVar_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type CpuVar_SampFields = {
  __typename?: 'cpuVar_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type CpuVarianceFields = {
  __typename?: 'cpuVarianceFields';
  value?: Maybe<Scalars['Float']>;
};

export type Cpu_Aggregate_Bool_Exp = {
  avg?: InputMaybe<Cpu_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<Cpu_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<Cpu_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<Cpu_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<Cpu_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<Cpu_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<Cpu_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<Cpu_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<Cpu_Aggregate_Bool_Exp_Var_Samp>;
};

export type Cpu_Aggregate_Bool_Exp_Avg = {
  arguments: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Corr = {
  arguments: Cpu_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Corr_Arguments = {
  X: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type Cpu_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<CpuSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: IntComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: Cpu_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type Cpu_Aggregate_Bool_Exp_Max = {
  arguments: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Min = {
  arguments: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Sum = {
  arguments: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

export type Cpu_Aggregate_Bool_Exp_Var_Samp = {
  arguments: Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<CpuBoolExp>;
  predicate: Float8ComparisonExp;
};

/** order by avg() on columns of table "simpipe.cpu" */
export type Cpu_Avg_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.cpu" */
export type Cpu_Max_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.cpu" */
export type Cpu_Min_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select "cpu_aggregate_bool_exp_avg_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Avg_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "cpu_aggregate_bool_exp_corr_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Corr_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "cpu_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "cpu_aggregate_bool_exp_max_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Max_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "cpu_aggregate_bool_exp_min_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Min_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "cpu_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "cpu_aggregate_bool_exp_sum_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Sum_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "cpu_aggregate_bool_exp_var_samp_arguments_columns" columns of table "simpipe.cpu" */
export enum Cpu_Select_Column_Cpu_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** order by stddev() on columns of table "simpipe.cpu" */
export type Cpu_Stddev_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.cpu" */
export type Cpu_Stddev_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.cpu" */
export type Cpu_Stddev_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.cpu" */
export type Cpu_Sum_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.cpu" */
export type Cpu_Var_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.cpu" */
export type Cpu_Var_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.cpu" */
export type Cpu_Variance_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** columns and relationships of "simpipe.fs_reads_merged" */
export type FsReadsMerged = {
  __typename?: 'fsReadsMerged';
  /** An object relationship */
  run?: Maybe<Runs>;
  runId?: Maybe<Scalars['String']>;
  /** An object relationship */
  simulation?: Maybe<Simulations>;
  simulationId?: Maybe<Scalars['String']>;
  /** An object relationship */
  step?: Maybe<Steps>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.fs_reads_merged" */
export type FsReadsMergedAggregate = {
  __typename?: 'fsReadsMergedAggregate';
  aggregate?: Maybe<FsReadsMergedAggregateFields>;
  nodes: Array<FsReadsMerged>;
};

/** aggregate fields of "simpipe.fs_reads_merged" */
export type FsReadsMergedAggregateFields = {
  __typename?: 'fsReadsMergedAggregateFields';
  avg?: Maybe<FsReadsMergedAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<FsReadsMergedMaxFields>;
  min?: Maybe<FsReadsMergedMinFields>;
  stddev?: Maybe<FsReadsMergedStddevFields>;
  stddevPop?: Maybe<FsReadsMergedStddev_PopFields>;
  stddevSamp?: Maybe<FsReadsMergedStddev_SampFields>;
  sum?: Maybe<FsReadsMergedSumFields>;
  varPop?: Maybe<FsReadsMergedVar_PopFields>;
  varSamp?: Maybe<FsReadsMergedVar_SampFields>;
  variance?: Maybe<FsReadsMergedVarianceFields>;
};


/** aggregate fields of "simpipe.fs_reads_merged" */
export type FsReadsMergedAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.fs_reads_merged" */
export type FsReadsMergedAggregateOrderBy = {
  avg?: InputMaybe<FsReadsMerged_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<FsReadsMerged_Max_Order_By>;
  min?: InputMaybe<FsReadsMerged_Min_Order_By>;
  stddev?: InputMaybe<FsReadsMerged_Stddev_Order_By>;
  stddev_pop?: InputMaybe<FsReadsMerged_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<FsReadsMerged_Stddev_Samp_Order_By>;
  sum?: InputMaybe<FsReadsMerged_Sum_Order_By>;
  var_pop?: InputMaybe<FsReadsMerged_Var_Pop_Order_By>;
  var_samp?: InputMaybe<FsReadsMerged_Var_Samp_Order_By>;
  variance?: InputMaybe<FsReadsMerged_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.fs_reads_merged" */
export type FsReadsMergedArrRelInsertInput = {
  data: Array<FsReadsMergedInsertInput>;
};

/** aggregate avg on columns */
export type FsReadsMergedAvgFields = {
  __typename?: 'fsReadsMergedAvgFields';
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.fs_reads_merged". All fields are combined with a logical 'AND'. */
export type FsReadsMergedBoolExp = {
  _and?: InputMaybe<Array<FsReadsMergedBoolExp>>;
  _not?: InputMaybe<FsReadsMergedBoolExp>;
  _or?: InputMaybe<Array<FsReadsMergedBoolExp>>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<StringComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** input type for inserting data into table "simpipe.fs_reads_merged" */
export type FsReadsMergedInsertInput = {
  run?: InputMaybe<RunsObjRelInsertInput>;
  runId?: InputMaybe<Scalars['String']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  simulationId?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate max on columns */
export type FsReadsMergedMaxFields = {
  __typename?: 'fsReadsMergedMaxFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type FsReadsMergedMinFields = {
  __typename?: 'fsReadsMergedMinFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.fs_reads_merged". */
export type FsReadsMergedOrderBy = {
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMergedSelectColumn {
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  UserId = 'userId',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type FsReadsMergedStddevFields = {
  __typename?: 'fsReadsMergedStddevFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type FsReadsMergedStddev_PopFields = {
  __typename?: 'fsReadsMergedStddev_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type FsReadsMergedStddev_SampFields = {
  __typename?: 'fsReadsMergedStddev_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "fsReadsMerged" */
export type FsReadsMergedStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: FsReadsMergedStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FsReadsMergedStreamCursorValueInput = {
  runId?: InputMaybe<Scalars['String']>;
  simulationId?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type FsReadsMergedSumFields = {
  __typename?: 'fsReadsMergedSumFields';
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type FsReadsMergedVar_PopFields = {
  __typename?: 'fsReadsMergedVar_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type FsReadsMergedVar_SampFields = {
  __typename?: 'fsReadsMergedVar_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type FsReadsMergedVarianceFields = {
  __typename?: 'fsReadsMergedVarianceFields';
  value?: Maybe<Scalars['Float']>;
};

export type FsReadsMerged_Aggregate_Bool_Exp = {
  avg?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp_Var_Samp>;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Avg = {
  arguments: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Corr = {
  arguments: FsReadsMerged_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Corr_Arguments = {
  X: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: IntComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: FsReadsMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Max = {
  arguments: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Min = {
  arguments: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Sum = {
  arguments: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsReadsMerged_Aggregate_Bool_Exp_Var_Samp = {
  arguments: FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsReadsMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

/** order by avg() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Avg_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Max_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Min_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select "fsReadsMerged_aggregate_bool_exp_avg_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Avg_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsReadsMerged_aggregate_bool_exp_corr_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Corr_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsReadsMerged_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsReadsMerged_aggregate_bool_exp_max_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Max_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsReadsMerged_aggregate_bool_exp_min_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Min_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsReadsMerged_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsReadsMerged_aggregate_bool_exp_sum_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Sum_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsReadsMerged_aggregate_bool_exp_var_samp_arguments_columns" columns of table "simpipe.fs_reads_merged" */
export enum FsReadsMerged_Select_Column_FsReadsMerged_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** order by stddev() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Stddev_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Stddev_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Stddev_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Sum_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Var_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Var_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.fs_reads_merged" */
export type FsReadsMerged_Variance_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** columns and relationships of "simpipe.fs_writes_merged" */
export type FsWritesMerged = {
  __typename?: 'fsWritesMerged';
  /** An object relationship */
  run?: Maybe<Runs>;
  runId?: Maybe<Scalars['String']>;
  /** An object relationship */
  simulation?: Maybe<Simulations>;
  simulationId?: Maybe<Scalars['String']>;
  /** An object relationship */
  step?: Maybe<Steps>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.fs_writes_merged" */
export type FsWritesMergedAggregate = {
  __typename?: 'fsWritesMergedAggregate';
  aggregate?: Maybe<FsWritesMergedAggregateFields>;
  nodes: Array<FsWritesMerged>;
};

/** aggregate fields of "simpipe.fs_writes_merged" */
export type FsWritesMergedAggregateFields = {
  __typename?: 'fsWritesMergedAggregateFields';
  avg?: Maybe<FsWritesMergedAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<FsWritesMergedMaxFields>;
  min?: Maybe<FsWritesMergedMinFields>;
  stddev?: Maybe<FsWritesMergedStddevFields>;
  stddevPop?: Maybe<FsWritesMergedStddev_PopFields>;
  stddevSamp?: Maybe<FsWritesMergedStddev_SampFields>;
  sum?: Maybe<FsWritesMergedSumFields>;
  varPop?: Maybe<FsWritesMergedVar_PopFields>;
  varSamp?: Maybe<FsWritesMergedVar_SampFields>;
  variance?: Maybe<FsWritesMergedVarianceFields>;
};


/** aggregate fields of "simpipe.fs_writes_merged" */
export type FsWritesMergedAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.fs_writes_merged" */
export type FsWritesMergedAggregateOrderBy = {
  avg?: InputMaybe<FsWritesMerged_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<FsWritesMerged_Max_Order_By>;
  min?: InputMaybe<FsWritesMerged_Min_Order_By>;
  stddev?: InputMaybe<FsWritesMerged_Stddev_Order_By>;
  stddev_pop?: InputMaybe<FsWritesMerged_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<FsWritesMerged_Stddev_Samp_Order_By>;
  sum?: InputMaybe<FsWritesMerged_Sum_Order_By>;
  var_pop?: InputMaybe<FsWritesMerged_Var_Pop_Order_By>;
  var_samp?: InputMaybe<FsWritesMerged_Var_Samp_Order_By>;
  variance?: InputMaybe<FsWritesMerged_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.fs_writes_merged" */
export type FsWritesMergedArrRelInsertInput = {
  data: Array<FsWritesMergedInsertInput>;
};

/** aggregate avg on columns */
export type FsWritesMergedAvgFields = {
  __typename?: 'fsWritesMergedAvgFields';
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.fs_writes_merged". All fields are combined with a logical 'AND'. */
export type FsWritesMergedBoolExp = {
  _and?: InputMaybe<Array<FsWritesMergedBoolExp>>;
  _not?: InputMaybe<FsWritesMergedBoolExp>;
  _or?: InputMaybe<Array<FsWritesMergedBoolExp>>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<StringComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** input type for inserting data into table "simpipe.fs_writes_merged" */
export type FsWritesMergedInsertInput = {
  run?: InputMaybe<RunsObjRelInsertInput>;
  runId?: InputMaybe<Scalars['String']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  simulationId?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate max on columns */
export type FsWritesMergedMaxFields = {
  __typename?: 'fsWritesMergedMaxFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type FsWritesMergedMinFields = {
  __typename?: 'fsWritesMergedMinFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.fs_writes_merged". */
export type FsWritesMergedOrderBy = {
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMergedSelectColumn {
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  UserId = 'userId',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type FsWritesMergedStddevFields = {
  __typename?: 'fsWritesMergedStddevFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type FsWritesMergedStddev_PopFields = {
  __typename?: 'fsWritesMergedStddev_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type FsWritesMergedStddev_SampFields = {
  __typename?: 'fsWritesMergedStddev_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "fsWritesMerged" */
export type FsWritesMergedStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: FsWritesMergedStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FsWritesMergedStreamCursorValueInput = {
  runId?: InputMaybe<Scalars['String']>;
  simulationId?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type FsWritesMergedSumFields = {
  __typename?: 'fsWritesMergedSumFields';
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type FsWritesMergedVar_PopFields = {
  __typename?: 'fsWritesMergedVar_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type FsWritesMergedVar_SampFields = {
  __typename?: 'fsWritesMergedVar_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type FsWritesMergedVarianceFields = {
  __typename?: 'fsWritesMergedVarianceFields';
  value?: Maybe<Scalars['Float']>;
};

export type FsWritesMerged_Aggregate_Bool_Exp = {
  avg?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp_Var_Samp>;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Avg = {
  arguments: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Corr = {
  arguments: FsWritesMerged_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Corr_Arguments = {
  X: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: IntComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: FsWritesMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Max = {
  arguments: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Min = {
  arguments: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Sum = {
  arguments: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

export type FsWritesMerged_Aggregate_Bool_Exp_Var_Samp = {
  arguments: FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<FsWritesMergedBoolExp>;
  predicate: Float8ComparisonExp;
};

/** order by avg() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Avg_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Max_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Min_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select "fsWritesMerged_aggregate_bool_exp_avg_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Avg_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsWritesMerged_aggregate_bool_exp_corr_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Corr_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsWritesMerged_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsWritesMerged_aggregate_bool_exp_max_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Max_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsWritesMerged_aggregate_bool_exp_min_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Min_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsWritesMerged_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsWritesMerged_aggregate_bool_exp_sum_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Sum_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "fsWritesMerged_aggregate_bool_exp_var_samp_arguments_columns" columns of table "simpipe.fs_writes_merged" */
export enum FsWritesMerged_Select_Column_FsWritesMerged_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** order by stddev() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Stddev_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Stddev_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Stddev_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Sum_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Var_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Var_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.fs_writes_merged" */
export type FsWritesMerged_Variance_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** columns and relationships of "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes = {
  __typename?: 'memoryMaxUsageBytes';
  /** An object relationship */
  run?: Maybe<Runs>;
  runId?: Maybe<Scalars['String']>;
  /** An object relationship */
  simulation?: Maybe<Simulations>;
  simulationId?: Maybe<Scalars['String']>;
  /** An object relationship */
  step?: Maybe<Steps>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytesAggregate = {
  __typename?: 'memoryMaxUsageBytesAggregate';
  aggregate?: Maybe<MemoryMaxUsageBytesAggregateFields>;
  nodes: Array<MemoryMaxUsageBytes>;
};

/** aggregate fields of "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytesAggregateFields = {
  __typename?: 'memoryMaxUsageBytesAggregateFields';
  avg?: Maybe<MemoryMaxUsageBytesAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<MemoryMaxUsageBytesMaxFields>;
  min?: Maybe<MemoryMaxUsageBytesMinFields>;
  stddev?: Maybe<MemoryMaxUsageBytesStddevFields>;
  stddevPop?: Maybe<MemoryMaxUsageBytesStddev_PopFields>;
  stddevSamp?: Maybe<MemoryMaxUsageBytesStddev_SampFields>;
  sum?: Maybe<MemoryMaxUsageBytesSumFields>;
  varPop?: Maybe<MemoryMaxUsageBytesVar_PopFields>;
  varSamp?: Maybe<MemoryMaxUsageBytesVar_SampFields>;
  variance?: Maybe<MemoryMaxUsageBytesVarianceFields>;
};


/** aggregate fields of "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytesAggregateOrderBy = {
  avg?: InputMaybe<MemoryMaxUsageBytes_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<MemoryMaxUsageBytes_Max_Order_By>;
  min?: InputMaybe<MemoryMaxUsageBytes_Min_Order_By>;
  stddev?: InputMaybe<MemoryMaxUsageBytes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<MemoryMaxUsageBytes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<MemoryMaxUsageBytes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<MemoryMaxUsageBytes_Sum_Order_By>;
  var_pop?: InputMaybe<MemoryMaxUsageBytes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<MemoryMaxUsageBytes_Var_Samp_Order_By>;
  variance?: InputMaybe<MemoryMaxUsageBytes_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytesArrRelInsertInput = {
  data: Array<MemoryMaxUsageBytesInsertInput>;
};

/** aggregate avg on columns */
export type MemoryMaxUsageBytesAvgFields = {
  __typename?: 'memoryMaxUsageBytesAvgFields';
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.memory_max_usage_bytes". All fields are combined with a logical 'AND'. */
export type MemoryMaxUsageBytesBoolExp = {
  _and?: InputMaybe<Array<MemoryMaxUsageBytesBoolExp>>;
  _not?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  _or?: InputMaybe<Array<MemoryMaxUsageBytesBoolExp>>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<StringComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** input type for inserting data into table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytesInsertInput = {
  run?: InputMaybe<RunsObjRelInsertInput>;
  runId?: InputMaybe<Scalars['String']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  simulationId?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate max on columns */
export type MemoryMaxUsageBytesMaxFields = {
  __typename?: 'memoryMaxUsageBytesMaxFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type MemoryMaxUsageBytesMinFields = {
  __typename?: 'memoryMaxUsageBytesMinFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.memory_max_usage_bytes". */
export type MemoryMaxUsageBytesOrderBy = {
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytesSelectColumn {
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  UserId = 'userId',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type MemoryMaxUsageBytesStddevFields = {
  __typename?: 'memoryMaxUsageBytesStddevFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type MemoryMaxUsageBytesStddev_PopFields = {
  __typename?: 'memoryMaxUsageBytesStddev_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type MemoryMaxUsageBytesStddev_SampFields = {
  __typename?: 'memoryMaxUsageBytesStddev_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "memoryMaxUsageBytes" */
export type MemoryMaxUsageBytesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: MemoryMaxUsageBytesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type MemoryMaxUsageBytesStreamCursorValueInput = {
  runId?: InputMaybe<Scalars['String']>;
  simulationId?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type MemoryMaxUsageBytesSumFields = {
  __typename?: 'memoryMaxUsageBytesSumFields';
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type MemoryMaxUsageBytesVar_PopFields = {
  __typename?: 'memoryMaxUsageBytesVar_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type MemoryMaxUsageBytesVar_SampFields = {
  __typename?: 'memoryMaxUsageBytesVar_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type MemoryMaxUsageBytesVarianceFields = {
  __typename?: 'memoryMaxUsageBytesVarianceFields';
  value?: Maybe<Scalars['Float']>;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp = {
  avg?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp_Var_Samp>;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Avg = {
  arguments: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Corr = {
  arguments: MemoryMaxUsageBytes_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Corr_Arguments = {
  X: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: IntComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: MemoryMaxUsageBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Max = {
  arguments: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Min = {
  arguments: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Sum = {
  arguments: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type MemoryMaxUsageBytes_Aggregate_Bool_Exp_Var_Samp = {
  arguments: MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

/** order by avg() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Avg_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Max_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Min_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select "memoryMaxUsageBytes_aggregate_bool_exp_avg_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Avg_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "memoryMaxUsageBytes_aggregate_bool_exp_corr_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "memoryMaxUsageBytes_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "memoryMaxUsageBytes_aggregate_bool_exp_max_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Max_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "memoryMaxUsageBytes_aggregate_bool_exp_min_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Min_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "memoryMaxUsageBytes_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "memoryMaxUsageBytes_aggregate_bool_exp_sum_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Sum_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "memoryMaxUsageBytes_aggregate_bool_exp_var_samp_arguments_columns" columns of table "simpipe.memory_max_usage_bytes" */
export enum MemoryMaxUsageBytes_Select_Column_MemoryMaxUsageBytes_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** order by stddev() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Stddev_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Stddev_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Stddev_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Sum_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Var_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Var_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.memory_max_usage_bytes" */
export type MemoryMaxUsageBytes_Variance_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** columns and relationships of "simpipe.memory_usage_bytes" */
export type MemoryUsageBytes = {
  __typename?: 'memoryUsageBytes';
  /** An object relationship */
  run?: Maybe<Runs>;
  runId?: Maybe<Scalars['String']>;
  /** An object relationship */
  simulation?: Maybe<Simulations>;
  simulationId?: Maybe<Scalars['String']>;
  /** An object relationship */
  step?: Maybe<Steps>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.memory_usage_bytes" */
export type MemoryUsageBytesAggregate = {
  __typename?: 'memoryUsageBytesAggregate';
  aggregate?: Maybe<MemoryUsageBytesAggregateFields>;
  nodes: Array<MemoryUsageBytes>;
};

/** aggregate fields of "simpipe.memory_usage_bytes" */
export type MemoryUsageBytesAggregateFields = {
  __typename?: 'memoryUsageBytesAggregateFields';
  avg?: Maybe<MemoryUsageBytesAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<MemoryUsageBytesMaxFields>;
  min?: Maybe<MemoryUsageBytesMinFields>;
  stddev?: Maybe<MemoryUsageBytesStddevFields>;
  stddevPop?: Maybe<MemoryUsageBytesStddev_PopFields>;
  stddevSamp?: Maybe<MemoryUsageBytesStddev_SampFields>;
  sum?: Maybe<MemoryUsageBytesSumFields>;
  varPop?: Maybe<MemoryUsageBytesVar_PopFields>;
  varSamp?: Maybe<MemoryUsageBytesVar_SampFields>;
  variance?: Maybe<MemoryUsageBytesVarianceFields>;
};


/** aggregate fields of "simpipe.memory_usage_bytes" */
export type MemoryUsageBytesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<MemoryUsageBytesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type MemoryUsageBytesAvgFields = {
  __typename?: 'memoryUsageBytesAvgFields';
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.memory_usage_bytes". All fields are combined with a logical 'AND'. */
export type MemoryUsageBytesBoolExp = {
  _and?: InputMaybe<Array<MemoryUsageBytesBoolExp>>;
  _not?: InputMaybe<MemoryUsageBytesBoolExp>;
  _or?: InputMaybe<Array<MemoryUsageBytesBoolExp>>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<StringComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** aggregate max on columns */
export type MemoryUsageBytesMaxFields = {
  __typename?: 'memoryUsageBytesMaxFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type MemoryUsageBytesMinFields = {
  __typename?: 'memoryUsageBytesMinFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.memory_usage_bytes". */
export type MemoryUsageBytesOrderBy = {
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.memory_usage_bytes" */
export enum MemoryUsageBytesSelectColumn {
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  UserId = 'userId',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type MemoryUsageBytesStddevFields = {
  __typename?: 'memoryUsageBytesStddevFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type MemoryUsageBytesStddev_PopFields = {
  __typename?: 'memoryUsageBytesStddev_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type MemoryUsageBytesStddev_SampFields = {
  __typename?: 'memoryUsageBytesStddev_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "memoryUsageBytes" */
export type MemoryUsageBytesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: MemoryUsageBytesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type MemoryUsageBytesStreamCursorValueInput = {
  runId?: InputMaybe<Scalars['String']>;
  simulationId?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type MemoryUsageBytesSumFields = {
  __typename?: 'memoryUsageBytesSumFields';
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type MemoryUsageBytesVar_PopFields = {
  __typename?: 'memoryUsageBytesVar_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type MemoryUsageBytesVar_SampFields = {
  __typename?: 'memoryUsageBytesVar_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type MemoryUsageBytesVarianceFields = {
  __typename?: 'memoryUsageBytesVarianceFields';
  value?: Maybe<Scalars['Float']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /**  Cancel a run, if the run is running it will be stopped  */
  cancelRun?: Maybe<Run>;
  /**  Create a run, but does not start it  */
  createRun: Run;
  /**  Create a simulation  */
  createSimulation: Simulation;
  /** delete data from the table: "simpipe.runs" */
  deleteRuns?: Maybe<RunsMutationResponse>;
  /** delete single row from the table: "simpipe.runs" */
  deleteRunsByPk?: Maybe<Runs>;
  /** delete data from the table: "simpipe.envs" */
  deleteSimpipeEnvs?: Maybe<SimpipeEnvsMutationResponse>;
  /** delete single row from the table: "simpipe.envs" */
  deleteSimpipeEnvsByPk?: Maybe<SimpipeEnvs>;
  /** delete data from the table: "simpipe.logs" */
  deleteSimpipeLogs?: Maybe<SimpipeLogsMutationResponse>;
  /** delete single row from the table: "simpipe.logs" */
  deleteSimpipeLogsByPk?: Maybe<SimpipeLogs>;
  /** delete data from the table: "simpipe.run_status" */
  deleteSimpipeRunStatus?: Maybe<SimpipeRunStatusMutationResponse>;
  /** delete single row from the table: "simpipe.run_status" */
  deleteSimpipeRunStatusByPk?: Maybe<SimpipeRunStatus>;
  /** delete data from the table: "simpipe.step_status" */
  deleteSimpipeStepStatus?: Maybe<SimpipeStepStatusMutationResponse>;
  /** delete single row from the table: "simpipe.step_status" */
  deleteSimpipeStepStatusByPk?: Maybe<SimpipeStepStatus>;
  /** delete single row from the table: "simpipe.simulations" */
  deleteSimulation?: Maybe<Simulations>;
  /** delete data from the table: "simpipe.simulations" */
  deleteSimulations?: Maybe<SimulationsMutationResponse>;
  /** delete data from the table: "simpipe.steps" */
  deleteSteps?: Maybe<StepsMutationResponse>;
  /** delete single row from the table: "simpipe.steps" */
  deleteStepsByPk?: Maybe<Steps>;
  /** insert data into the table: "simpipe.runs" */
  insertRuns?: Maybe<RunsMutationResponse>;
  /** insert a single row into the table: "simpipe.runs" */
  insertRunsOne?: Maybe<Runs>;
  /** insert data into the table: "simpipe.envs" */
  insertSimpipeEnvs?: Maybe<SimpipeEnvsMutationResponse>;
  /** insert a single row into the table: "simpipe.envs" */
  insertSimpipeEnvsOne?: Maybe<SimpipeEnvs>;
  /** insert data into the table: "simpipe.logs" */
  insertSimpipeLogs?: Maybe<SimpipeLogsMutationResponse>;
  /** insert a single row into the table: "simpipe.logs" */
  insertSimpipeLogsOne?: Maybe<SimpipeLogs>;
  /** insert data into the table: "simpipe.run_status" */
  insertSimpipeRunStatus?: Maybe<SimpipeRunStatusMutationResponse>;
  /** insert a single row into the table: "simpipe.run_status" */
  insertSimpipeRunStatusOne?: Maybe<SimpipeRunStatus>;
  /** insert data into the table: "simpipe.step_status" */
  insertSimpipeStepStatus?: Maybe<SimpipeStepStatusMutationResponse>;
  /** insert a single row into the table: "simpipe.step_status" */
  insertSimpipeStepStatusOne?: Maybe<SimpipeStepStatus>;
  /** insert data into the table: "simpipe.simulations" */
  insertSimulations?: Maybe<SimulationsMutationResponse>;
  /** insert a single row into the table: "simpipe.simulations" */
  insertSimulationsOne?: Maybe<Simulations>;
  /** insert data into the table: "simpipe.steps" */
  insertSteps?: Maybe<StepsMutationResponse>;
  /** insert a single row into the table: "simpipe.steps" */
  insertStepsOne?: Maybe<Steps>;
  /**  Start a run, if other runs are running this run will wait in the queue  */
  startRun?: Maybe<Run>;
  /** update data of the table: "simpipe.runs" */
  updateRuns?: Maybe<RunsMutationResponse>;
  /** update single row of the table: "simpipe.runs" */
  updateRunsByPk?: Maybe<Runs>;
  /** update multiples rows of table: "simpipe.runs" */
  updateRunsMany?: Maybe<Array<Maybe<RunsMutationResponse>>>;
  /** update data of the table: "simpipe.envs" */
  updateSimpipeEnvs?: Maybe<SimpipeEnvsMutationResponse>;
  /** update single row of the table: "simpipe.envs" */
  updateSimpipeEnvsByPk?: Maybe<SimpipeEnvs>;
  /** update multiples rows of table: "simpipe.envs" */
  updateSimpipeEnvsMany?: Maybe<Array<Maybe<SimpipeEnvsMutationResponse>>>;
  /** update data of the table: "simpipe.logs" */
  updateSimpipeLogs?: Maybe<SimpipeLogsMutationResponse>;
  /** update single row of the table: "simpipe.logs" */
  updateSimpipeLogsByPk?: Maybe<SimpipeLogs>;
  /** update multiples rows of table: "simpipe.logs" */
  updateSimpipeLogsMany?: Maybe<Array<Maybe<SimpipeLogsMutationResponse>>>;
  /** update data of the table: "simpipe.run_status" */
  updateSimpipeRunStatus?: Maybe<SimpipeRunStatusMutationResponse>;
  /** update single row of the table: "simpipe.run_status" */
  updateSimpipeRunStatusByPk?: Maybe<SimpipeRunStatus>;
  /** update multiples rows of table: "simpipe.run_status" */
  updateSimpipeRunStatusMany?: Maybe<Array<Maybe<SimpipeRunStatusMutationResponse>>>;
  /** update data of the table: "simpipe.step_status" */
  updateSimpipeStepStatus?: Maybe<SimpipeStepStatusMutationResponse>;
  /** update single row of the table: "simpipe.step_status" */
  updateSimpipeStepStatusByPk?: Maybe<SimpipeStepStatus>;
  /** update multiples rows of table: "simpipe.step_status" */
  updateSimpipeStepStatusMany?: Maybe<Array<Maybe<SimpipeStepStatusMutationResponse>>>;
  /** update single row of the table: "simpipe.simulations" */
  updateSimulation?: Maybe<Simulations>;
  /** update data of the table: "simpipe.simulations" */
  updateSimulations?: Maybe<SimulationsMutationResponse>;
  /** update multiples rows of table: "simpipe.simulations" */
  updateSimulationsMany?: Maybe<Array<Maybe<SimulationsMutationResponse>>>;
  /** update data of the table: "simpipe.steps" */
  updateSteps?: Maybe<StepsMutationResponse>;
  /** update single row of the table: "simpipe.steps" */
  updateStepsByPk?: Maybe<Steps>;
  /** update multiples rows of table: "simpipe.steps" */
  updateStepsMany?: Maybe<Array<Maybe<StepsMutationResponse>>>;
};


/** mutation root */
export type Mutation_RootCancelRunArgs = {
  runId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootCreateRunArgs = {
  run: CreateRunInput;
};


/** mutation root */
export type Mutation_RootCreateSimulationArgs = {
  simulation: CreateSimulationInput;
};


/** mutation root */
export type Mutation_RootDeleteRunsArgs = {
  where: RunsBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteRunsByPkArgs = {
  runId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteSimpipeEnvsArgs = {
  where: SimpipeEnvsBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteSimpipeEnvsByPkArgs = {
  envId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteSimpipeLogsArgs = {
  where: SimpipeLogsBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteSimpipeLogsByPkArgs = {
  stepId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteSimpipeRunStatusArgs = {
  where: SimpipeRunStatusBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteSimpipeRunStatusByPkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteSimpipeStepStatusArgs = {
  where: SimpipeStepStatusBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteSimpipeStepStatusByPkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteSimulationArgs = {
  simulationId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteSimulationsArgs = {
  where: SimulationsBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteStepsArgs = {
  where: StepsBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteStepsByPkArgs = {
  stepId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsertRunsArgs = {
  objects: Array<RunsInsertInput>;
  onConflict?: InputMaybe<RunsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertRunsOneArgs = {
  object: RunsInsertInput;
  onConflict?: InputMaybe<RunsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeEnvsArgs = {
  objects: Array<SimpipeEnvsInsertInput>;
  onConflict?: InputMaybe<SimpipeEnvsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeEnvsOneArgs = {
  object: SimpipeEnvsInsertInput;
  onConflict?: InputMaybe<SimpipeEnvsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeLogsArgs = {
  objects: Array<SimpipeLogsInsertInput>;
  onConflict?: InputMaybe<SimpipeLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeLogsOneArgs = {
  object: SimpipeLogsInsertInput;
  onConflict?: InputMaybe<SimpipeLogsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeRunStatusArgs = {
  objects: Array<SimpipeRunStatusInsertInput>;
  onConflict?: InputMaybe<SimpipeRunStatusOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeRunStatusOneArgs = {
  object: SimpipeRunStatusInsertInput;
  onConflict?: InputMaybe<SimpipeRunStatusOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeStepStatusArgs = {
  objects: Array<SimpipeStepStatusInsertInput>;
  onConflict?: InputMaybe<SimpipeStepStatusOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeStepStatusOneArgs = {
  object: SimpipeStepStatusInsertInput;
  onConflict?: InputMaybe<SimpipeStepStatusOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimulationsArgs = {
  objects: Array<SimulationsInsertInput>;
  onConflict?: InputMaybe<SimulationsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimulationsOneArgs = {
  object: SimulationsInsertInput;
  onConflict?: InputMaybe<SimulationsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertStepsArgs = {
  objects: Array<StepsInsertInput>;
  onConflict?: InputMaybe<StepsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertStepsOneArgs = {
  object: StepsInsertInput;
  onConflict?: InputMaybe<StepsOnConflict>;
};


/** mutation root */
export type Mutation_RootStartRunArgs = {
  runId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootUpdateRunsArgs = {
  _set?: InputMaybe<RunsSetInput>;
  where: RunsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateRunsByPkArgs = {
  _set?: InputMaybe<RunsSetInput>;
  pk_columns: RunsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateRunsManyArgs = {
  updates: Array<RunsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeEnvsArgs = {
  _set?: InputMaybe<SimpipeEnvsSetInput>;
  where: SimpipeEnvsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeEnvsByPkArgs = {
  _set?: InputMaybe<SimpipeEnvsSetInput>;
  pk_columns: SimpipeEnvsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeEnvsManyArgs = {
  updates: Array<SimpipeEnvsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeLogsArgs = {
  _set?: InputMaybe<SimpipeLogsSetInput>;
  where: SimpipeLogsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeLogsByPkArgs = {
  _set?: InputMaybe<SimpipeLogsSetInput>;
  pk_columns: SimpipeLogsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeLogsManyArgs = {
  updates: Array<SimpipeLogsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeRunStatusArgs = {
  _set?: InputMaybe<SimpipeRunStatusSetInput>;
  where: SimpipeRunStatusBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeRunStatusByPkArgs = {
  _set?: InputMaybe<SimpipeRunStatusSetInput>;
  pk_columns: SimpipeRunStatusPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeRunStatusManyArgs = {
  updates: Array<SimpipeRunStatusUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeStepStatusArgs = {
  _set?: InputMaybe<SimpipeStepStatusSetInput>;
  where: SimpipeStepStatusBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeStepStatusByPkArgs = {
  _set?: InputMaybe<SimpipeStepStatusSetInput>;
  pk_columns: SimpipeStepStatusPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeStepStatusManyArgs = {
  updates: Array<SimpipeStepStatusUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSimulationArgs = {
  _append?: InputMaybe<SimulationsAppendInput>;
  _deleteAtPath?: InputMaybe<SimulationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<SimulationsDeleteElemInput>;
  _deleteKey?: InputMaybe<SimulationsDeleteKeyInput>;
  _prepend?: InputMaybe<SimulationsPrependInput>;
  _set?: InputMaybe<SimulationsSetInput>;
  pk_columns: SimulationsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimulationsArgs = {
  _append?: InputMaybe<SimulationsAppendInput>;
  _deleteAtPath?: InputMaybe<SimulationsDeleteAtPathInput>;
  _deleteElem?: InputMaybe<SimulationsDeleteElemInput>;
  _deleteKey?: InputMaybe<SimulationsDeleteKeyInput>;
  _prepend?: InputMaybe<SimulationsPrependInput>;
  _set?: InputMaybe<SimulationsSetInput>;
  where: SimulationsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimulationsManyArgs = {
  updates: Array<SimulationsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateStepsArgs = {
  _inc?: InputMaybe<StepsIncInput>;
  _set?: InputMaybe<StepsSetInput>;
  where: StepsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateStepsByPkArgs = {
  _inc?: InputMaybe<StepsIncInput>;
  _set?: InputMaybe<StepsSetInput>;
  pk_columns: StepsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateStepsManyArgs = {
  updates: Array<StepsUpdates>;
};

/** columns and relationships of "simpipe.network_received_bytes" */
export type NetworkReceivedBytes = {
  __typename?: 'networkReceivedBytes';
  /** An object relationship */
  run?: Maybe<Runs>;
  runId?: Maybe<Scalars['String']>;
  /** An object relationship */
  simulation?: Maybe<Simulations>;
  simulationId?: Maybe<Scalars['String']>;
  /** An object relationship */
  step?: Maybe<Steps>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.network_received_bytes" */
export type NetworkReceivedBytesAggregate = {
  __typename?: 'networkReceivedBytesAggregate';
  aggregate?: Maybe<NetworkReceivedBytesAggregateFields>;
  nodes: Array<NetworkReceivedBytes>;
};

/** aggregate fields of "simpipe.network_received_bytes" */
export type NetworkReceivedBytesAggregateFields = {
  __typename?: 'networkReceivedBytesAggregateFields';
  avg?: Maybe<NetworkReceivedBytesAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<NetworkReceivedBytesMaxFields>;
  min?: Maybe<NetworkReceivedBytesMinFields>;
  stddev?: Maybe<NetworkReceivedBytesStddevFields>;
  stddevPop?: Maybe<NetworkReceivedBytesStddev_PopFields>;
  stddevSamp?: Maybe<NetworkReceivedBytesStddev_SampFields>;
  sum?: Maybe<NetworkReceivedBytesSumFields>;
  varPop?: Maybe<NetworkReceivedBytesVar_PopFields>;
  varSamp?: Maybe<NetworkReceivedBytesVar_SampFields>;
  variance?: Maybe<NetworkReceivedBytesVarianceFields>;
};


/** aggregate fields of "simpipe.network_received_bytes" */
export type NetworkReceivedBytesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytesAggregateOrderBy = {
  avg?: InputMaybe<NetworkReceivedBytes_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<NetworkReceivedBytes_Max_Order_By>;
  min?: InputMaybe<NetworkReceivedBytes_Min_Order_By>;
  stddev?: InputMaybe<NetworkReceivedBytes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<NetworkReceivedBytes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<NetworkReceivedBytes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<NetworkReceivedBytes_Sum_Order_By>;
  var_pop?: InputMaybe<NetworkReceivedBytes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<NetworkReceivedBytes_Var_Samp_Order_By>;
  variance?: InputMaybe<NetworkReceivedBytes_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.network_received_bytes" */
export type NetworkReceivedBytesArrRelInsertInput = {
  data: Array<NetworkReceivedBytesInsertInput>;
};

/** aggregate avg on columns */
export type NetworkReceivedBytesAvgFields = {
  __typename?: 'networkReceivedBytesAvgFields';
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.network_received_bytes". All fields are combined with a logical 'AND'. */
export type NetworkReceivedBytesBoolExp = {
  _and?: InputMaybe<Array<NetworkReceivedBytesBoolExp>>;
  _not?: InputMaybe<NetworkReceivedBytesBoolExp>;
  _or?: InputMaybe<Array<NetworkReceivedBytesBoolExp>>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<StringComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** input type for inserting data into table "simpipe.network_received_bytes" */
export type NetworkReceivedBytesInsertInput = {
  run?: InputMaybe<RunsObjRelInsertInput>;
  runId?: InputMaybe<Scalars['String']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  simulationId?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate max on columns */
export type NetworkReceivedBytesMaxFields = {
  __typename?: 'networkReceivedBytesMaxFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type NetworkReceivedBytesMinFields = {
  __typename?: 'networkReceivedBytesMinFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.network_received_bytes". */
export type NetworkReceivedBytesOrderBy = {
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytesSelectColumn {
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  UserId = 'userId',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type NetworkReceivedBytesStddevFields = {
  __typename?: 'networkReceivedBytesStddevFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type NetworkReceivedBytesStddev_PopFields = {
  __typename?: 'networkReceivedBytesStddev_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type NetworkReceivedBytesStddev_SampFields = {
  __typename?: 'networkReceivedBytesStddev_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "networkReceivedBytes" */
export type NetworkReceivedBytesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: NetworkReceivedBytesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NetworkReceivedBytesStreamCursorValueInput = {
  runId?: InputMaybe<Scalars['String']>;
  simulationId?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type NetworkReceivedBytesSumFields = {
  __typename?: 'networkReceivedBytesSumFields';
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type NetworkReceivedBytesVar_PopFields = {
  __typename?: 'networkReceivedBytesVar_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type NetworkReceivedBytesVar_SampFields = {
  __typename?: 'networkReceivedBytesVar_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type NetworkReceivedBytesVarianceFields = {
  __typename?: 'networkReceivedBytesVarianceFields';
  value?: Maybe<Scalars['Float']>;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp = {
  avg?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp_Var_Samp>;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Avg = {
  arguments: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Corr = {
  arguments: NetworkReceivedBytes_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Corr_Arguments = {
  X: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: IntComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: NetworkReceivedBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Max = {
  arguments: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Min = {
  arguments: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Sum = {
  arguments: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkReceivedBytes_Aggregate_Bool_Exp_Var_Samp = {
  arguments: NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkReceivedBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

/** order by avg() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Avg_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Max_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Min_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select "networkReceivedBytes_aggregate_bool_exp_avg_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Avg_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkReceivedBytes_aggregate_bool_exp_corr_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkReceivedBytes_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkReceivedBytes_aggregate_bool_exp_max_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Max_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkReceivedBytes_aggregate_bool_exp_min_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Min_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkReceivedBytes_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkReceivedBytes_aggregate_bool_exp_sum_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Sum_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkReceivedBytes_aggregate_bool_exp_var_samp_arguments_columns" columns of table "simpipe.network_received_bytes" */
export enum NetworkReceivedBytes_Select_Column_NetworkReceivedBytes_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** order by stddev() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Stddev_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Stddev_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Stddev_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Sum_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Var_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Var_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.network_received_bytes" */
export type NetworkReceivedBytes_Variance_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** columns and relationships of "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes = {
  __typename?: 'networkTransmitBytes';
  /** An object relationship */
  run?: Maybe<Runs>;
  runId?: Maybe<Scalars['String']>;
  /** An object relationship */
  simulation?: Maybe<Simulations>;
  simulationId?: Maybe<Scalars['String']>;
  /** An object relationship */
  step?: Maybe<Steps>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytesAggregate = {
  __typename?: 'networkTransmitBytesAggregate';
  aggregate?: Maybe<NetworkTransmitBytesAggregateFields>;
  nodes: Array<NetworkTransmitBytes>;
};

/** aggregate fields of "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytesAggregateFields = {
  __typename?: 'networkTransmitBytesAggregateFields';
  avg?: Maybe<NetworkTransmitBytesAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<NetworkTransmitBytesMaxFields>;
  min?: Maybe<NetworkTransmitBytesMinFields>;
  stddev?: Maybe<NetworkTransmitBytesStddevFields>;
  stddevPop?: Maybe<NetworkTransmitBytesStddev_PopFields>;
  stddevSamp?: Maybe<NetworkTransmitBytesStddev_SampFields>;
  sum?: Maybe<NetworkTransmitBytesSumFields>;
  varPop?: Maybe<NetworkTransmitBytesVar_PopFields>;
  varSamp?: Maybe<NetworkTransmitBytesVar_SampFields>;
  variance?: Maybe<NetworkTransmitBytesVarianceFields>;
};


/** aggregate fields of "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytesAggregateOrderBy = {
  avg?: InputMaybe<NetworkTransmitBytes_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<NetworkTransmitBytes_Max_Order_By>;
  min?: InputMaybe<NetworkTransmitBytes_Min_Order_By>;
  stddev?: InputMaybe<NetworkTransmitBytes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<NetworkTransmitBytes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<NetworkTransmitBytes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<NetworkTransmitBytes_Sum_Order_By>;
  var_pop?: InputMaybe<NetworkTransmitBytes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<NetworkTransmitBytes_Var_Samp_Order_By>;
  variance?: InputMaybe<NetworkTransmitBytes_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytesArrRelInsertInput = {
  data: Array<NetworkTransmitBytesInsertInput>;
};

/** aggregate avg on columns */
export type NetworkTransmitBytesAvgFields = {
  __typename?: 'networkTransmitBytesAvgFields';
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.network_transmit_bytes". All fields are combined with a logical 'AND'. */
export type NetworkTransmitBytesBoolExp = {
  _and?: InputMaybe<Array<NetworkTransmitBytesBoolExp>>;
  _not?: InputMaybe<NetworkTransmitBytesBoolExp>;
  _or?: InputMaybe<Array<NetworkTransmitBytesBoolExp>>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<StringComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** input type for inserting data into table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytesInsertInput = {
  run?: InputMaybe<RunsObjRelInsertInput>;
  runId?: InputMaybe<Scalars['String']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  simulationId?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate max on columns */
export type NetworkTransmitBytesMaxFields = {
  __typename?: 'networkTransmitBytesMaxFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type NetworkTransmitBytesMinFields = {
  __typename?: 'networkTransmitBytesMinFields';
  runId?: Maybe<Scalars['String']>;
  simulationId?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.network_transmit_bytes". */
export type NetworkTransmitBytesOrderBy = {
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytesSelectColumn {
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  UserId = 'userId',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type NetworkTransmitBytesStddevFields = {
  __typename?: 'networkTransmitBytesStddevFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type NetworkTransmitBytesStddev_PopFields = {
  __typename?: 'networkTransmitBytesStddev_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type NetworkTransmitBytesStddev_SampFields = {
  __typename?: 'networkTransmitBytesStddev_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "networkTransmitBytes" */
export type NetworkTransmitBytesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: NetworkTransmitBytesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type NetworkTransmitBytesStreamCursorValueInput = {
  runId?: InputMaybe<Scalars['String']>;
  simulationId?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type NetworkTransmitBytesSumFields = {
  __typename?: 'networkTransmitBytesSumFields';
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type NetworkTransmitBytesVar_PopFields = {
  __typename?: 'networkTransmitBytesVar_popFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type NetworkTransmitBytesVar_SampFields = {
  __typename?: 'networkTransmitBytesVar_sampFields';
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type NetworkTransmitBytesVarianceFields = {
  __typename?: 'networkTransmitBytesVarianceFields';
  value?: Maybe<Scalars['Float']>;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp = {
  avg?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp_Var_Samp>;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Avg = {
  arguments: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Corr = {
  arguments: NetworkTransmitBytes_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Corr_Arguments = {
  X: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: IntComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: NetworkTransmitBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Max = {
  arguments: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Min = {
  arguments: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Sum = {
  arguments: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type NetworkTransmitBytes_Aggregate_Bool_Exp_Var_Samp = {
  arguments: NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NetworkTransmitBytesBoolExp>;
  predicate: Float8ComparisonExp;
};

/** order by avg() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Avg_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Max_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Min_Order_By = {
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select "networkTransmitBytes_aggregate_bool_exp_avg_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Avg_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkTransmitBytes_aggregate_bool_exp_corr_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Corr_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkTransmitBytes_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkTransmitBytes_aggregate_bool_exp_max_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Max_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkTransmitBytes_aggregate_bool_exp_min_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Min_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkTransmitBytes_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkTransmitBytes_aggregate_bool_exp_sum_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Sum_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** select "networkTransmitBytes_aggregate_bool_exp_var_samp_arguments_columns" columns of table "simpipe.network_transmit_bytes" */
export enum NetworkTransmitBytes_Select_Column_NetworkTransmitBytes_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
  /** column name */
  Value = 'value'
}

/** order by stddev() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Stddev_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Stddev_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Stddev_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Sum_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Var_Pop_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Var_Samp_Order_By = {
  value?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.network_transmit_bytes" */
export type NetworkTransmitBytes_Variance_Order_By = {
  value?: InputMaybe<OrderBy>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /**  Compute a presigned URL for uploading a file using a HTTP PUT.  */
  computeUploadPresignedUrl: Scalars['String'];
  /** An array relationship */
  cpu: Array<Cpu>;
  /** An aggregate relationship */
  cpuAggregate: CpuAggregate;
  /** An array relationship */
  fsReadsMerged: Array<FsReadsMerged>;
  /** An aggregate relationship */
  fsReadsMergedAggregate: FsReadsMergedAggregate;
  /** An array relationship */
  fsWritesMerged: Array<FsWritesMerged>;
  /** An aggregate relationship */
  fsWritesMergedAggregate: FsWritesMergedAggregate;
  /** An array relationship */
  memoryMaxUsageBytes: Array<MemoryMaxUsageBytes>;
  /** An aggregate relationship */
  memoryMaxUsageBytesAggregate: MemoryMaxUsageBytesAggregate;
  /** fetch data from the table: "simpipe.memory_usage_bytes" */
  memoryUsageBytes: Array<MemoryUsageBytes>;
  /** fetch aggregated fields from the table: "simpipe.memory_usage_bytes" */
  memoryUsageBytesAggregate: MemoryUsageBytesAggregate;
  /** An array relationship */
  networkReceivedBytes: Array<NetworkReceivedBytes>;
  /** An aggregate relationship */
  networkReceivedBytesAggregate: NetworkReceivedBytesAggregate;
  /** An array relationship */
  networkTransmitBytes: Array<NetworkTransmitBytes>;
  /** An aggregate relationship */
  networkTransmitBytesAggregate: NetworkTransmitBytesAggregate;
  /**  Returns pong if the server is up and running.  */
  ping: Scalars['String'];
  /** fetch data from the table: "simpipe.runs" using primary key columns */
  run?: Maybe<Runs>;
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runsAggregate: RunsAggregate;
  /** fetch data from the table: "simpipe.envs" */
  simpipeEnvs: Array<SimpipeEnvs>;
  /** fetch aggregated fields from the table: "simpipe.envs" */
  simpipeEnvsAggregate: SimpipeEnvsAggregate;
  /** fetch data from the table: "simpipe.envs" using primary key columns */
  simpipeEnvsByPk?: Maybe<SimpipeEnvs>;
  /** fetch data from the table: "simpipe.logs" */
  simpipeLogs: Array<SimpipeLogs>;
  /** fetch aggregated fields from the table: "simpipe.logs" */
  simpipeLogsAggregate: SimpipeLogsAggregate;
  /** fetch data from the table: "simpipe.logs" using primary key columns */
  simpipeLogsByPk?: Maybe<SimpipeLogs>;
  /** fetch data from the table: "simpipe.run_status" */
  simpipeRunStatus: Array<SimpipeRunStatus>;
  /** fetch aggregated fields from the table: "simpipe.run_status" */
  simpipeRunStatusAggregate: SimpipeRunStatusAggregate;
  /** fetch data from the table: "simpipe.run_status" using primary key columns */
  simpipeRunStatusByPk?: Maybe<SimpipeRunStatus>;
  /** fetch data from the table: "simpipe.step_status" */
  simpipeStepStatus: Array<SimpipeStepStatus>;
  /** fetch aggregated fields from the table: "simpipe.step_status" */
  simpipeStepStatusAggregate: SimpipeStepStatusAggregate;
  /** fetch data from the table: "simpipe.step_status" using primary key columns */
  simpipeStepStatusByPk?: Maybe<SimpipeStepStatus>;
  /** fetch data from the table: "simpipe.simulations" using primary key columns */
  simulation?: Maybe<Simulations>;
  /** fetch data from the table: "simpipe.simulations" */
  simulations: Array<Simulations>;
  /** fetch aggregated fields from the table: "simpipe.simulations" */
  simulationsAggregate: SimulationsAggregate;
  /** An array relationship */
  steps: Array<Steps>;
  /** An aggregate relationship */
  stepsAggregate: StepsAggregate;
  /** fetch data from the table: "simpipe.steps" using primary key columns */
  stepsByPk?: Maybe<Steps>;
  /**  Fetch the current username.  */
  username: Scalars['String'];
};


export type Query_RootCpuArgs = {
  distinctOn?: InputMaybe<Array<CpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CpuOrderBy>>;
  where?: InputMaybe<CpuBoolExp>;
};


export type Query_RootCpuAggregateArgs = {
  distinctOn?: InputMaybe<Array<CpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CpuOrderBy>>;
  where?: InputMaybe<CpuBoolExp>;
};


export type Query_RootFsReadsMergedArgs = {
  distinctOn?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsReadsMergedOrderBy>>;
  where?: InputMaybe<FsReadsMergedBoolExp>;
};


export type Query_RootFsReadsMergedAggregateArgs = {
  distinctOn?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsReadsMergedOrderBy>>;
  where?: InputMaybe<FsReadsMergedBoolExp>;
};


export type Query_RootFsWritesMergedArgs = {
  distinctOn?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsWritesMergedOrderBy>>;
  where?: InputMaybe<FsWritesMergedBoolExp>;
};


export type Query_RootFsWritesMergedAggregateArgs = {
  distinctOn?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsWritesMergedOrderBy>>;
  where?: InputMaybe<FsWritesMergedBoolExp>;
};


export type Query_RootMemoryMaxUsageBytesArgs = {
  distinctOn?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryMaxUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
};


export type Query_RootMemoryMaxUsageBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryMaxUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
};


export type Query_RootMemoryUsageBytesArgs = {
  distinctOn?: InputMaybe<Array<MemoryUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryUsageBytesBoolExp>;
};


export type Query_RootMemoryUsageBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<MemoryUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryUsageBytesBoolExp>;
};


export type Query_RootNetworkReceivedBytesArgs = {
  distinctOn?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkReceivedBytesOrderBy>>;
  where?: InputMaybe<NetworkReceivedBytesBoolExp>;
};


export type Query_RootNetworkReceivedBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkReceivedBytesOrderBy>>;
  where?: InputMaybe<NetworkReceivedBytesBoolExp>;
};


export type Query_RootNetworkTransmitBytesArgs = {
  distinctOn?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkTransmitBytesOrderBy>>;
  where?: InputMaybe<NetworkTransmitBytesBoolExp>;
};


export type Query_RootNetworkTransmitBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkTransmitBytesOrderBy>>;
  where?: InputMaybe<NetworkTransmitBytesBoolExp>;
};


export type Query_RootRunArgs = {
  runId: Scalars['uuid'];
};


export type Query_RootRunsArgs = {
  distinctOn?: InputMaybe<Array<RunsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RunsOrderBy>>;
  where?: InputMaybe<RunsBoolExp>;
};


export type Query_RootRunsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RunsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RunsOrderBy>>;
  where?: InputMaybe<RunsBoolExp>;
};


export type Query_RootSimpipeEnvsArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


export type Query_RootSimpipeEnvsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


export type Query_RootSimpipeEnvsByPkArgs = {
  envId: Scalars['uuid'];
};


export type Query_RootSimpipeLogsArgs = {
  distinctOn?: InputMaybe<Array<SimpipeLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeLogsOrderBy>>;
  where?: InputMaybe<SimpipeLogsBoolExp>;
};


export type Query_RootSimpipeLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeLogsOrderBy>>;
  where?: InputMaybe<SimpipeLogsBoolExp>;
};


export type Query_RootSimpipeLogsByPkArgs = {
  stepId: Scalars['uuid'];
};


export type Query_RootSimpipeRunStatusArgs = {
  distinctOn?: InputMaybe<Array<SimpipeRunStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeRunStatusOrderBy>>;
  where?: InputMaybe<SimpipeRunStatusBoolExp>;
};


export type Query_RootSimpipeRunStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeRunStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeRunStatusOrderBy>>;
  where?: InputMaybe<SimpipeRunStatusBoolExp>;
};


export type Query_RootSimpipeRunStatusByPkArgs = {
  value: Scalars['String'];
};


export type Query_RootSimpipeStepStatusArgs = {
  distinctOn?: InputMaybe<Array<SimpipeStepStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeStepStatusOrderBy>>;
  where?: InputMaybe<SimpipeStepStatusBoolExp>;
};


export type Query_RootSimpipeStepStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeStepStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeStepStatusOrderBy>>;
  where?: InputMaybe<SimpipeStepStatusBoolExp>;
};


export type Query_RootSimpipeStepStatusByPkArgs = {
  value: Scalars['String'];
};


export type Query_RootSimulationArgs = {
  simulationId: Scalars['uuid'];
};


export type Query_RootSimulationsArgs = {
  distinctOn?: InputMaybe<Array<SimulationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimulationsOrderBy>>;
  where?: InputMaybe<SimulationsBoolExp>;
};


export type Query_RootSimulationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimulationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimulationsOrderBy>>;
  where?: InputMaybe<SimulationsBoolExp>;
};


export type Query_RootStepsArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};


export type Query_RootStepsAggregateArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};


export type Query_RootStepsByPkArgs = {
  stepId: Scalars['uuid'];
};

/** Simulation run */
export type Runs = {
  __typename?: 'runs';
  /** DateTime of when the run was created */
  created: Scalars['timestamp'];
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: Maybe<Scalars['timestamp']>;
  /** Name of the run, it is unique per simulation */
  name: Scalars['String'];
  /** UUID of the run, random by default */
  runId: Scalars['uuid'];
  /** An object relationship */
  simulation: Simulations;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId: Scalars['uuid'];
  /** DateTime of when the run was started, NULL if not started */
  started?: Maybe<Scalars['timestamp']>;
  /** Status of the run, must be one of the values in the run_status enum */
  status: SimpipeRunStatusEnum;
  /** An array relationship */
  steps: Array<Steps>;
  /** An aggregate relationship */
  stepsAggregate: StepsAggregate;
};


/** Simulation run */
export type RunsStepsArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};


/** Simulation run */
export type RunsStepsAggregateArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};

/** aggregated selection of "simpipe.runs" */
export type RunsAggregate = {
  __typename?: 'runsAggregate';
  aggregate?: Maybe<RunsAggregateFields>;
  nodes: Array<Runs>;
};

/** aggregate fields of "simpipe.runs" */
export type RunsAggregateFields = {
  __typename?: 'runsAggregateFields';
  count: Scalars['Int'];
  max?: Maybe<RunsMaxFields>;
  min?: Maybe<RunsMinFields>;
};


/** aggregate fields of "simpipe.runs" */
export type RunsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RunsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.runs" */
export type RunsAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<Runs_Max_Order_By>;
  min?: InputMaybe<Runs_Min_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.runs" */
export type RunsArrRelInsertInput = {
  data: Array<RunsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<RunsOnConflict>;
};

/** Boolean expression to filter rows from the table "simpipe.runs". All fields are combined with a logical 'AND'. */
export type RunsBoolExp = {
  _and?: InputMaybe<Array<RunsBoolExp>>;
  _not?: InputMaybe<RunsBoolExp>;
  _or?: InputMaybe<Array<RunsBoolExp>>;
  created?: InputMaybe<TimestampComparisonExp>;
  ended?: InputMaybe<TimestampComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  runId?: InputMaybe<UuidComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<UuidComparisonExp>;
  started?: InputMaybe<TimestampComparisonExp>;
  status?: InputMaybe<SimpipeRunStatusEnumComparisonExp>;
  steps?: InputMaybe<StepsBoolExp>;
  steps_aggregate?: InputMaybe<Steps_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "simpipe.runs" */
export enum RunsConstraint {
  /** unique or primary key constraint on columns "run_id" */
  RunsPkey = 'runs_pkey',
  /** unique or primary key constraint on columns "name", "simulation_id" */
  UniqueRunNamePerSimulation = 'unique_run_name_per_simulation'
}

/** input type for inserting data into table "simpipe.runs" */
export type RunsInsertInput = {
  /** DateTime of when the run was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: InputMaybe<Scalars['timestamp']>;
  /** Name of the run, it is unique per simulation */
  name?: InputMaybe<Scalars['String']>;
  /** UUID of the run, random by default */
  runId?: InputMaybe<Scalars['uuid']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId?: InputMaybe<Scalars['uuid']>;
  /** DateTime of when the run was started, NULL if not started */
  started?: InputMaybe<Scalars['timestamp']>;
  /** Status of the run, must be one of the values in the run_status enum */
  status?: InputMaybe<SimpipeRunStatusEnum>;
  steps?: InputMaybe<StepsArrRelInsertInput>;
};

/** aggregate max on columns */
export type RunsMaxFields = {
  __typename?: 'runsMaxFields';
  /** DateTime of when the run was created */
  created?: Maybe<Scalars['timestamp']>;
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: Maybe<Scalars['timestamp']>;
  /** Name of the run, it is unique per simulation */
  name?: Maybe<Scalars['String']>;
  /** UUID of the run, random by default */
  runId?: Maybe<Scalars['uuid']>;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId?: Maybe<Scalars['uuid']>;
  /** DateTime of when the run was started, NULL if not started */
  started?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type RunsMinFields = {
  __typename?: 'runsMinFields';
  /** DateTime of when the run was created */
  created?: Maybe<Scalars['timestamp']>;
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: Maybe<Scalars['timestamp']>;
  /** Name of the run, it is unique per simulation */
  name?: Maybe<Scalars['String']>;
  /** UUID of the run, random by default */
  runId?: Maybe<Scalars['uuid']>;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId?: Maybe<Scalars['uuid']>;
  /** DateTime of when the run was started, NULL if not started */
  started?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "simpipe.runs" */
export type RunsMutationResponse = {
  __typename?: 'runsMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Runs>;
};

/** input type for inserting object relation for remote table "simpipe.runs" */
export type RunsObjRelInsertInput = {
  data: RunsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<RunsOnConflict>;
};

/** on_conflict condition type for table "simpipe.runs" */
export type RunsOnConflict = {
  constraint: RunsConstraint;
  update_columns?: Array<RunsUpdateColumn>;
  where?: InputMaybe<RunsBoolExp>;
};

/** Ordering options when selecting data from "simpipe.runs". */
export type RunsOrderBy = {
  created?: InputMaybe<OrderBy>;
  ended?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulation?: InputMaybe<SimulationsOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  started?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  stepsAggregate?: InputMaybe<StepsAggregateOrderBy>;
};

/** primary key columns input for table: simpipe.runs */
export type RunsPkColumnsInput = {
  /** UUID of the run, random by default */
  runId: Scalars['uuid'];
};

/** select columns of table "simpipe.runs" */
export enum RunsSelectColumn {
  /** column name */
  Created = 'created',
  /** column name */
  Ended = 'ended',
  /** column name */
  Name = 'name',
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "simpipe.runs" */
export type RunsSetInput = {
  /** DateTime of when the run was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: InputMaybe<Scalars['timestamp']>;
  /** Name of the run, it is unique per simulation */
  name?: InputMaybe<Scalars['String']>;
  /** UUID of the run, random by default */
  runId?: InputMaybe<Scalars['uuid']>;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId?: InputMaybe<Scalars['uuid']>;
  /** DateTime of when the run was started, NULL if not started */
  started?: InputMaybe<Scalars['timestamp']>;
  /** Status of the run, must be one of the values in the run_status enum */
  status?: InputMaybe<SimpipeRunStatusEnum>;
};

/** Streaming cursor of the table "runs" */
export type RunsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: RunsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RunsStreamCursorValueInput = {
  /** DateTime of when the run was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: InputMaybe<Scalars['timestamp']>;
  /** Name of the run, it is unique per simulation */
  name?: InputMaybe<Scalars['String']>;
  /** UUID of the run, random by default */
  runId?: InputMaybe<Scalars['uuid']>;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId?: InputMaybe<Scalars['uuid']>;
  /** DateTime of when the run was started, NULL if not started */
  started?: InputMaybe<Scalars['timestamp']>;
  /** Status of the run, must be one of the values in the run_status enum */
  status?: InputMaybe<SimpipeRunStatusEnum>;
};

/** update columns of table "simpipe.runs" */
export enum RunsUpdateColumn {
  /** column name */
  Created = 'created',
  /** column name */
  Ended = 'ended',
  /** column name */
  Name = 'name',
  /** column name */
  RunId = 'runId',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status'
}

export type RunsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RunsSetInput>;
  /** filter the rows which have to be updated */
  where: RunsBoolExp;
};

export type Runs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Runs_Aggregate_Bool_Exp_Count>;
};

export type Runs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<RunsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<RunsBoolExp>;
  predicate: IntComparisonExp;
};

/** order by max() on columns of table "simpipe.runs" */
export type Runs_Max_Order_By = {
  /** DateTime of when the run was created */
  created?: InputMaybe<OrderBy>;
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: InputMaybe<OrderBy>;
  /** Name of the run, it is unique per simulation */
  name?: InputMaybe<OrderBy>;
  /** UUID of the run, random by default */
  runId?: InputMaybe<OrderBy>;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId?: InputMaybe<OrderBy>;
  /** DateTime of when the run was started, NULL if not started */
  started?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.runs" */
export type Runs_Min_Order_By = {
  /** DateTime of when the run was created */
  created?: InputMaybe<OrderBy>;
  /** DateTime of when the run was ended, NULL if not ended */
  ended?: InputMaybe<OrderBy>;
  /** Name of the run, it is unique per simulation */
  name?: InputMaybe<OrderBy>;
  /** UUID of the run, random by default */
  runId?: InputMaybe<OrderBy>;
  /** UUID of the simulation, must exist in the simulations table */
  simulationId?: InputMaybe<OrderBy>;
  /** DateTime of when the run was started, NULL if not started */
  started?: InputMaybe<OrderBy>;
};

export type Simpipe_Envs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Simpipe_Envs_Aggregate_Bool_Exp_Count>;
};

export type Simpipe_Envs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<SimpipeEnvsBoolExp>;
  predicate: IntComparisonExp;
};

/** order by max() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Max_Order_By = {
  /** UUID of the env, random by default */
  envId?: InputMaybe<OrderBy>;
  /** Name of the env, it is unique per step */
  name?: InputMaybe<OrderBy>;
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<OrderBy>;
  /** Value of the env */
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Min_Order_By = {
  /** UUID of the env, random by default */
  envId?: InputMaybe<OrderBy>;
  /** Name of the env, it is unique per step */
  name?: InputMaybe<OrderBy>;
  /** UUID of the step, must exist in the steps table */
  stepId?: InputMaybe<OrderBy>;
  /** Value of the env */
  value?: InputMaybe<OrderBy>;
};

/** Simulations */
export type Simulations = {
  __typename?: 'simulations';
  /** DateTime of when the simulation was created */
  created: Scalars['timestamp'];
  /** Name of the simulation, it is unique */
  name: Scalars['String'];
  /** Description of the pipeline in JSON */
  pipelineDescription: Scalars['jsonb'];
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runsAggregate: RunsAggregate;
  /** UUID of the simulation, random by default */
  simulationId: Scalars['uuid'];
  /** User ID of the owner of the simulation */
  userId: Scalars['String'];
};


/** Simulations */
export type SimulationsPipelineDescriptionArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** Simulations */
export type SimulationsRunsArgs = {
  distinctOn?: InputMaybe<Array<RunsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RunsOrderBy>>;
  where?: InputMaybe<RunsBoolExp>;
};


/** Simulations */
export type SimulationsRunsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RunsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RunsOrderBy>>;
  where?: InputMaybe<RunsBoolExp>;
};

/** aggregated selection of "simpipe.simulations" */
export type SimulationsAggregate = {
  __typename?: 'simulationsAggregate';
  aggregate?: Maybe<SimulationsAggregateFields>;
  nodes: Array<Simulations>;
};

/** aggregate fields of "simpipe.simulations" */
export type SimulationsAggregateFields = {
  __typename?: 'simulationsAggregateFields';
  count: Scalars['Int'];
  max?: Maybe<SimulationsMaxFields>;
  min?: Maybe<SimulationsMinFields>;
};


/** aggregate fields of "simpipe.simulations" */
export type SimulationsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimulationsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type SimulationsAppendInput = {
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "simpipe.simulations". All fields are combined with a logical 'AND'. */
export type SimulationsBoolExp = {
  _and?: InputMaybe<Array<SimulationsBoolExp>>;
  _not?: InputMaybe<SimulationsBoolExp>;
  _or?: InputMaybe<Array<SimulationsBoolExp>>;
  created?: InputMaybe<TimestampComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  pipelineDescription?: InputMaybe<JsonbComparisonExp>;
  runs?: InputMaybe<RunsBoolExp>;
  runs_aggregate?: InputMaybe<Runs_Aggregate_Bool_Exp>;
  simulationId?: InputMaybe<UuidComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.simulations" */
export enum SimulationsConstraint {
  /** unique or primary key constraint on columns "name" */
  SimulationsNameKey = 'simulations_name_key',
  /** unique or primary key constraint on columns "simulation_id" */
  SimulationsPkey = 'simulations_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type SimulationsDeleteAtPathInput = {
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type SimulationsDeleteElemInput = {
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type SimulationsDeleteKeyInput = {
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "simpipe.simulations" */
export type SimulationsInsertInput = {
  /** DateTime of when the simulation was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** Name of the simulation, it is unique */
  name?: InputMaybe<Scalars['String']>;
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
  runs?: InputMaybe<RunsArrRelInsertInput>;
  /** UUID of the simulation, random by default */
  simulationId?: InputMaybe<Scalars['uuid']>;
  /** User ID of the owner of the simulation */
  userId?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimulationsMaxFields = {
  __typename?: 'simulationsMaxFields';
  /** DateTime of when the simulation was created */
  created?: Maybe<Scalars['timestamp']>;
  /** Name of the simulation, it is unique */
  name?: Maybe<Scalars['String']>;
  /** UUID of the simulation, random by default */
  simulationId?: Maybe<Scalars['uuid']>;
  /** User ID of the owner of the simulation */
  userId?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimulationsMinFields = {
  __typename?: 'simulationsMinFields';
  /** DateTime of when the simulation was created */
  created?: Maybe<Scalars['timestamp']>;
  /** Name of the simulation, it is unique */
  name?: Maybe<Scalars['String']>;
  /** UUID of the simulation, random by default */
  simulationId?: Maybe<Scalars['uuid']>;
  /** User ID of the owner of the simulation */
  userId?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "simpipe.simulations" */
export type SimulationsMutationResponse = {
  __typename?: 'simulationsMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Simulations>;
};

/** input type for inserting object relation for remote table "simpipe.simulations" */
export type SimulationsObjRelInsertInput = {
  data: SimulationsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<SimulationsOnConflict>;
};

/** on_conflict condition type for table "simpipe.simulations" */
export type SimulationsOnConflict = {
  constraint: SimulationsConstraint;
  update_columns?: Array<SimulationsUpdateColumn>;
  where?: InputMaybe<SimulationsBoolExp>;
};

/** Ordering options when selecting data from "simpipe.simulations". */
export type SimulationsOrderBy = {
  created?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  pipelineDescription?: InputMaybe<OrderBy>;
  runsAggregate?: InputMaybe<RunsAggregateOrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.simulations */
export type SimulationsPkColumnsInput = {
  /** UUID of the simulation, random by default */
  simulationId: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type SimulationsPrependInput = {
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "simpipe.simulations" */
export enum SimulationsSelectColumn {
  /** column name */
  Created = 'created',
  /** column name */
  Name = 'name',
  /** column name */
  PipelineDescription = 'pipelineDescription',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "simpipe.simulations" */
export type SimulationsSetInput = {
  /** DateTime of when the simulation was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** Name of the simulation, it is unique */
  name?: InputMaybe<Scalars['String']>;
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
  /** UUID of the simulation, random by default */
  simulationId?: InputMaybe<Scalars['uuid']>;
  /** User ID of the owner of the simulation */
  userId?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "simulations" */
export type SimulationsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SimulationsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SimulationsStreamCursorValueInput = {
  /** DateTime of when the simulation was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** Name of the simulation, it is unique */
  name?: InputMaybe<Scalars['String']>;
  /** Description of the pipeline in JSON */
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
  /** UUID of the simulation, random by default */
  simulationId?: InputMaybe<Scalars['uuid']>;
  /** User ID of the owner of the simulation */
  userId?: InputMaybe<Scalars['String']>;
};

/** update columns of table "simpipe.simulations" */
export enum SimulationsUpdateColumn {
  /** column name */
  Created = 'created',
  /** column name */
  Name = 'name',
  /** column name */
  PipelineDescription = 'pipelineDescription',
  /** column name */
  SimulationId = 'simulationId',
  /** column name */
  UserId = 'userId'
}

export type SimulationsUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<SimulationsAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _deleteAtPath?: InputMaybe<SimulationsDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _deleteElem?: InputMaybe<SimulationsDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _deleteKey?: InputMaybe<SimulationsDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<SimulationsPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimulationsSetInput>;
  /** filter the rows which have to be updated */
  where: SimulationsBoolExp;
};

/** Steps in a run */
export type Steps = {
  __typename?: 'steps';
  /** An array relationship */
  cpu: Array<Cpu>;
  /** An aggregate relationship */
  cpuAggregate: CpuAggregate;
  /** DateTime of when the step was created */
  created: Scalars['timestamp'];
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: Maybe<Scalars['timestamp']>;
  /** An array relationship */
  envs: Array<SimpipeEnvs>;
  /** An aggregate relationship */
  envsAggregate: SimpipeEnvsAggregate;
  /** An array relationship */
  fsReadsMerged: Array<FsReadsMerged>;
  /** An aggregate relationship */
  fsReadsMergedAggregate: FsReadsMergedAggregate;
  /** An array relationship */
  fsWritesMerged: Array<FsWritesMerged>;
  /** An aggregate relationship */
  fsWritesMergedAggregate: FsWritesMergedAggregate;
  /** Docker image of the step */
  image: Scalars['String'];
  /** An object relationship */
  log?: Maybe<SimpipeLogs>;
  /** An array relationship */
  memoryMaxUsageBytes: Array<MemoryMaxUsageBytes>;
  /** An aggregate relationship */
  memoryMaxUsageBytesAggregate: MemoryMaxUsageBytesAggregate;
  /** An array relationship */
  memoryUsageBytes: Array<Steps>;
  /** An aggregate relationship */
  memoryUsageBytesAggregate: StepsAggregate;
  /** Name of the step, it is unique per run */
  name: Scalars['String'];
  /** An array relationship */
  networkReceivedBytes: Array<NetworkReceivedBytes>;
  /** An aggregate relationship */
  networkReceivedBytesAggregate: NetworkReceivedBytesAggregate;
  /** An array relationship */
  networkTransmitBytes: Array<NetworkTransmitBytes>;
  /** An aggregate relationship */
  networkTransmitBytesAggregate: NetworkTransmitBytesAggregate;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber: Scalars['Int'];
  /** An object relationship */
  run: Runs;
  /** UUID of the run, must exist in the runs table */
  runId: Scalars['uuid'];
  /** DateTime of when the step was started, NULL if not started */
  started?: Maybe<Scalars['timestamp']>;
  /** Status of the step, must be one of the values in the step_status enum */
  status: SimpipeStepStatusEnum;
  /** UUID of the step, random by default */
  stepId: Scalars['uuid'];
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout: Scalars['Int'];
};


/** Steps in a run */
export type StepsCpuArgs = {
  distinctOn?: InputMaybe<Array<CpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CpuOrderBy>>;
  where?: InputMaybe<CpuBoolExp>;
};


/** Steps in a run */
export type StepsCpuAggregateArgs = {
  distinctOn?: InputMaybe<Array<CpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CpuOrderBy>>;
  where?: InputMaybe<CpuBoolExp>;
};


/** Steps in a run */
export type StepsEnvsArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


/** Steps in a run */
export type StepsEnvsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


/** Steps in a run */
export type StepsFsReadsMergedArgs = {
  distinctOn?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsReadsMergedOrderBy>>;
  where?: InputMaybe<FsReadsMergedBoolExp>;
};


/** Steps in a run */
export type StepsFsReadsMergedAggregateArgs = {
  distinctOn?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsReadsMergedOrderBy>>;
  where?: InputMaybe<FsReadsMergedBoolExp>;
};


/** Steps in a run */
export type StepsFsWritesMergedArgs = {
  distinctOn?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsWritesMergedOrderBy>>;
  where?: InputMaybe<FsWritesMergedBoolExp>;
};


/** Steps in a run */
export type StepsFsWritesMergedAggregateArgs = {
  distinctOn?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsWritesMergedOrderBy>>;
  where?: InputMaybe<FsWritesMergedBoolExp>;
};


/** Steps in a run */
export type StepsMemoryMaxUsageBytesArgs = {
  distinctOn?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryMaxUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
};


/** Steps in a run */
export type StepsMemoryMaxUsageBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryMaxUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
};


/** Steps in a run */
export type StepsMemoryUsageBytesArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};


/** Steps in a run */
export type StepsMemoryUsageBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};


/** Steps in a run */
export type StepsNetworkReceivedBytesArgs = {
  distinctOn?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkReceivedBytesOrderBy>>;
  where?: InputMaybe<NetworkReceivedBytesBoolExp>;
};


/** Steps in a run */
export type StepsNetworkReceivedBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkReceivedBytesOrderBy>>;
  where?: InputMaybe<NetworkReceivedBytesBoolExp>;
};


/** Steps in a run */
export type StepsNetworkTransmitBytesArgs = {
  distinctOn?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkTransmitBytesOrderBy>>;
  where?: InputMaybe<NetworkTransmitBytesBoolExp>;
};


/** Steps in a run */
export type StepsNetworkTransmitBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkTransmitBytesOrderBy>>;
  where?: InputMaybe<NetworkTransmitBytesBoolExp>;
};

/** aggregated selection of "simpipe.steps" */
export type StepsAggregate = {
  __typename?: 'stepsAggregate';
  aggregate?: Maybe<StepsAggregateFields>;
  nodes: Array<Steps>;
};

/** aggregate fields of "simpipe.steps" */
export type StepsAggregateFields = {
  __typename?: 'stepsAggregateFields';
  avg?: Maybe<StepsAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<StepsMaxFields>;
  min?: Maybe<StepsMinFields>;
  stddev?: Maybe<StepsStddevFields>;
  stddevPop?: Maybe<StepsStddev_PopFields>;
  stddevSamp?: Maybe<StepsStddev_SampFields>;
  sum?: Maybe<StepsSumFields>;
  varPop?: Maybe<StepsVar_PopFields>;
  varSamp?: Maybe<StepsVar_SampFields>;
  variance?: Maybe<StepsVarianceFields>;
};


/** aggregate fields of "simpipe.steps" */
export type StepsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<StepsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.steps" */
export type StepsAggregateOrderBy = {
  avg?: InputMaybe<Steps_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<Steps_Max_Order_By>;
  min?: InputMaybe<Steps_Min_Order_By>;
  stddev?: InputMaybe<Steps_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Steps_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Steps_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Steps_Sum_Order_By>;
  var_pop?: InputMaybe<Steps_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Steps_Var_Samp_Order_By>;
  variance?: InputMaybe<Steps_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.steps" */
export type StepsArrRelInsertInput = {
  data: Array<StepsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<StepsOnConflict>;
};

/** aggregate avg on columns */
export type StepsAvgFields = {
  __typename?: 'stepsAvgFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.steps". All fields are combined with a logical 'AND'. */
export type StepsBoolExp = {
  _and?: InputMaybe<Array<StepsBoolExp>>;
  _not?: InputMaybe<StepsBoolExp>;
  _or?: InputMaybe<Array<StepsBoolExp>>;
  cpu?: InputMaybe<CpuBoolExp>;
  cpu_aggregate?: InputMaybe<Cpu_Aggregate_Bool_Exp>;
  created?: InputMaybe<TimestampComparisonExp>;
  ended?: InputMaybe<TimestampComparisonExp>;
  envs?: InputMaybe<SimpipeEnvsBoolExp>;
  envs_aggregate?: InputMaybe<Simpipe_Envs_Aggregate_Bool_Exp>;
  fsReadsMerged?: InputMaybe<FsReadsMergedBoolExp>;
  fsReadsMerged_aggregate?: InputMaybe<FsReadsMerged_Aggregate_Bool_Exp>;
  fsWritesMerged?: InputMaybe<FsWritesMergedBoolExp>;
  fsWritesMerged_aggregate?: InputMaybe<FsWritesMerged_Aggregate_Bool_Exp>;
  image?: InputMaybe<StringComparisonExp>;
  log?: InputMaybe<SimpipeLogsBoolExp>;
  memoryMaxUsageBytes?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
  memoryMaxUsageBytes_aggregate?: InputMaybe<MemoryMaxUsageBytes_Aggregate_Bool_Exp>;
  memoryUsageBytes?: InputMaybe<StepsBoolExp>;
  memoryUsageBytes_aggregate?: InputMaybe<Steps_Aggregate_Bool_Exp>;
  name?: InputMaybe<StringComparisonExp>;
  networkReceivedBytes?: InputMaybe<NetworkReceivedBytesBoolExp>;
  networkReceivedBytes_aggregate?: InputMaybe<NetworkReceivedBytes_Aggregate_Bool_Exp>;
  networkTransmitBytes?: InputMaybe<NetworkTransmitBytesBoolExp>;
  networkTransmitBytes_aggregate?: InputMaybe<NetworkTransmitBytes_Aggregate_Bool_Exp>;
  pipelineStepNumber?: InputMaybe<IntComparisonExp>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<UuidComparisonExp>;
  started?: InputMaybe<TimestampComparisonExp>;
  status?: InputMaybe<SimpipeStepStatusEnumComparisonExp>;
  stepId?: InputMaybe<UuidComparisonExp>;
  timeout?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.steps" */
export enum StepsConstraint {
  /** unique or primary key constraint on columns "run_id", "pipeline_step_number" */
  StepsPipelineStepNumberRunIdKey = 'steps_pipeline_step_number_run_id_key',
  /** unique or primary key constraint on columns "step_id" */
  StepsPkey = 'steps_pkey',
  /** unique or primary key constraint on columns "run_id", "name" */
  StepsRunIdNameKey = 'steps_run_id_name_key'
}

/** input type for incrementing numeric columns in table "simpipe.steps" */
export type StepsIncInput = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "simpipe.steps" */
export type StepsInsertInput = {
  cpu?: InputMaybe<CpuArrRelInsertInput>;
  /** DateTime of when the step was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: InputMaybe<Scalars['timestamp']>;
  envs?: InputMaybe<SimpipeEnvsArrRelInsertInput>;
  fsReadsMerged?: InputMaybe<FsReadsMergedArrRelInsertInput>;
  fsWritesMerged?: InputMaybe<FsWritesMergedArrRelInsertInput>;
  /** Docker image of the step */
  image?: InputMaybe<Scalars['String']>;
  log?: InputMaybe<SimpipeLogsObjRelInsertInput>;
  memoryMaxUsageBytes?: InputMaybe<MemoryMaxUsageBytesArrRelInsertInput>;
  memoryUsageBytes?: InputMaybe<StepsArrRelInsertInput>;
  /** Name of the step, it is unique per run */
  name?: InputMaybe<Scalars['String']>;
  networkReceivedBytes?: InputMaybe<NetworkReceivedBytesArrRelInsertInput>;
  networkTransmitBytes?: InputMaybe<NetworkTransmitBytesArrRelInsertInput>;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  run?: InputMaybe<RunsObjRelInsertInput>;
  /** UUID of the run, must exist in the runs table */
  runId?: InputMaybe<Scalars['uuid']>;
  /** DateTime of when the step was started, NULL if not started */
  started?: InputMaybe<Scalars['timestamp']>;
  /** Status of the step, must be one of the values in the step_status enum */
  status?: InputMaybe<SimpipeStepStatusEnum>;
  /** UUID of the step, random by default */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type StepsMaxFields = {
  __typename?: 'stepsMaxFields';
  /** DateTime of when the step was created */
  created?: Maybe<Scalars['timestamp']>;
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: Maybe<Scalars['timestamp']>;
  /** Docker image of the step */
  image?: Maybe<Scalars['String']>;
  /** Name of the step, it is unique per run */
  name?: Maybe<Scalars['String']>;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Int']>;
  /** UUID of the run, must exist in the runs table */
  runId?: Maybe<Scalars['uuid']>;
  /** DateTime of when the step was started, NULL if not started */
  started?: Maybe<Scalars['timestamp']>;
  /** UUID of the step, random by default */
  stepId?: Maybe<Scalars['uuid']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type StepsMinFields = {
  __typename?: 'stepsMinFields';
  /** DateTime of when the step was created */
  created?: Maybe<Scalars['timestamp']>;
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: Maybe<Scalars['timestamp']>;
  /** Docker image of the step */
  image?: Maybe<Scalars['String']>;
  /** Name of the step, it is unique per run */
  name?: Maybe<Scalars['String']>;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Int']>;
  /** UUID of the run, must exist in the runs table */
  runId?: Maybe<Scalars['uuid']>;
  /** DateTime of when the step was started, NULL if not started */
  started?: Maybe<Scalars['timestamp']>;
  /** UUID of the step, random by default */
  stepId?: Maybe<Scalars['uuid']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Int']>;
};

/** response of any mutation on the table "simpipe.steps" */
export type StepsMutationResponse = {
  __typename?: 'stepsMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Steps>;
};

/** input type for inserting object relation for remote table "simpipe.steps" */
export type StepsObjRelInsertInput = {
  data: StepsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<StepsOnConflict>;
};

/** on_conflict condition type for table "simpipe.steps" */
export type StepsOnConflict = {
  constraint: StepsConstraint;
  update_columns?: Array<StepsUpdateColumn>;
  where?: InputMaybe<StepsBoolExp>;
};

/** Ordering options when selecting data from "simpipe.steps". */
export type StepsOrderBy = {
  cpuAggregate?: InputMaybe<CpuAggregateOrderBy>;
  created?: InputMaybe<OrderBy>;
  ended?: InputMaybe<OrderBy>;
  envsAggregate?: InputMaybe<SimpipeEnvsAggregateOrderBy>;
  fsReadsMergedAggregate?: InputMaybe<FsReadsMergedAggregateOrderBy>;
  fsWritesMergedAggregate?: InputMaybe<FsWritesMergedAggregateOrderBy>;
  image?: InputMaybe<OrderBy>;
  log?: InputMaybe<SimpipeLogsOrderBy>;
  memoryMaxUsageBytesAggregate?: InputMaybe<MemoryMaxUsageBytesAggregateOrderBy>;
  memoryUsageBytesAggregate?: InputMaybe<StepsAggregateOrderBy>;
  name?: InputMaybe<OrderBy>;
  networkReceivedBytesAggregate?: InputMaybe<NetworkReceivedBytesAggregateOrderBy>;
  networkTransmitBytesAggregate?: InputMaybe<NetworkTransmitBytesAggregateOrderBy>;
  pipelineStepNumber?: InputMaybe<OrderBy>;
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  started?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.steps */
export type StepsPkColumnsInput = {
  /** UUID of the step, random by default */
  stepId: Scalars['uuid'];
};

/** select columns of table "simpipe.steps" */
export enum StepsSelectColumn {
  /** column name */
  Created = 'created',
  /** column name */
  Ended = 'ended',
  /** column name */
  Image = 'image',
  /** column name */
  Name = 'name',
  /** column name */
  PipelineStepNumber = 'pipelineStepNumber',
  /** column name */
  RunId = 'runId',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Timeout = 'timeout'
}

/** input type for updating data in table "simpipe.steps" */
export type StepsSetInput = {
  /** DateTime of when the step was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: InputMaybe<Scalars['timestamp']>;
  /** Docker image of the step */
  image?: InputMaybe<Scalars['String']>;
  /** Name of the step, it is unique per run */
  name?: InputMaybe<Scalars['String']>;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  /** UUID of the run, must exist in the runs table */
  runId?: InputMaybe<Scalars['uuid']>;
  /** DateTime of when the step was started, NULL if not started */
  started?: InputMaybe<Scalars['timestamp']>;
  /** Status of the step, must be one of the values in the step_status enum */
  status?: InputMaybe<SimpipeStepStatusEnum>;
  /** UUID of the step, random by default */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type StepsStddevFields = {
  __typename?: 'stepsStddevFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type StepsStddev_PopFields = {
  __typename?: 'stepsStddev_popFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type StepsStddev_SampFields = {
  __typename?: 'stepsStddev_sampFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "steps" */
export type StepsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: StepsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type StepsStreamCursorValueInput = {
  /** DateTime of when the step was created */
  created?: InputMaybe<Scalars['timestamp']>;
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: InputMaybe<Scalars['timestamp']>;
  /** Docker image of the step */
  image?: InputMaybe<Scalars['String']>;
  /** Name of the step, it is unique per run */
  name?: InputMaybe<Scalars['String']>;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  /** UUID of the run, must exist in the runs table */
  runId?: InputMaybe<Scalars['uuid']>;
  /** DateTime of when the step was started, NULL if not started */
  started?: InputMaybe<Scalars['timestamp']>;
  /** Status of the step, must be one of the values in the step_status enum */
  status?: InputMaybe<SimpipeStepStatusEnum>;
  /** UUID of the step, random by default */
  stepId?: InputMaybe<Scalars['uuid']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<Scalars['Int']>;
};

/** aggregate sum on columns */
export type StepsSumFields = {
  __typename?: 'stepsSumFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Int']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Int']>;
};

/** update columns of table "simpipe.steps" */
export enum StepsUpdateColumn {
  /** column name */
  Created = 'created',
  /** column name */
  Ended = 'ended',
  /** column name */
  Image = 'image',
  /** column name */
  Name = 'name',
  /** column name */
  PipelineStepNumber = 'pipelineStepNumber',
  /** column name */
  RunId = 'runId',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Timeout = 'timeout'
}

export type StepsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<StepsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<StepsSetInput>;
  /** filter the rows which have to be updated */
  where: StepsBoolExp;
};

/** aggregate var_pop on columns */
export type StepsVar_PopFields = {
  __typename?: 'stepsVar_popFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type StepsVar_SampFields = {
  __typename?: 'stepsVar_sampFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type StepsVarianceFields = {
  __typename?: 'stepsVarianceFields';
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: Maybe<Scalars['Float']>;
};

export type Steps_Aggregate_Bool_Exp = {
  count?: InputMaybe<Steps_Aggregate_Bool_Exp_Count>;
};

export type Steps_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<StepsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<StepsBoolExp>;
  predicate: IntComparisonExp;
};

/** order by avg() on columns of table "simpipe.steps" */
export type Steps_Avg_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.steps" */
export type Steps_Max_Order_By = {
  /** DateTime of when the step was created */
  created?: InputMaybe<OrderBy>;
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: InputMaybe<OrderBy>;
  /** Docker image of the step */
  image?: InputMaybe<OrderBy>;
  /** Name of the step, it is unique per run */
  name?: InputMaybe<OrderBy>;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** UUID of the run, must exist in the runs table */
  runId?: InputMaybe<OrderBy>;
  /** DateTime of when the step was started, NULL if not started */
  started?: InputMaybe<OrderBy>;
  /** UUID of the step, random by default */
  stepId?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.steps" */
export type Steps_Min_Order_By = {
  /** DateTime of when the step was created */
  created?: InputMaybe<OrderBy>;
  /** DateTime of when the step was ended, NULL if not ended */
  ended?: InputMaybe<OrderBy>;
  /** Docker image of the step */
  image?: InputMaybe<OrderBy>;
  /** Name of the step, it is unique per run */
  name?: InputMaybe<OrderBy>;
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** UUID of the run, must exist in the runs table */
  runId?: InputMaybe<OrderBy>;
  /** DateTime of when the step was started, NULL if not started */
  started?: InputMaybe<OrderBy>;
  /** UUID of the step, random by default */
  stepId?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by stddev() on columns of table "simpipe.steps" */
export type Steps_Stddev_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.steps" */
export type Steps_Stddev_Pop_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.steps" */
export type Steps_Stddev_Samp_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.steps" */
export type Steps_Sum_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.steps" */
export type Steps_Var_Pop_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.steps" */
export type Steps_Var_Samp_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.steps" */
export type Steps_Variance_Order_By = {
  /** Step number in the pipeline, must be unique per run and a positive integer */
  pipelineStepNumber?: InputMaybe<OrderBy>;
  /** Timeout of the step in seconds, must be between 1 and 86400 */
  timeout?: InputMaybe<OrderBy>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  cpu: Array<Cpu>;
  /** An aggregate relationship */
  cpuAggregate: CpuAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.cpu" */
  cpuStream: Array<Cpu>;
  /** An array relationship */
  fsReadsMerged: Array<FsReadsMerged>;
  /** An aggregate relationship */
  fsReadsMergedAggregate: FsReadsMergedAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.fs_reads_merged" */
  fsReadsMergedStream: Array<FsReadsMerged>;
  /** An array relationship */
  fsWritesMerged: Array<FsWritesMerged>;
  /** An aggregate relationship */
  fsWritesMergedAggregate: FsWritesMergedAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.fs_writes_merged" */
  fsWritesMergedStream: Array<FsWritesMerged>;
  /** An array relationship */
  memoryMaxUsageBytes: Array<MemoryMaxUsageBytes>;
  /** An aggregate relationship */
  memoryMaxUsageBytesAggregate: MemoryMaxUsageBytesAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.memory_max_usage_bytes" */
  memoryMaxUsageBytesStream: Array<MemoryMaxUsageBytes>;
  /** fetch data from the table: "simpipe.memory_usage_bytes" */
  memoryUsageBytes: Array<MemoryUsageBytes>;
  /** fetch aggregated fields from the table: "simpipe.memory_usage_bytes" */
  memoryUsageBytesAggregate: MemoryUsageBytesAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.memory_usage_bytes" */
  memoryUsageBytesStream: Array<MemoryUsageBytes>;
  /** An array relationship */
  networkReceivedBytes: Array<NetworkReceivedBytes>;
  /** An aggregate relationship */
  networkReceivedBytesAggregate: NetworkReceivedBytesAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.network_received_bytes" */
  networkReceivedBytesStream: Array<NetworkReceivedBytes>;
  /** An array relationship */
  networkTransmitBytes: Array<NetworkTransmitBytes>;
  /** An aggregate relationship */
  networkTransmitBytesAggregate: NetworkTransmitBytesAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.network_transmit_bytes" */
  networkTransmitBytesStream: Array<NetworkTransmitBytes>;
  /** fetch data from the table: "simpipe.runs" using primary key columns */
  run?: Maybe<Runs>;
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runsAggregate: RunsAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.runs" */
  runsStream: Array<Runs>;
  /** fetch data from the table: "simpipe.envs" */
  simpipeEnvs: Array<SimpipeEnvs>;
  /** fetch aggregated fields from the table: "simpipe.envs" */
  simpipeEnvsAggregate: SimpipeEnvsAggregate;
  /** fetch data from the table: "simpipe.envs" using primary key columns */
  simpipeEnvsByPk?: Maybe<SimpipeEnvs>;
  /** fetch data from the table in a streaming manner: "simpipe.envs" */
  simpipeEnvsStream: Array<SimpipeEnvs>;
  /** fetch data from the table: "simpipe.logs" */
  simpipeLogs: Array<SimpipeLogs>;
  /** fetch aggregated fields from the table: "simpipe.logs" */
  simpipeLogsAggregate: SimpipeLogsAggregate;
  /** fetch data from the table: "simpipe.logs" using primary key columns */
  simpipeLogsByPk?: Maybe<SimpipeLogs>;
  /** fetch data from the table in a streaming manner: "simpipe.logs" */
  simpipeLogsStream: Array<SimpipeLogs>;
  /** fetch data from the table: "simpipe.run_status" */
  simpipeRunStatus: Array<SimpipeRunStatus>;
  /** fetch aggregated fields from the table: "simpipe.run_status" */
  simpipeRunStatusAggregate: SimpipeRunStatusAggregate;
  /** fetch data from the table: "simpipe.run_status" using primary key columns */
  simpipeRunStatusByPk?: Maybe<SimpipeRunStatus>;
  /** fetch data from the table in a streaming manner: "simpipe.run_status" */
  simpipeRunStatusStream: Array<SimpipeRunStatus>;
  /** fetch data from the table: "simpipe.step_status" */
  simpipeStepStatus: Array<SimpipeStepStatus>;
  /** fetch aggregated fields from the table: "simpipe.step_status" */
  simpipeStepStatusAggregate: SimpipeStepStatusAggregate;
  /** fetch data from the table: "simpipe.step_status" using primary key columns */
  simpipeStepStatusByPk?: Maybe<SimpipeStepStatus>;
  /** fetch data from the table in a streaming manner: "simpipe.step_status" */
  simpipeStepStatusStream: Array<SimpipeStepStatus>;
  /** fetch data from the table: "simpipe.simulations" using primary key columns */
  simulation?: Maybe<Simulations>;
  /** fetch data from the table: "simpipe.simulations" */
  simulations: Array<Simulations>;
  /** fetch aggregated fields from the table: "simpipe.simulations" */
  simulationsAggregate: SimulationsAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.simulations" */
  simulationsStream: Array<Simulations>;
  /** An array relationship */
  steps: Array<Steps>;
  /** An aggregate relationship */
  stepsAggregate: StepsAggregate;
  /** fetch data from the table: "simpipe.steps" using primary key columns */
  stepsByPk?: Maybe<Steps>;
  /** fetch data from the table in a streaming manner: "simpipe.steps" */
  stepsStream: Array<Steps>;
};


export type Subscription_RootCpuArgs = {
  distinctOn?: InputMaybe<Array<CpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CpuOrderBy>>;
  where?: InputMaybe<CpuBoolExp>;
};


export type Subscription_RootCpuAggregateArgs = {
  distinctOn?: InputMaybe<Array<CpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CpuOrderBy>>;
  where?: InputMaybe<CpuBoolExp>;
};


export type Subscription_RootCpuStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<CpuStreamCursorInput>>;
  where?: InputMaybe<CpuBoolExp>;
};


export type Subscription_RootFsReadsMergedArgs = {
  distinctOn?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsReadsMergedOrderBy>>;
  where?: InputMaybe<FsReadsMergedBoolExp>;
};


export type Subscription_RootFsReadsMergedAggregateArgs = {
  distinctOn?: InputMaybe<Array<FsReadsMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsReadsMergedOrderBy>>;
  where?: InputMaybe<FsReadsMergedBoolExp>;
};


export type Subscription_RootFsReadsMergedStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<FsReadsMergedStreamCursorInput>>;
  where?: InputMaybe<FsReadsMergedBoolExp>;
};


export type Subscription_RootFsWritesMergedArgs = {
  distinctOn?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsWritesMergedOrderBy>>;
  where?: InputMaybe<FsWritesMergedBoolExp>;
};


export type Subscription_RootFsWritesMergedAggregateArgs = {
  distinctOn?: InputMaybe<Array<FsWritesMergedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<FsWritesMergedOrderBy>>;
  where?: InputMaybe<FsWritesMergedBoolExp>;
};


export type Subscription_RootFsWritesMergedStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<FsWritesMergedStreamCursorInput>>;
  where?: InputMaybe<FsWritesMergedBoolExp>;
};


export type Subscription_RootMemoryMaxUsageBytesArgs = {
  distinctOn?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryMaxUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
};


export type Subscription_RootMemoryMaxUsageBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<MemoryMaxUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryMaxUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
};


export type Subscription_RootMemoryMaxUsageBytesStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<MemoryMaxUsageBytesStreamCursorInput>>;
  where?: InputMaybe<MemoryMaxUsageBytesBoolExp>;
};


export type Subscription_RootMemoryUsageBytesArgs = {
  distinctOn?: InputMaybe<Array<MemoryUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryUsageBytesBoolExp>;
};


export type Subscription_RootMemoryUsageBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<MemoryUsageBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MemoryUsageBytesOrderBy>>;
  where?: InputMaybe<MemoryUsageBytesBoolExp>;
};


export type Subscription_RootMemoryUsageBytesStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<MemoryUsageBytesStreamCursorInput>>;
  where?: InputMaybe<MemoryUsageBytesBoolExp>;
};


export type Subscription_RootNetworkReceivedBytesArgs = {
  distinctOn?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkReceivedBytesOrderBy>>;
  where?: InputMaybe<NetworkReceivedBytesBoolExp>;
};


export type Subscription_RootNetworkReceivedBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NetworkReceivedBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkReceivedBytesOrderBy>>;
  where?: InputMaybe<NetworkReceivedBytesBoolExp>;
};


export type Subscription_RootNetworkReceivedBytesStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<NetworkReceivedBytesStreamCursorInput>>;
  where?: InputMaybe<NetworkReceivedBytesBoolExp>;
};


export type Subscription_RootNetworkTransmitBytesArgs = {
  distinctOn?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkTransmitBytesOrderBy>>;
  where?: InputMaybe<NetworkTransmitBytesBoolExp>;
};


export type Subscription_RootNetworkTransmitBytesAggregateArgs = {
  distinctOn?: InputMaybe<Array<NetworkTransmitBytesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<NetworkTransmitBytesOrderBy>>;
  where?: InputMaybe<NetworkTransmitBytesBoolExp>;
};


export type Subscription_RootNetworkTransmitBytesStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<NetworkTransmitBytesStreamCursorInput>>;
  where?: InputMaybe<NetworkTransmitBytesBoolExp>;
};


export type Subscription_RootRunArgs = {
  runId: Scalars['uuid'];
};


export type Subscription_RootRunsArgs = {
  distinctOn?: InputMaybe<Array<RunsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RunsOrderBy>>;
  where?: InputMaybe<RunsBoolExp>;
};


export type Subscription_RootRunsAggregateArgs = {
  distinctOn?: InputMaybe<Array<RunsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<RunsOrderBy>>;
  where?: InputMaybe<RunsBoolExp>;
};


export type Subscription_RootRunsStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<RunsStreamCursorInput>>;
  where?: InputMaybe<RunsBoolExp>;
};


export type Subscription_RootSimpipeEnvsArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


export type Subscription_RootSimpipeEnvsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


export type Subscription_RootSimpipeEnvsByPkArgs = {
  envId: Scalars['uuid'];
};


export type Subscription_RootSimpipeEnvsStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<SimpipeEnvsStreamCursorInput>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


export type Subscription_RootSimpipeLogsArgs = {
  distinctOn?: InputMaybe<Array<SimpipeLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeLogsOrderBy>>;
  where?: InputMaybe<SimpipeLogsBoolExp>;
};


export type Subscription_RootSimpipeLogsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeLogsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeLogsOrderBy>>;
  where?: InputMaybe<SimpipeLogsBoolExp>;
};


export type Subscription_RootSimpipeLogsByPkArgs = {
  stepId: Scalars['uuid'];
};


export type Subscription_RootSimpipeLogsStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<SimpipeLogsStreamCursorInput>>;
  where?: InputMaybe<SimpipeLogsBoolExp>;
};


export type Subscription_RootSimpipeRunStatusArgs = {
  distinctOn?: InputMaybe<Array<SimpipeRunStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeRunStatusOrderBy>>;
  where?: InputMaybe<SimpipeRunStatusBoolExp>;
};


export type Subscription_RootSimpipeRunStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeRunStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeRunStatusOrderBy>>;
  where?: InputMaybe<SimpipeRunStatusBoolExp>;
};


export type Subscription_RootSimpipeRunStatusByPkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootSimpipeRunStatusStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<SimpipeRunStatusStreamCursorInput>>;
  where?: InputMaybe<SimpipeRunStatusBoolExp>;
};


export type Subscription_RootSimpipeStepStatusArgs = {
  distinctOn?: InputMaybe<Array<SimpipeStepStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeStepStatusOrderBy>>;
  where?: InputMaybe<SimpipeStepStatusBoolExp>;
};


export type Subscription_RootSimpipeStepStatusAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeStepStatusSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeStepStatusOrderBy>>;
  where?: InputMaybe<SimpipeStepStatusBoolExp>;
};


export type Subscription_RootSimpipeStepStatusByPkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootSimpipeStepStatusStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<SimpipeStepStatusStreamCursorInput>>;
  where?: InputMaybe<SimpipeStepStatusBoolExp>;
};


export type Subscription_RootSimulationArgs = {
  simulationId: Scalars['uuid'];
};


export type Subscription_RootSimulationsArgs = {
  distinctOn?: InputMaybe<Array<SimulationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimulationsOrderBy>>;
  where?: InputMaybe<SimulationsBoolExp>;
};


export type Subscription_RootSimulationsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimulationsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimulationsOrderBy>>;
  where?: InputMaybe<SimulationsBoolExp>;
};


export type Subscription_RootSimulationsStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<SimulationsStreamCursorInput>>;
  where?: InputMaybe<SimulationsBoolExp>;
};


export type Subscription_RootStepsArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};


export type Subscription_RootStepsAggregateArgs = {
  distinctOn?: InputMaybe<Array<StepsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<StepsOrderBy>>;
  where?: InputMaybe<StepsBoolExp>;
};


export type Subscription_RootStepsByPkArgs = {
  stepId: Scalars['uuid'];
};


export type Subscription_RootStepsStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<StepsStreamCursorInput>>;
  where?: InputMaybe<StepsBoolExp>;
};

export type PingQueryVariables = Exact<{
  _?: InputMaybe<Scalars['Boolean']>;
}>;


export type PingQuery = { __typename: 'query_root' };

export type GetUserIdFromRunQueryVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type GetUserIdFromRunQuery = { __typename?: 'query_root', run?: { __typename?: 'runs', simulation: { __typename?: 'simulations', userId: string } } | null };

export type GetUserIdFromSimulationQueryVariables = Exact<{
  simulationId: Scalars['uuid'];
}>;


export type GetUserIdFromSimulationQuery = { __typename?: 'query_root', simulation?: { __typename?: 'simulations', userId: string } | null };

export type GetSimulationDslQueryVariables = Exact<{
  simulationId: Scalars['uuid'];
}>;


export type GetSimulationDslQuery = { __typename?: 'query_root', simulation?: { __typename?: 'simulations', pipelineDescription: unknown } | null };

export type CreateRunMutationVariables = Exact<{
  simulationId: Scalars['uuid'];
  name: Scalars['String'];
}>;


export type CreateRunMutation = { __typename?: 'mutation_root', insertRunsOne?: { __typename?: 'runs', runId: string } | null };

export type CreateStepMutationVariables = Exact<{
  runId: Scalars['uuid'];
  name: Scalars['String'];
  image: Scalars['String'];
  pipelineStepNumber: Scalars['Int'];
}>;


export type CreateStepMutation = { __typename?: 'mutation_root', insertStepsOne?: { __typename?: 'steps', stepId: string } | null };

export type SetStepAsStartedMutationVariables = Exact<{
  stepId: Scalars['uuid'];
}>;


export type SetStepAsStartedMutation = { __typename?: 'mutation_root', updateStepsByPk?: { __typename?: 'steps', stepId: string } | null };

export type SetStepAsEndedSuccessMutationVariables = Exact<{
  stepId: Scalars['uuid'];
  started: Scalars['timestamp'];
  ended: Scalars['timestamp'];
}>;


export type SetStepAsEndedSuccessMutation = { __typename?: 'mutation_root', updateStepsByPk?: { __typename?: 'steps', stepId: string } | null };

export type SetStepAsCancelledMutationVariables = Exact<{
  stepId: Scalars['uuid'];
}>;


export type SetStepAsCancelledMutation = { __typename?: 'mutation_root', updateStepsByPk?: { __typename?: 'steps', stepId: string } | null };

export type SetStepAsFailedMutationVariables = Exact<{
  stepId: Scalars['uuid'];
}>;


export type SetStepAsFailedMutation = { __typename?: 'mutation_root', updateStepsByPk?: { __typename?: 'steps', stepId: string } | null };

export type SetRunAsStartedMutationVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type SetRunAsStartedMutation = { __typename?: 'mutation_root', updateRunsByPk?: { __typename?: 'runs', runId: string, name: string, simulation: { __typename?: 'simulations', name: string, simulationId: string, userId: string }, steps: Array<{ __typename?: 'steps', stepId: string, name: string, image: string, timeout: number, pipelineStepNumber: number, envs: Array<{ __typename?: 'SimpipeEnvs', name: string, value: string }> }> } | null };

export type SetRunAsQueuedMutationVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type SetRunAsQueuedMutation = { __typename?: 'mutation_root', updateRunsByPk?: { __typename?: 'runs', runId: string } | null };

export type SetRunAsEndedSuccessMutationVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type SetRunAsEndedSuccessMutation = { __typename?: 'mutation_root', updateRunsByPk?: { __typename?: 'runs', runId: string } | null };

export type SetRunAsCancelledMutationVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type SetRunAsCancelledMutation = { __typename?: 'mutation_root', updateRunsByPk?: { __typename?: 'runs', runId: string } | null };

export type SetRunAsFailedMutationVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type SetRunAsFailedMutation = { __typename?: 'mutation_root', updateRunsByPk?: { __typename?: 'runs', runId: string } | null };

export type CreateSimulationMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
  userId?: InputMaybe<Scalars['String']>;
}>;


export type CreateSimulationMutation = { __typename?: 'mutation_root', insertSimulationsOne?: { __typename?: 'simulations', simulationId: string } | null };

export type GetSimulationIdandStepsQueryVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type GetSimulationIdandStepsQuery = { __typename?: 'query_root', run?: { __typename?: 'runs', simulationId: string, name: string, steps: Array<{ __typename?: 'steps', stepId: string, pipelineStepNumber: number, image: string, name: string }> } | null };

export type GetRunDetailsQueryVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type GetRunDetailsQuery = { __typename?: 'query_root', run?: { __typename?: 'runs', simulationId: string, name: string, steps: Array<{ __typename?: 'steps', stepId: string, pipelineStepNumber: number, image: string, name: string }> } | null };

export type InsertLogMutationVariables = Exact<{
  stepId: Scalars['uuid'];
  text: Scalars['String'];
}>;


export type InsertLogMutation = { __typename?: 'mutation_root', insertSimpipeLogsOne?: { __typename?: 'SimpipeLogs', stepId: string } | null };


export const PingDocument = gql`
    query ping($_: Boolean) {
  __typename
}
    `;
export const GetUserIdFromRunDocument = gql`
    query getUserIdFromRun($runId: uuid!) {
  run(runId: $runId) {
    simulation {
      userId
    }
  }
}
    `;
export const GetUserIdFromSimulationDocument = gql`
    query getUserIdFromSimulation($simulationId: uuid!) {
  simulation(simulationId: $simulationId) {
    userId
  }
}
    `;
export const GetSimulationDslDocument = gql`
    query getSimulationDSL($simulationId: uuid!) {
  simulation(simulationId: $simulationId) {
    pipelineDescription
  }
}
    `;
export const CreateRunDocument = gql`
    mutation createRun($simulationId: uuid!, $name: String!) {
  insertRunsOne(object: {simulationId: $simulationId, name: $name}) {
    runId
  }
}
    `;
export const CreateStepDocument = gql`
    mutation createStep($runId: uuid!, $name: String!, $image: String!, $pipelineStepNumber: Int!) {
  insertStepsOne(
    object: {runId: $runId, name: $name, image: $image, pipelineStepNumber: $pipelineStepNumber}
  ) {
    stepId
  }
}
    `;
export const SetStepAsStartedDocument = gql`
    mutation setStepAsStarted($stepId: uuid!) {
  updateStepsByPk(
    pk_columns: {stepId: $stepId}
    _set: {started: "now()", status: ACTIVE}
  ) {
    stepId
  }
}
    `;
export const SetStepAsEndedSuccessDocument = gql`
    mutation setStepAsEndedSuccess($stepId: uuid!, $started: timestamp!, $ended: timestamp!) {
  updateStepsByPk(
    pk_columns: {stepId: $stepId}
    _set: {started: $started, ended: $ended, status: COMPLETED}
  ) {
    stepId
  }
}
    `;
export const SetStepAsCancelledDocument = gql`
    mutation setStepAsCancelled($stepId: uuid!) {
  updateStepsByPk(pk_columns: {stepId: $stepId}, _set: {status: CANCELLED}) {
    stepId
  }
}
    `;
export const SetStepAsFailedDocument = gql`
    mutation setStepAsFailed($stepId: uuid!) {
  updateStepsByPk(pk_columns: {stepId: $stepId}, _set: {status: FAILED}) {
    stepId
  }
}
    `;
export const SetRunAsStartedDocument = gql`
    mutation setRunAsStarted($runId: uuid!) {
  updateRunsByPk(
    pk_columns: {runId: $runId}
    _set: {started: "now()", status: ACTIVE}
  ) {
    runId
    name
    simulation {
      name
      simulationId
      userId
    }
    steps(orderBy: {pipelineStepNumber: ASC}) {
      stepId
      name
      image
      timeout
      pipelineStepNumber
      envs {
        name
        value
      }
    }
  }
}
    `;
export const SetRunAsQueuedDocument = gql`
    mutation setRunAsQueued($runId: uuid!) {
  updateRunsByPk(pk_columns: {runId: $runId}, _set: {status: QUEUED}) {
    runId
  }
}
    `;
export const SetRunAsEndedSuccessDocument = gql`
    mutation setRunAsEndedSuccess($runId: uuid!) {
  updateRunsByPk(
    pk_columns: {runId: $runId}
    _set: {ended: "now()", status: COMPLETED}
  ) {
    runId
  }
}
    `;
export const SetRunAsCancelledDocument = gql`
    mutation setRunAsCancelled($runId: uuid!) {
  updateRunsByPk(pk_columns: {runId: $runId}, _set: {status: CANCELLED}) {
    runId
  }
}
    `;
export const SetRunAsFailedDocument = gql`
    mutation setRunAsFailed($runId: uuid!) {
  updateRunsByPk(pk_columns: {runId: $runId}, _set: {status: FAILED}) {
    runId
  }
}
    `;
export const CreateSimulationDocument = gql`
    mutation createSimulation($name: String, $pipelineDescription: jsonb, $userId: String) {
  insertSimulationsOne(
    object: {name: $name, pipelineDescription: $pipelineDescription, userId: $userId}
  ) {
    simulationId
  }
}
    `;
export const GetSimulationIdandStepsDocument = gql`
    query getSimulationIdandSteps($runId: uuid!) {
  run(runId: $runId) {
    simulationId
    name
    steps(orderBy: {pipelineStepNumber: ASC}) {
      stepId
      pipelineStepNumber
      image
      name
    }
  }
}
    `;
export const GetRunDetailsDocument = gql`
    query getRunDetails($runId: uuid!) {
  run(runId: $runId) {
    simulationId
    name
    steps(orderBy: {pipelineStepNumber: ASC}) {
      stepId
      pipelineStepNumber
      image
      name
    }
  }
}
    `;
export const InsertLogDocument = gql`
    mutation insertLog($stepId: uuid!, $text: String!) {
  insertSimpipeLogsOne(object: {stepId: $stepId, text: $text}) {
    stepId
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    ping(variables?: PingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PingQuery>(PingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ping', 'query');
    },
    getUserIdFromRun(variables: GetUserIdFromRunQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserIdFromRunQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserIdFromRunQuery>(GetUserIdFromRunDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserIdFromRun', 'query');
    },
    getUserIdFromSimulation(variables: GetUserIdFromSimulationQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserIdFromSimulationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserIdFromSimulationQuery>(GetUserIdFromSimulationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserIdFromSimulation', 'query');
    },
    getSimulationDSL(variables: GetSimulationDslQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSimulationDslQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSimulationDslQuery>(GetSimulationDslDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSimulationDSL', 'query');
    },
    createRun(variables: CreateRunMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateRunMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateRunMutation>(CreateRunDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createRun', 'mutation');
    },
    createStep(variables: CreateStepMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateStepMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateStepMutation>(CreateStepDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createStep', 'mutation');
    },
    setStepAsStarted(variables: SetStepAsStartedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetStepAsStartedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetStepAsStartedMutation>(SetStepAsStartedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setStepAsStarted', 'mutation');
    },
    setStepAsEndedSuccess(variables: SetStepAsEndedSuccessMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetStepAsEndedSuccessMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetStepAsEndedSuccessMutation>(SetStepAsEndedSuccessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setStepAsEndedSuccess', 'mutation');
    },
    setStepAsCancelled(variables: SetStepAsCancelledMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetStepAsCancelledMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetStepAsCancelledMutation>(SetStepAsCancelledDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setStepAsCancelled', 'mutation');
    },
    setStepAsFailed(variables: SetStepAsFailedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetStepAsFailedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetStepAsFailedMutation>(SetStepAsFailedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setStepAsFailed', 'mutation');
    },
    setRunAsStarted(variables: SetRunAsStartedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetRunAsStartedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetRunAsStartedMutation>(SetRunAsStartedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setRunAsStarted', 'mutation');
    },
    setRunAsQueued(variables: SetRunAsQueuedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetRunAsQueuedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetRunAsQueuedMutation>(SetRunAsQueuedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setRunAsQueued', 'mutation');
    },
    setRunAsEndedSuccess(variables: SetRunAsEndedSuccessMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetRunAsEndedSuccessMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetRunAsEndedSuccessMutation>(SetRunAsEndedSuccessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setRunAsEndedSuccess', 'mutation');
    },
    setRunAsCancelled(variables: SetRunAsCancelledMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetRunAsCancelledMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetRunAsCancelledMutation>(SetRunAsCancelledDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setRunAsCancelled', 'mutation');
    },
    setRunAsFailed(variables: SetRunAsFailedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetRunAsFailedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetRunAsFailedMutation>(SetRunAsFailedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'setRunAsFailed', 'mutation');
    },
    createSimulation(variables?: CreateSimulationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateSimulationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateSimulationMutation>(CreateSimulationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createSimulation', 'mutation');
    },
    getSimulationIdandSteps(variables: GetSimulationIdandStepsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSimulationIdandStepsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSimulationIdandStepsQuery>(GetSimulationIdandStepsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getSimulationIdandSteps', 'query');
    },
    getRunDetails(variables: GetRunDetailsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRunDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRunDetailsQuery>(GetRunDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getRunDetails', 'query');
    },
    insertLog(variables: InsertLogMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InsertLogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InsertLogMutation>(InsertLogDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'insertLog', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;