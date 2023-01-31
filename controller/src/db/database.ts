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
  bigint: number;
  float8: number;
  jsonb: unknown;
  numeric: number;
  timestamptz: string;
  uuid: string;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type BigintComparisonExp = {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
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

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type NumericComparisonExp = {
  _eq?: InputMaybe<Scalars['numeric']>;
  _gt?: InputMaybe<Scalars['numeric']>;
  _gte?: InputMaybe<Scalars['numeric']>;
  _in?: InputMaybe<Array<Scalars['numeric']>>;
  _isNull?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['numeric']>;
  _lte?: InputMaybe<Scalars['numeric']>;
  _neq?: InputMaybe<Scalars['numeric']>;
  _nin?: InputMaybe<Array<Scalars['numeric']>>;
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
  Run?: Maybe<Runs>;
  run_id?: Maybe<Scalars['uuid']>;
};

/** columns and relationships of "simpipe.cpu" */
export type SimpipeCpu = {
  __typename?: 'SimpipeCpu';
  seriesId?: Maybe<Scalars['bigint']>;
  time?: Maybe<Scalars['timestamptz']>;
  userid?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregated selection of "simpipe.cpu" */
export type SimpipeCpuAggregate = {
  __typename?: 'SimpipeCpuAggregate';
  aggregate?: Maybe<SimpipeCpuAggregateFields>;
  nodes: Array<SimpipeCpu>;
};

/** aggregate fields of "simpipe.cpu" */
export type SimpipeCpuAggregateFields = {
  __typename?: 'SimpipeCpuAggregateFields';
  avg?: Maybe<SimpipeCpuAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<SimpipeCpuMaxFields>;
  min?: Maybe<SimpipeCpuMinFields>;
  stddev?: Maybe<SimpipeCpuStddevFields>;
  stddevPop?: Maybe<SimpipeCpuStddev_PopFields>;
  stddevSamp?: Maybe<SimpipeCpuStddev_SampFields>;
  sum?: Maybe<SimpipeCpuSumFields>;
  varPop?: Maybe<SimpipeCpuVar_PopFields>;
  varSamp?: Maybe<SimpipeCpuVar_SampFields>;
  variance?: Maybe<SimpipeCpuVarianceFields>;
};


/** aggregate fields of "simpipe.cpu" */
export type SimpipeCpuAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeCpuSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type SimpipeCpuAvgFields = {
  __typename?: 'SimpipeCpuAvgFields';
  seriesId?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.cpu". All fields are combined with a logical 'AND'. */
export type SimpipeCpuBoolExp = {
  _and?: InputMaybe<Array<SimpipeCpuBoolExp>>;
  _not?: InputMaybe<SimpipeCpuBoolExp>;
  _or?: InputMaybe<Array<SimpipeCpuBoolExp>>;
  seriesId?: InputMaybe<BigintComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  userid?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<Float8ComparisonExp>;
};

/** aggregate max on columns */
export type SimpipeCpuMaxFields = {
  __typename?: 'SimpipeCpuMaxFields';
  seriesId?: Maybe<Scalars['bigint']>;
  time?: Maybe<Scalars['timestamptz']>;
  userid?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type SimpipeCpuMinFields = {
  __typename?: 'SimpipeCpuMinFields';
  seriesId?: Maybe<Scalars['bigint']>;
  time?: Maybe<Scalars['timestamptz']>;
  userid?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['float8']>;
};

/** Ordering options when selecting data from "simpipe.cpu". */
export type SimpipeCpuOrderBy = {
  seriesId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  userid?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "simpipe.cpu" */
export enum SimpipeCpuSelectColumn {
  /** column name */
  SeriesId = 'seriesId',
  /** column name */
  Time = 'time',
  /** column name */
  Userid = 'userid',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type SimpipeCpuStddevFields = {
  __typename?: 'SimpipeCpuStddevFields';
  seriesId?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type SimpipeCpuStddev_PopFields = {
  __typename?: 'SimpipeCpuStddev_popFields';
  seriesId?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type SimpipeCpuStddev_SampFields = {
  __typename?: 'SimpipeCpuStddev_sampFields';
  seriesId?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "simpipe_cpu" */
export type SimpipeCpuStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SimpipeCpuStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SimpipeCpuStreamCursorValueInput = {
  seriesId?: InputMaybe<Scalars['bigint']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  userid?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['float8']>;
};

/** aggregate sum on columns */
export type SimpipeCpuSumFields = {
  __typename?: 'SimpipeCpuSumFields';
  seriesId?: Maybe<Scalars['bigint']>;
  value?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type SimpipeCpuVar_PopFields = {
  __typename?: 'SimpipeCpuVar_popFields';
  seriesId?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type SimpipeCpuVar_SampFields = {
  __typename?: 'SimpipeCpuVar_sampFields';
  seriesId?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type SimpipeCpuVarianceFields = {
  __typename?: 'SimpipeCpuVarianceFields';
  seriesId?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** Environment variables in runs */
export type SimpipeEnvs = {
  __typename?: 'SimpipeEnvs';
  envId: Scalars['Int'];
  name: Scalars['String'];
  /** An object relationship */
  step: Steps;
  stepId: Scalars['String'];
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
  avg?: Maybe<SimpipeEnvsAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<SimpipeEnvsMaxFields>;
  min?: Maybe<SimpipeEnvsMinFields>;
  stddev?: Maybe<SimpipeEnvsStddevFields>;
  stddevPop?: Maybe<SimpipeEnvsStddev_PopFields>;
  stddevSamp?: Maybe<SimpipeEnvsStddev_SampFields>;
  sum?: Maybe<SimpipeEnvsSumFields>;
  varPop?: Maybe<SimpipeEnvsVar_PopFields>;
  varSamp?: Maybe<SimpipeEnvsVar_SampFields>;
  variance?: Maybe<SimpipeEnvsVarianceFields>;
};


/** aggregate fields of "simpipe.envs" */
export type SimpipeEnvsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.envs" */
export type SimpipeEnvsAggregateOrderBy = {
  avg?: InputMaybe<Simpipe_Envs_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<Simpipe_Envs_Max_Order_By>;
  min?: InputMaybe<Simpipe_Envs_Min_Order_By>;
  stddev?: InputMaybe<Simpipe_Envs_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Simpipe_Envs_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Simpipe_Envs_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Simpipe_Envs_Sum_Order_By>;
  var_pop?: InputMaybe<Simpipe_Envs_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Simpipe_Envs_Var_Samp_Order_By>;
  variance?: InputMaybe<Simpipe_Envs_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.envs" */
export type SimpipeEnvsArrRelInsertInput = {
  data: Array<SimpipeEnvsInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<SimpipeEnvsOnConflict>;
};

/** aggregate avg on columns */
export type SimpipeEnvsAvgFields = {
  __typename?: 'SimpipeEnvsAvgFields';
  envId?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.envs". All fields are combined with a logical 'AND'. */
export type SimpipeEnvsBoolExp = {
  _and?: InputMaybe<Array<SimpipeEnvsBoolExp>>;
  _not?: InputMaybe<SimpipeEnvsBoolExp>;
  _or?: InputMaybe<Array<SimpipeEnvsBoolExp>>;
  envId?: InputMaybe<IntComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.envs" */
export enum SimpipeEnvsConstraint {
  /** unique or primary key constraint on columns "env_id" */
  EnvsPkey = 'envs_pkey',
  /** unique or primary key constraint on columns "name", "step_id" */
  EnvsStepIdNameKey = 'envs_step_id_name_key'
}

/** input type for incrementing numeric columns in table "simpipe.envs" */
export type SimpipeEnvsIncInput = {
  envId?: InputMaybe<Scalars['Int']>;
  stepId?: InputMaybe<Scalars['uuid']>;
};

/** input type for inserting data into table "simpipe.envs" */
export type SimpipeEnvsInsertInput = {
  envId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['uuid']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimpipeEnvsMaxFields = {
  __typename?: 'SimpipeEnvsMaxFields';
  envId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['uuid']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimpipeEnvsMinFields = {
  __typename?: 'SimpipeEnvsMinFields';
  envId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  stepId?: Maybe<Scalars['uuid']>;
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
  envId: Scalars['Int'];
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
  envId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['uuid']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type SimpipeEnvsStddevFields = {
  __typename?: 'SimpipeEnvsStddevFields';
  envId?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type SimpipeEnvsStddev_PopFields = {
  __typename?: 'SimpipeEnvsStddev_popFields';
  envId?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type SimpipeEnvsStddev_SampFields = {
  __typename?: 'SimpipeEnvsStddev_sampFields';
  envId?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
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
  envId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  stepId?: InputMaybe<Scalars['uuid']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate sum on columns */
export type SimpipeEnvsSumFields = {
  __typename?: 'SimpipeEnvsSumFields';
  envId?: Maybe<Scalars['Int']>;
  stepId?: Maybe<Scalars['uuid']>;
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
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<SimpipeEnvsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimpipeEnvsSetInput>;
  /** filter the rows which have to be updated */
  where: SimpipeEnvsBoolExp;
};

/** aggregate var_pop on columns */
export type SimpipeEnvsVar_PopFields = {
  __typename?: 'SimpipeEnvsVar_popFields';
  envId?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type SimpipeEnvsVar_SampFields = {
  __typename?: 'SimpipeEnvsVar_sampFields';
  envId?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type SimpipeEnvsVarianceFields = {
  __typename?: 'SimpipeEnvsVarianceFields';
  envId?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "simpipe.logs" */
export type SimpipeLogs = {
  __typename?: 'SimpipeLogs';
  /** An object relationship */
  step: Steps;
  stepId: Scalars['uuid'];
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
  avg?: Maybe<SimpipeLogsAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<SimpipeLogsMaxFields>;
  min?: Maybe<SimpipeLogsMinFields>;
  stddev?: Maybe<SimpipeLogsStddevFields>;
  stddevPop?: Maybe<SimpipeLogsStddev_PopFields>;
  stddevSamp?: Maybe<SimpipeLogsStddev_SampFields>;
  sum?: Maybe<SimpipeLogsSumFields>;
  varPop?: Maybe<SimpipeLogsVar_PopFields>;
  varSamp?: Maybe<SimpipeLogsVar_SampFields>;
  variance?: Maybe<SimpipeLogsVarianceFields>;
};


/** aggregate fields of "simpipe.logs" */
export type SimpipeLogsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeLogsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type SimpipeLogsAvgFields = {
  __typename?: 'SimpipeLogsAvgFields';
  stepId?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.logs". All fields are combined with a logical 'AND'. */
export type SimpipeLogsBoolExp = {
  _and?: InputMaybe<Array<SimpipeLogsBoolExp>>;
  _not?: InputMaybe<SimpipeLogsBoolExp>;
  _or?: InputMaybe<Array<SimpipeLogsBoolExp>>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  text?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.logs" */
export enum SimpipeLogsConstraint {
  /** unique or primary key constraint on columns "step_id" */
  LogsPkey = 'logs_pkey'
}

/** input type for incrementing numeric columns in table "simpipe.logs" */
export type SimpipeLogsIncInput = {
  stepId?: InputMaybe<Scalars['uuid']>;
};

/** input type for inserting data into table "simpipe.logs" */
export type SimpipeLogsInsertInput = {
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['uuid']>;
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimpipeLogsMaxFields = {
  __typename?: 'SimpipeLogsMaxFields';
  stepId?: Maybe<Scalars['uuid']>;
  text?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimpipeLogsMinFields = {
  __typename?: 'SimpipeLogsMinFields';
  stepId?: Maybe<Scalars['uuid']>;
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
  stepId?: InputMaybe<Scalars['uuid']>;
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type SimpipeLogsStddevFields = {
  __typename?: 'SimpipeLogsStddevFields';
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type SimpipeLogsStddev_PopFields = {
  __typename?: 'SimpipeLogsStddev_popFields';
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type SimpipeLogsStddev_SampFields = {
  __typename?: 'SimpipeLogsStddev_sampFields';
  stepId?: Maybe<Scalars['Float']>;
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
  stepId?: InputMaybe<Scalars['uuid']>;
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate sum on columns */
export type SimpipeLogsSumFields = {
  __typename?: 'SimpipeLogsSumFields';
  stepId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "simpipe.logs" */
export enum SimpipeLogsUpdateColumn {
  /** column name */
  StepId = 'stepId',
  /** column name */
  Text = 'text'
}

export type SimpipeLogsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<SimpipeLogsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimpipeLogsSetInput>;
  /** filter the rows which have to be updated */
  where: SimpipeLogsBoolExp;
};

/** aggregate var_pop on columns */
export type SimpipeLogsVar_PopFields = {
  __typename?: 'SimpipeLogsVar_popFields';
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type SimpipeLogsVar_SampFields = {
  __typename?: 'SimpipeLogsVar_sampFields';
  stepId?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type SimpipeLogsVarianceFields = {
  __typename?: 'SimpipeLogsVarianceFields';
  stepId?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "simpipe.resource_usage" */
export type SimpipeResourceUsage = {
  __typename?: 'SimpipeResourceUsage';
  cpu: Scalars['numeric'];
  id: Scalars['bigint'];
  memory: Scalars['numeric'];
  memoryMax: Scalars['numeric'];
  rxValue: Scalars['numeric'];
  /** An object relationship */
  step: Steps;
  stepId: Scalars['uuid'];
  time: Scalars['timestamptz'];
  txValue: Scalars['numeric'];
};

/** aggregated selection of "simpipe.resource_usage" */
export type SimpipeResourceUsageAggregate = {
  __typename?: 'SimpipeResourceUsageAggregate';
  aggregate?: Maybe<SimpipeResourceUsageAggregateFields>;
  nodes: Array<SimpipeResourceUsage>;
};

/** aggregate fields of "simpipe.resource_usage" */
export type SimpipeResourceUsageAggregateFields = {
  __typename?: 'SimpipeResourceUsageAggregateFields';
  avg?: Maybe<SimpipeResourceUsageAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<SimpipeResourceUsageMaxFields>;
  min?: Maybe<SimpipeResourceUsageMinFields>;
  stddev?: Maybe<SimpipeResourceUsageStddevFields>;
  stddevPop?: Maybe<SimpipeResourceUsageStddev_PopFields>;
  stddevSamp?: Maybe<SimpipeResourceUsageStddev_SampFields>;
  sum?: Maybe<SimpipeResourceUsageSumFields>;
  varPop?: Maybe<SimpipeResourceUsageVar_PopFields>;
  varSamp?: Maybe<SimpipeResourceUsageVar_SampFields>;
  variance?: Maybe<SimpipeResourceUsageVarianceFields>;
};


/** aggregate fields of "simpipe.resource_usage" */
export type SimpipeResourceUsageAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.resource_usage" */
export type SimpipeResourceUsageAggregateOrderBy = {
  avg?: InputMaybe<Simpipe_Resource_Usage_Avg_Order_By>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<Simpipe_Resource_Usage_Max_Order_By>;
  min?: InputMaybe<Simpipe_Resource_Usage_Min_Order_By>;
  stddev?: InputMaybe<Simpipe_Resource_Usage_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Simpipe_Resource_Usage_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Simpipe_Resource_Usage_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Simpipe_Resource_Usage_Sum_Order_By>;
  var_pop?: InputMaybe<Simpipe_Resource_Usage_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Simpipe_Resource_Usage_Var_Samp_Order_By>;
  variance?: InputMaybe<Simpipe_Resource_Usage_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.resource_usage" */
export type SimpipeResourceUsageArrRelInsertInput = {
  data: Array<SimpipeResourceUsageInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<SimpipeResourceUsageOnConflict>;
};

/** aggregate avg on columns */
export type SimpipeResourceUsageAvgFields = {
  __typename?: 'SimpipeResourceUsageAvgFields';
  cpu?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Float']>;
  memoryMax?: Maybe<Scalars['Float']>;
  rxValue?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  txValue?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.resource_usage". All fields are combined with a logical 'AND'. */
export type SimpipeResourceUsageBoolExp = {
  _and?: InputMaybe<Array<SimpipeResourceUsageBoolExp>>;
  _not?: InputMaybe<SimpipeResourceUsageBoolExp>;
  _or?: InputMaybe<Array<SimpipeResourceUsageBoolExp>>;
  cpu?: InputMaybe<NumericComparisonExp>;
  id?: InputMaybe<BigintComparisonExp>;
  memory?: InputMaybe<NumericComparisonExp>;
  memoryMax?: InputMaybe<NumericComparisonExp>;
  rxValue?: InputMaybe<NumericComparisonExp>;
  step?: InputMaybe<StepsBoolExp>;
  stepId?: InputMaybe<StringComparisonExp>;
  time?: InputMaybe<TimestamptzComparisonExp>;
  txValue?: InputMaybe<NumericComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.resource_usage" */
export enum SimpipeResourceUsageConstraint {
  /** unique or primary key constraint on columns "id" */
  ResourceUsagePkey = 'resource_usage_pkey'
}

/** input type for incrementing numeric columns in table "simpipe.resource_usage" */
export type SimpipeResourceUsageIncInput = {
  cpu?: InputMaybe<Scalars['numeric']>;
  id?: InputMaybe<Scalars['bigint']>;
  memory?: InputMaybe<Scalars['numeric']>;
  memoryMax?: InputMaybe<Scalars['numeric']>;
  rxValue?: InputMaybe<Scalars['numeric']>;
  stepId?: InputMaybe<Scalars['uuid']>;
  txValue?: InputMaybe<Scalars['numeric']>;
};

/** input type for inserting data into table "simpipe.resource_usage" */
export type SimpipeResourceUsageInsertInput = {
  cpu?: InputMaybe<Scalars['numeric']>;
  id?: InputMaybe<Scalars['bigint']>;
  memory?: InputMaybe<Scalars['numeric']>;
  memoryMax?: InputMaybe<Scalars['numeric']>;
  rxValue?: InputMaybe<Scalars['numeric']>;
  step?: InputMaybe<StepsObjRelInsertInput>;
  stepId?: InputMaybe<Scalars['uuid']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  txValue?: InputMaybe<Scalars['numeric']>;
};

/** aggregate max on columns */
export type SimpipeResourceUsageMaxFields = {
  __typename?: 'SimpipeResourceUsageMaxFields';
  cpu?: Maybe<Scalars['numeric']>;
  id?: Maybe<Scalars['bigint']>;
  memory?: Maybe<Scalars['numeric']>;
  memoryMax?: Maybe<Scalars['numeric']>;
  rxValue?: Maybe<Scalars['numeric']>;
  stepId?: Maybe<Scalars['uuid']>;
  time?: Maybe<Scalars['timestamptz']>;
  txValue?: Maybe<Scalars['numeric']>;
};

/** aggregate min on columns */
export type SimpipeResourceUsageMinFields = {
  __typename?: 'SimpipeResourceUsageMinFields';
  cpu?: Maybe<Scalars['numeric']>;
  id?: Maybe<Scalars['bigint']>;
  memory?: Maybe<Scalars['numeric']>;
  memoryMax?: Maybe<Scalars['numeric']>;
  rxValue?: Maybe<Scalars['numeric']>;
  stepId?: Maybe<Scalars['uuid']>;
  time?: Maybe<Scalars['timestamptz']>;
  txValue?: Maybe<Scalars['numeric']>;
};

/** response of any mutation on the table "simpipe.resource_usage" */
export type SimpipeResourceUsageMutationResponse = {
  __typename?: 'SimpipeResourceUsageMutationResponse';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<SimpipeResourceUsage>;
};

/** on_conflict condition type for table "simpipe.resource_usage" */
export type SimpipeResourceUsageOnConflict = {
  constraint: SimpipeResourceUsageConstraint;
  update_columns?: Array<SimpipeResourceUsageUpdateColumn>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
};

/** Ordering options when selecting data from "simpipe.resource_usage". */
export type SimpipeResourceUsageOrderBy = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  step?: InputMaybe<StepsOrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.resource_usage */
export type SimpipeResourceUsagePkColumnsInput = {
  id: Scalars['bigint'];
};

/** select columns of table "simpipe.resource_usage" */
export enum SimpipeResourceUsageSelectColumn {
  /** column name */
  Cpu = 'cpu',
  /** column name */
  Id = 'id',
  /** column name */
  Memory = 'memory',
  /** column name */
  MemoryMax = 'memoryMax',
  /** column name */
  RxValue = 'rxValue',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  TxValue = 'txValue'
}

/** input type for updating data in table "simpipe.resource_usage" */
export type SimpipeResourceUsageSetInput = {
  cpu?: InputMaybe<Scalars['numeric']>;
  id?: InputMaybe<Scalars['bigint']>;
  memory?: InputMaybe<Scalars['numeric']>;
  memoryMax?: InputMaybe<Scalars['numeric']>;
  rxValue?: InputMaybe<Scalars['numeric']>;
  stepId?: InputMaybe<Scalars['uuid']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  txValue?: InputMaybe<Scalars['numeric']>;
};

/** aggregate stddev on columns */
export type SimpipeResourceUsageStddevFields = {
  __typename?: 'SimpipeResourceUsageStddevFields';
  cpu?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Float']>;
  memoryMax?: Maybe<Scalars['Float']>;
  rxValue?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  txValue?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type SimpipeResourceUsageStddev_PopFields = {
  __typename?: 'SimpipeResourceUsageStddev_popFields';
  cpu?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Float']>;
  memoryMax?: Maybe<Scalars['Float']>;
  rxValue?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  txValue?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type SimpipeResourceUsageStddev_SampFields = {
  __typename?: 'SimpipeResourceUsageStddev_sampFields';
  cpu?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Float']>;
  memoryMax?: Maybe<Scalars['Float']>;
  rxValue?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  txValue?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "simpipe_resource_usage" */
export type SimpipeResourceUsageStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: SimpipeResourceUsageStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SimpipeResourceUsageStreamCursorValueInput = {
  cpu?: InputMaybe<Scalars['numeric']>;
  id?: InputMaybe<Scalars['bigint']>;
  memory?: InputMaybe<Scalars['numeric']>;
  memoryMax?: InputMaybe<Scalars['numeric']>;
  rxValue?: InputMaybe<Scalars['numeric']>;
  stepId?: InputMaybe<Scalars['uuid']>;
  time?: InputMaybe<Scalars['timestamptz']>;
  txValue?: InputMaybe<Scalars['numeric']>;
};

/** aggregate sum on columns */
export type SimpipeResourceUsageSumFields = {
  __typename?: 'SimpipeResourceUsageSumFields';
  cpu?: Maybe<Scalars['numeric']>;
  id?: Maybe<Scalars['bigint']>;
  memory?: Maybe<Scalars['numeric']>;
  memoryMax?: Maybe<Scalars['numeric']>;
  rxValue?: Maybe<Scalars['numeric']>;
  stepId?: Maybe<Scalars['uuid']>;
  txValue?: Maybe<Scalars['numeric']>;
};

/** update columns of table "simpipe.resource_usage" */
export enum SimpipeResourceUsageUpdateColumn {
  /** column name */
  Cpu = 'cpu',
  /** column name */
  Id = 'id',
  /** column name */
  Memory = 'memory',
  /** column name */
  MemoryMax = 'memoryMax',
  /** column name */
  RxValue = 'rxValue',
  /** column name */
  StepId = 'stepId',
  /** column name */
  Time = 'time',
  /** column name */
  TxValue = 'txValue'
}

export type SimpipeResourceUsageUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<SimpipeResourceUsageIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<SimpipeResourceUsageSetInput>;
  /** filter the rows which have to be updated */
  where: SimpipeResourceUsageBoolExp;
};

/** aggregate var_pop on columns */
export type SimpipeResourceUsageVar_PopFields = {
  __typename?: 'SimpipeResourceUsageVar_popFields';
  cpu?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Float']>;
  memoryMax?: Maybe<Scalars['Float']>;
  rxValue?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  txValue?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type SimpipeResourceUsageVar_SampFields = {
  __typename?: 'SimpipeResourceUsageVar_sampFields';
  cpu?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Float']>;
  memoryMax?: Maybe<Scalars['Float']>;
  rxValue?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  txValue?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type SimpipeResourceUsageVarianceFields = {
  __typename?: 'SimpipeResourceUsageVarianceFields';
  cpu?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Float']>;
  memoryMax?: Maybe<Scalars['Float']>;
  rxValue?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  txValue?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "simpipe.run_status" */
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

/** columns and relationships of "simpipe.step_status" */
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

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  Create_Run_WithInput?: Maybe<Run>;
  Start_Run?: Maybe<Run>;
  Stop_Run?: Maybe<Run>;
  /** insert a single row into the table: "simpipe.simulations" */
  createSimulation?: Maybe<Simulations>;
  /** insert data into the table: "simpipe.simulations" */
  createSimulations?: Maybe<SimulationsMutationResponse>;
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
  /** delete data from the table: "simpipe.resource_usage" */
  deleteSimpipeResourceUsage?: Maybe<SimpipeResourceUsageMutationResponse>;
  /** delete single row from the table: "simpipe.resource_usage" */
  deleteSimpipeResourceUsageByPk?: Maybe<SimpipeResourceUsage>;
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
  /** insert data into the table: "simpipe.resource_usage" */
  insertSimpipeResourceUsage?: Maybe<SimpipeResourceUsageMutationResponse>;
  /** insert a single row into the table: "simpipe.resource_usage" */
  insertSimpipeResourceUsageOne?: Maybe<SimpipeResourceUsage>;
  /** insert data into the table: "simpipe.run_status" */
  insertSimpipeRunStatus?: Maybe<SimpipeRunStatusMutationResponse>;
  /** insert a single row into the table: "simpipe.run_status" */
  insertSimpipeRunStatusOne?: Maybe<SimpipeRunStatus>;
  /** insert data into the table: "simpipe.step_status" */
  insertSimpipeStepStatus?: Maybe<SimpipeStepStatusMutationResponse>;
  /** insert a single row into the table: "simpipe.step_status" */
  insertSimpipeStepStatusOne?: Maybe<SimpipeStepStatus>;
  /** insert data into the table: "simpipe.steps" */
  insertSteps?: Maybe<StepsMutationResponse>;
  /** insert a single row into the table: "simpipe.steps" */
  insertStepsOne?: Maybe<Steps>;
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
  /** update data of the table: "simpipe.resource_usage" */
  updateSimpipeResourceUsage?: Maybe<SimpipeResourceUsageMutationResponse>;
  /** update single row of the table: "simpipe.resource_usage" */
  updateSimpipeResourceUsageByPk?: Maybe<SimpipeResourceUsage>;
  /** update multiples rows of table: "simpipe.resource_usage" */
  updateSimpipeResourceUsageMany?: Maybe<Array<Maybe<SimpipeResourceUsageMutationResponse>>>;
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
export type Mutation_RootCreate_Run_WithInputArgs = {
  env_list?: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  name?: InputMaybe<Scalars['String']>;
  sampleInput?: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  simulation_id?: InputMaybe<Scalars['String']>;
  timeout_values?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


/** mutation root */
export type Mutation_RootStart_RunArgs = {
  run_id?: InputMaybe<Scalars['uuid']>;
};


/** mutation root */
export type Mutation_RootStop_RunArgs = {
  run_id?: InputMaybe<Scalars['uuid']>;
};


/** mutation root */
export type Mutation_RootCreateSimulationArgs = {
  object: SimulationsInsertInput;
  onConflict?: InputMaybe<SimulationsOnConflict>;
};


/** mutation root */
export type Mutation_RootCreateSimulationsArgs = {
  objects: Array<SimulationsInsertInput>;
  onConflict?: InputMaybe<SimulationsOnConflict>;
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
  envId: Scalars['Int'];
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
export type Mutation_RootDeleteSimpipeResourceUsageArgs = {
  where: SimpipeResourceUsageBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteSimpipeResourceUsageByPkArgs = {
  id: Scalars['bigint'];
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
export type Mutation_RootInsertSimpipeResourceUsageArgs = {
  objects: Array<SimpipeResourceUsageInsertInput>;
  onConflict?: InputMaybe<SimpipeResourceUsageOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertSimpipeResourceUsageOneArgs = {
  object: SimpipeResourceUsageInsertInput;
  onConflict?: InputMaybe<SimpipeResourceUsageOnConflict>;
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
  _inc?: InputMaybe<SimpipeEnvsIncInput>;
  _set?: InputMaybe<SimpipeEnvsSetInput>;
  where: SimpipeEnvsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeEnvsByPkArgs = {
  _inc?: InputMaybe<SimpipeEnvsIncInput>;
  _set?: InputMaybe<SimpipeEnvsSetInput>;
  pk_columns: SimpipeEnvsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeEnvsManyArgs = {
  updates: Array<SimpipeEnvsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeLogsArgs = {
  _inc?: InputMaybe<SimpipeLogsIncInput>;
  _set?: InputMaybe<SimpipeLogsSetInput>;
  where: SimpipeLogsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeLogsByPkArgs = {
  _inc?: InputMaybe<SimpipeLogsIncInput>;
  _set?: InputMaybe<SimpipeLogsSetInput>;
  pk_columns: SimpipeLogsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeLogsManyArgs = {
  updates: Array<SimpipeLogsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeResourceUsageArgs = {
  _inc?: InputMaybe<SimpipeResourceUsageIncInput>;
  _set?: InputMaybe<SimpipeResourceUsageSetInput>;
  where: SimpipeResourceUsageBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeResourceUsageByPkArgs = {
  _inc?: InputMaybe<SimpipeResourceUsageIncInput>;
  _set?: InputMaybe<SimpipeResourceUsageSetInput>;
  pk_columns: SimpipeResourceUsagePkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateSimpipeResourceUsageManyArgs = {
  updates: Array<SimpipeResourceUsageUpdates>;
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

export type Query_Root = {
  __typename?: 'query_root';
  ComputeUploadPresignedUrl?: Maybe<Scalars['String']>;
  Ping?: Maybe<Scalars['String']>;
  Username?: Maybe<Scalars['String']>;
  /** fetch data from the table: "simpipe.runs" using primary key columns */
  run?: Maybe<Runs>;
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runsAggregate: RunsAggregate;
  /** fetch data from the table: "simpipe.cpu" */
  simpipeCpu: Array<SimpipeCpu>;
  /** fetch aggregated fields from the table: "simpipe.cpu" */
  simpipeCpuAggregate: SimpipeCpuAggregate;
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
  /** fetch data from the table: "simpipe.resource_usage" */
  simpipeResourceUsage: Array<SimpipeResourceUsage>;
  /** fetch aggregated fields from the table: "simpipe.resource_usage" */
  simpipeResourceUsageAggregate: SimpipeResourceUsageAggregate;
  /** fetch data from the table: "simpipe.resource_usage" using primary key columns */
  simpipeResourceUsageByPk?: Maybe<SimpipeResourceUsage>;
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


export type Query_RootSimpipeCpuArgs = {
  distinctOn?: InputMaybe<Array<SimpipeCpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeCpuOrderBy>>;
  where?: InputMaybe<SimpipeCpuBoolExp>;
};


export type Query_RootSimpipeCpuAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeCpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeCpuOrderBy>>;
  where?: InputMaybe<SimpipeCpuBoolExp>;
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
  envId: Scalars['Int'];
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


export type Query_RootSimpipeResourceUsageArgs = {
  distinctOn?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeResourceUsageOrderBy>>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
};


export type Query_RootSimpipeResourceUsageAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeResourceUsageOrderBy>>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
};


export type Query_RootSimpipeResourceUsageByPkArgs = {
  id: Scalars['bigint'];
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
  created: Scalars['timestamptz'];
  ended?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  runId: Scalars['uuid'];
  /** An object relationship */
  simulation: Simulations;
  simulationId: Scalars['uuid'];
  started?: Maybe<Scalars['timestamptz']>;
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
  created?: InputMaybe<TimestamptzComparisonExp>;
  ended?: InputMaybe<TimestamptzComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  runId?: InputMaybe<UuidComparisonExp>;
  simulation?: InputMaybe<SimulationsBoolExp>;
  simulationId?: InputMaybe<UuidComparisonExp>;
  started?: InputMaybe<TimestamptzComparisonExp>;
  status?: InputMaybe<SimpipeRunStatusEnumComparisonExp>;
  steps?: InputMaybe<StepsBoolExp>;
  steps_aggregate?: InputMaybe<Steps_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "simpipe.runs" */
export enum RunsConstraint {
  /** unique or primary key constraint on columns "run_id" */
  RunsPkey = 'runs_pkey'
}

/** input type for inserting data into table "simpipe.runs" */
export type RunsInsertInput = {
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  runId?: InputMaybe<Scalars['uuid']>;
  simulation?: InputMaybe<SimulationsObjRelInsertInput>;
  simulationId?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<SimpipeRunStatusEnum>;
  steps?: InputMaybe<StepsArrRelInsertInput>;
};

/** aggregate max on columns */
export type RunsMaxFields = {
  __typename?: 'runsMaxFields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  runId?: Maybe<Scalars['uuid']>;
  simulationId?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type RunsMinFields = {
  __typename?: 'runsMinFields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  runId?: Maybe<Scalars['uuid']>;
  simulationId?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
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
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  runId?: InputMaybe<Scalars['uuid']>;
  simulationId?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
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
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  runId?: InputMaybe<Scalars['uuid']>;
  simulationId?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
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
  created?: InputMaybe<OrderBy>;
  ended?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
  started?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.runs" */
export type Runs_Min_Order_By = {
  created?: InputMaybe<OrderBy>;
  ended?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  runId?: InputMaybe<OrderBy>;
  simulationId?: InputMaybe<OrderBy>;
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

/** order by avg() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Avg_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Max_Order_By = {
  envId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Min_Order_By = {
  envId?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** order by stddev() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Stddev_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Stddev_Pop_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Stddev_Samp_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Sum_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Var_Pop_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Var_Samp_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.envs" */
export type Simpipe_Envs_Variance_Order_By = {
  envId?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
};

export type Simpipe_Resource_Usage_Aggregate_Bool_Exp = {
  count?: InputMaybe<Simpipe_Resource_Usage_Aggregate_Bool_Exp_Count>;
};

export type Simpipe_Resource_Usage_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<SimpipeResourceUsageBoolExp>;
  predicate: IntComparisonExp;
};

/** order by avg() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Avg_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Max_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Min_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  time?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by stddev() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Stddev_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Stddev_Pop_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Stddev_Samp_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Sum_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Var_Pop_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Var_Samp_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.resource_usage" */
export type Simpipe_Resource_Usage_Variance_Order_By = {
  cpu?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  memory?: InputMaybe<OrderBy>;
  memoryMax?: InputMaybe<OrderBy>;
  rxValue?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  txValue?: InputMaybe<OrderBy>;
};

/** Simulations */
export type Simulations = {
  __typename?: 'simulations';
  /** DateTime of when the simulation was created */
  created: Scalars['timestamptz'];
  name?: Maybe<Scalars['String']>;
  pipelineDescription?: Maybe<Scalars['jsonb']>;
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runsAggregate: RunsAggregate;
  /** uuid of the simulation */
  simulationId: Scalars['uuid'];
  userId?: Maybe<Scalars['String']>;
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
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "simpipe.simulations". All fields are combined with a logical 'AND'. */
export type SimulationsBoolExp = {
  _and?: InputMaybe<Array<SimulationsBoolExp>>;
  _not?: InputMaybe<SimulationsBoolExp>;
  _or?: InputMaybe<Array<SimulationsBoolExp>>;
  created?: InputMaybe<TimestamptzComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  pipelineDescription?: InputMaybe<JsonbComparisonExp>;
  runs?: InputMaybe<RunsBoolExp>;
  runs_aggregate?: InputMaybe<Runs_Aggregate_Bool_Exp>;
  simulationId?: InputMaybe<UuidComparisonExp>;
  userId?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "simpipe.simulations" */
export enum SimulationsConstraint {
  /** unique or primary key constraint on columns "simulation_id" */
  SimulationsPkey = 'simulations_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type SimulationsDeleteAtPathInput = {
  pipelineDescription?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type SimulationsDeleteElemInput = {
  pipelineDescription?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type SimulationsDeleteKeyInput = {
  pipelineDescription?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "simpipe.simulations" */
export type SimulationsInsertInput = {
  /** DateTime of when the simulation was created */
  created?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
  runs?: InputMaybe<RunsArrRelInsertInput>;
  /** uuid of the simulation */
  simulationId?: InputMaybe<Scalars['uuid']>;
  userId?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type SimulationsMaxFields = {
  __typename?: 'simulationsMaxFields';
  /** DateTime of when the simulation was created */
  created?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  /** uuid of the simulation */
  simulationId?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type SimulationsMinFields = {
  __typename?: 'simulationsMinFields';
  /** DateTime of when the simulation was created */
  created?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  /** uuid of the simulation */
  simulationId?: Maybe<Scalars['uuid']>;
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
  /** uuid of the simulation */
  simulationId: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type SimulationsPrependInput = {
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
  created?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
  /** uuid of the simulation */
  simulationId?: InputMaybe<Scalars['uuid']>;
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
  created?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  pipelineDescription?: InputMaybe<Scalars['jsonb']>;
  /** uuid of the simulation */
  simulationId?: InputMaybe<Scalars['uuid']>;
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

/** columns and relationships of "simpipe.steps" */
export type Steps = {
  __typename?: 'steps';
  created: Scalars['timestamptz'];
  ended?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  envs: Array<SimpipeEnvs>;
  /** An aggregate relationship */
  envsAggregate: SimpipeEnvsAggregate;
  image: Scalars['String'];
  /** An object relationship */
  log?: Maybe<SimpipeLogs>;
  name: Scalars['String'];
  pipelineStepNumber: Scalars['Int'];
  /** An aggregate relationship */
  resourceUsagesAggregate: SimpipeResourceUsageAggregate;
  /** An array relationship */
  resource_usages: Array<SimpipeResourceUsage>;
  /** An object relationship */
  run: Runs;
  runId: Scalars['uuid'];
  started?: Maybe<Scalars['timestamptz']>;
  status: SimpipeStepStatusEnum;
  stepId: Scalars['uuid'];
  timeout: Scalars['Int'];
};


/** columns and relationships of "simpipe.steps" */
export type StepsEnvsArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


/** columns and relationships of "simpipe.steps" */
export type StepsEnvsAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeEnvsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeEnvsOrderBy>>;
  where?: InputMaybe<SimpipeEnvsBoolExp>;
};


/** columns and relationships of "simpipe.steps" */
export type StepsResourceUsagesAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeResourceUsageOrderBy>>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
};


/** columns and relationships of "simpipe.steps" */
export type StepsResource_UsagesArgs = {
  distinctOn?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeResourceUsageOrderBy>>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
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
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  timeout?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.steps". All fields are combined with a logical 'AND'. */
export type StepsBoolExp = {
  _and?: InputMaybe<Array<StepsBoolExp>>;
  _not?: InputMaybe<StepsBoolExp>;
  _or?: InputMaybe<Array<StepsBoolExp>>;
  created?: InputMaybe<TimestamptzComparisonExp>;
  ended?: InputMaybe<TimestamptzComparisonExp>;
  envs?: InputMaybe<SimpipeEnvsBoolExp>;
  envs_aggregate?: InputMaybe<Simpipe_Envs_Aggregate_Bool_Exp>;
  image?: InputMaybe<StringComparisonExp>;
  log?: InputMaybe<SimpipeLogsBoolExp>;
  name?: InputMaybe<StringComparisonExp>;
  pipelineStepNumber?: InputMaybe<IntComparisonExp>;
  resource_usages?: InputMaybe<SimpipeResourceUsageBoolExp>;
  resource_usages_aggregate?: InputMaybe<Simpipe_Resource_Usage_Aggregate_Bool_Exp>;
  run?: InputMaybe<RunsBoolExp>;
  runId?: InputMaybe<UuidComparisonExp>;
  started?: InputMaybe<TimestamptzComparisonExp>;
  status?: InputMaybe<SimpipeStepStatusEnumComparisonExp>;
  stepId?: InputMaybe<StringComparisonExp>;
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
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  stepId?: InputMaybe<Scalars['uuid']>;
  timeout?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "simpipe.steps" */
export type StepsInsertInput = {
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  envs?: InputMaybe<SimpipeEnvsArrRelInsertInput>;
  image?: InputMaybe<Scalars['String']>;
  log?: InputMaybe<SimpipeLogsObjRelInsertInput>;
  name?: InputMaybe<Scalars['String']>;
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  resource_usages?: InputMaybe<SimpipeResourceUsageArrRelInsertInput>;
  run?: InputMaybe<RunsObjRelInsertInput>;
  runId?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<SimpipeStepStatusEnum>;
  stepId?: InputMaybe<Scalars['uuid']>;
  timeout?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type StepsMaxFields = {
  __typename?: 'stepsMaxFields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pipelineStepNumber?: Maybe<Scalars['Int']>;
  runId?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
  stepId?: Maybe<Scalars['uuid']>;
  timeout?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type StepsMinFields = {
  __typename?: 'stepsMinFields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pipelineStepNumber?: Maybe<Scalars['Int']>;
  runId?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
  stepId?: Maybe<Scalars['uuid']>;
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
  created?: InputMaybe<OrderBy>;
  ended?: InputMaybe<OrderBy>;
  envsAggregate?: InputMaybe<SimpipeEnvsAggregateOrderBy>;
  image?: InputMaybe<OrderBy>;
  log?: InputMaybe<SimpipeLogsOrderBy>;
  name?: InputMaybe<OrderBy>;
  pipelineStepNumber?: InputMaybe<OrderBy>;
  resource_usagesAggregate?: InputMaybe<SimpipeResourceUsageAggregateOrderBy>;
  run?: InputMaybe<RunsOrderBy>;
  runId?: InputMaybe<OrderBy>;
  started?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: simpipe.steps */
export type StepsPkColumnsInput = {
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
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  runId?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<SimpipeStepStatusEnum>;
  stepId?: InputMaybe<Scalars['uuid']>;
  timeout?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type StepsStddevFields = {
  __typename?: 'stepsStddevFields';
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type StepsStddev_PopFields = {
  __typename?: 'stepsStddev_popFields';
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type StepsStddev_SampFields = {
  __typename?: 'stepsStddev_sampFields';
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
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
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  pipelineStepNumber?: InputMaybe<Scalars['Int']>;
  runId?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<SimpipeStepStatusEnum>;
  stepId?: InputMaybe<Scalars['uuid']>;
  timeout?: InputMaybe<Scalars['Int']>;
};

/** aggregate sum on columns */
export type StepsSumFields = {
  __typename?: 'stepsSumFields';
  pipelineStepNumber?: Maybe<Scalars['Int']>;
  stepId?: Maybe<Scalars['uuid']>;
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
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type StepsVar_SampFields = {
  __typename?: 'stepsVar_sampFields';
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
  timeout?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type StepsVarianceFields = {
  __typename?: 'stepsVarianceFields';
  pipelineStepNumber?: Maybe<Scalars['Float']>;
  stepId?: Maybe<Scalars['Float']>;
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
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by max() on columns of table "simpipe.steps" */
export type Steps_Max_Order_By = {
  created?: InputMaybe<OrderBy>;
  ended?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  pipelineStepNumber?: InputMaybe<OrderBy>;
  runId?: InputMaybe<OrderBy>;
  started?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "simpipe.steps" */
export type Steps_Min_Order_By = {
  created?: InputMaybe<OrderBy>;
  ended?: InputMaybe<OrderBy>;
  image?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  pipelineStepNumber?: InputMaybe<OrderBy>;
  runId?: InputMaybe<OrderBy>;
  started?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by stddev() on columns of table "simpipe.steps" */
export type Steps_Stddev_Order_By = {
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "simpipe.steps" */
export type Steps_Stddev_Pop_Order_By = {
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "simpipe.steps" */
export type Steps_Stddev_Samp_Order_By = {
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by sum() on columns of table "simpipe.steps" */
export type Steps_Sum_Order_By = {
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "simpipe.steps" */
export type Steps_Var_Pop_Order_By = {
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "simpipe.steps" */
export type Steps_Var_Samp_Order_By = {
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "simpipe.steps" */
export type Steps_Variance_Order_By = {
  pipelineStepNumber?: InputMaybe<OrderBy>;
  stepId?: InputMaybe<OrderBy>;
  timeout?: InputMaybe<OrderBy>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "simpipe.runs" using primary key columns */
  run?: Maybe<Runs>;
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runsAggregate: RunsAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.runs" */
  runsStream: Array<Runs>;
  /** fetch data from the table: "simpipe.cpu" */
  simpipeCpu: Array<SimpipeCpu>;
  /** fetch aggregated fields from the table: "simpipe.cpu" */
  simpipeCpuAggregate: SimpipeCpuAggregate;
  /** fetch data from the table in a streaming manner: "simpipe.cpu" */
  simpipeCpuStream: Array<SimpipeCpu>;
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
  /** fetch data from the table: "simpipe.resource_usage" */
  simpipeResourceUsage: Array<SimpipeResourceUsage>;
  /** fetch aggregated fields from the table: "simpipe.resource_usage" */
  simpipeResourceUsageAggregate: SimpipeResourceUsageAggregate;
  /** fetch data from the table: "simpipe.resource_usage" using primary key columns */
  simpipeResourceUsageByPk?: Maybe<SimpipeResourceUsage>;
  /** fetch data from the table in a streaming manner: "simpipe.resource_usage" */
  simpipeResourceUsageStream: Array<SimpipeResourceUsage>;
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


export type Subscription_RootSimpipeCpuArgs = {
  distinctOn?: InputMaybe<Array<SimpipeCpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeCpuOrderBy>>;
  where?: InputMaybe<SimpipeCpuBoolExp>;
};


export type Subscription_RootSimpipeCpuAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeCpuSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeCpuOrderBy>>;
  where?: InputMaybe<SimpipeCpuBoolExp>;
};


export type Subscription_RootSimpipeCpuStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<SimpipeCpuStreamCursorInput>>;
  where?: InputMaybe<SimpipeCpuBoolExp>;
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
  envId: Scalars['Int'];
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


export type Subscription_RootSimpipeResourceUsageArgs = {
  distinctOn?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeResourceUsageOrderBy>>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
};


export type Subscription_RootSimpipeResourceUsageAggregateArgs = {
  distinctOn?: InputMaybe<Array<SimpipeResourceUsageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SimpipeResourceUsageOrderBy>>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
};


export type Subscription_RootSimpipeResourceUsageByPkArgs = {
  id: Scalars['bigint'];
};


export type Subscription_RootSimpipeResourceUsageStreamArgs = {
  batchSize: Scalars['Int'];
  cursor: Array<InputMaybe<SimpipeResourceUsageStreamCursorInput>>;
  where?: InputMaybe<SimpipeResourceUsageBoolExp>;
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

export type GetUserIdFromRunQueryVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type GetUserIdFromRunQuery = { __typename?: 'query_root', run?: { __typename?: 'runs', simulation: { __typename?: 'simulations', userId?: string | null } } | null };

export type GetUserIdFromSimulationQueryVariables = Exact<{
  simulationId: Scalars['uuid'];
}>;


export type GetUserIdFromSimulationQuery = { __typename?: 'query_root', simulation?: { __typename?: 'simulations', userId?: string | null } | null };

export type GetSimulationDslQueryVariables = Exact<{
  simulationId: Scalars['uuid'];
}>;


export type GetSimulationDslQuery = { __typename?: 'query_root', simulation?: { __typename?: 'simulations', pipelineDescription?: unknown | null } | null };

export type CreateRunMutationVariables = Exact<{
  simulationId: Scalars['uuid'];
  name?: InputMaybe<Scalars['String']>;
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
  started: Scalars['timestamptz'];
  ended: Scalars['timestamptz'];
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


export type SetRunAsStartedMutation = { __typename?: 'mutation_root', updateRunsByPk?: { __typename?: 'runs', runId: string } | null };

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


export type CreateSimulationMutation = { __typename?: 'mutation_root', createSimulation?: { __typename?: 'simulations', simulationId: string } | null };

export type GetSimulationIdandStepsQueryVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type GetSimulationIdandStepsQuery = { __typename?: 'query_root', run?: { __typename?: 'runs', simulationId: string, name?: string | null, steps: Array<{ __typename?: 'steps', stepId: string, pipelineStepNumber: number, image: string, name: string }> } | null };

export type GetRunDetailsQueryVariables = Exact<{
  runId: Scalars['uuid'];
}>;


export type GetRunDetailsQuery = { __typename?: 'query_root', run?: { __typename?: 'runs', simulationId: string, name?: string | null, steps: Array<{ __typename?: 'steps', stepId: string, pipelineStepNumber: number, image: string, name: string }> } | null };

export type InsertLogMutationVariables = Exact<{
  stepId: Scalars['uuid'];
  text: Scalars['String'];
}>;


export type InsertLogMutation = { __typename?: 'mutation_root', insertSimpipeLogsOne?: { __typename?: 'SimpipeLogs', stepId: string } | null };


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
  simulation(simulationId: {_eq: $simulationId}) {
    userId
  }
}
    `;
export const GetSimulationDslDocument = gql`
    query getSimulationDSL($simulationId: uuid!) {
  simulation(simulationId: {_eq: $simulationId}) {
    pipelineDescription
  }
}
    `;
export const CreateRunDocument = gql`
    mutation createRun($simulationId: uuid!, $name: String) {
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
    mutation setStepAsEndedSuccess($stepId: uuid!, $started: timestamptz!, $ended: timestamptz!) {
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
  createSimulation(
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