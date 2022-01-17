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
  jsonb: unknown;
  numeric: number;
  run_status: 'waiting'|'active'|'completed'|'failed'|'cancelled';
  step_status: 'waiting'|'active'|'completed'|'failed'|'cancelled';
  timestamp: string;
  timestamptz: string;
  uuid: string;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
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

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** insert a single row into the table: "simpipe.simulations" */
  create_simulation?: Maybe<Simulations>;
  /** insert data into the table: "simpipe.simulations" */
  create_simulations?: Maybe<Simulations_Mutation_Response>;
  /** delete data from the table: "simpipe.runs" */
  delete_previous_run?: Maybe<Runs_Mutation_Response>;
  /** delete single row from the table: "simpipe.runs" */
  delete_runs_by_pk?: Maybe<Runs>;
  /** delete data from the table: "simpipe.cpu" */
  delete_simpipe_cpu?: Maybe<Simpipe_Cpu_Mutation_Response>;
  /** delete single row from the table: "simpipe.cpu" */
  delete_simpipe_cpu_by_pk?: Maybe<Simpipe_Cpu>;
  /** delete data from the table: "simpipe.logs" */
  delete_simpipe_logs?: Maybe<Simpipe_Logs_Mutation_Response>;
  /** delete single row from the table: "simpipe.logs" */
  delete_simpipe_logs_by_pk?: Maybe<Simpipe_Logs>;
  /** delete data from the table: "simpipe.memory" */
  delete_simpipe_memory?: Maybe<Simpipe_Memory_Mutation_Response>;
  /** delete single row from the table: "simpipe.memory" */
  delete_simpipe_memory_by_pk?: Maybe<Simpipe_Memory>;
  /** delete single row from the table: "simpipe.simulations" */
  delete_simulation?: Maybe<Simulations>;
  /** delete data from the table: "simpipe.simulations" */
  delete_simulations?: Maybe<Simulations_Mutation_Response>;
  /** delete data from the table: "simpipe.steps" */
  delete_steps?: Maybe<Steps_Mutation_Response>;
  /** delete single row from the table: "simpipe.steps" */
  delete_steps_by_pk?: Maybe<Steps>;
  /** insert data into the table: "simpipe.cpu" */
  insert_simpipe_cpu?: Maybe<Simpipe_Cpu_Mutation_Response>;
  /** insert a single row into the table: "simpipe.cpu" */
  insert_simpipe_cpu_one?: Maybe<Simpipe_Cpu>;
  /** insert data into the table: "simpipe.logs" */
  insert_simpipe_logs?: Maybe<Simpipe_Logs_Mutation_Response>;
  /** insert a single row into the table: "simpipe.logs" */
  insert_simpipe_logs_one?: Maybe<Simpipe_Logs>;
  /** insert data into the table: "simpipe.memory" */
  insert_simpipe_memory?: Maybe<Simpipe_Memory_Mutation_Response>;
  /** insert a single row into the table: "simpipe.memory" */
  insert_simpipe_memory_one?: Maybe<Simpipe_Memory>;
  /** insert data into the table: "simpipe.steps" */
  insert_steps?: Maybe<Steps_Mutation_Response>;
  /** insert a single row into the table: "simpipe.steps" */
  insert_steps_one?: Maybe<Steps>;
  /** insert a single row into the table: "simpipe.runs" */
  start_run?: Maybe<Runs>;
  /** insert data into the table: "simpipe.runs" */
  start_runs?: Maybe<Runs_Mutation_Response>;
  /** update data of the table: "simpipe.runs" */
  update_runs?: Maybe<Runs_Mutation_Response>;
  /** update single row of the table: "simpipe.runs" */
  update_runs_by_pk?: Maybe<Runs>;
  /** update data of the table: "simpipe.cpu" */
  update_simpipe_cpu?: Maybe<Simpipe_Cpu_Mutation_Response>;
  /** update single row of the table: "simpipe.cpu" */
  update_simpipe_cpu_by_pk?: Maybe<Simpipe_Cpu>;
  /** update data of the table: "simpipe.logs" */
  update_simpipe_logs?: Maybe<Simpipe_Logs_Mutation_Response>;
  /** update single row of the table: "simpipe.logs" */
  update_simpipe_logs_by_pk?: Maybe<Simpipe_Logs>;
  /** update data of the table: "simpipe.memory" */
  update_simpipe_memory?: Maybe<Simpipe_Memory_Mutation_Response>;
  /** update single row of the table: "simpipe.memory" */
  update_simpipe_memory_by_pk?: Maybe<Simpipe_Memory>;
  /** update data of the table: "simpipe.simulations" */
  update_simulations?: Maybe<Simulations_Mutation_Response>;
  /** update single row of the table: "simpipe.simulations" */
  update_simulations_by_pk?: Maybe<Simulations>;
  /** update data of the table: "simpipe.steps" */
  update_steps?: Maybe<Steps_Mutation_Response>;
  /** update single row of the table: "simpipe.steps" */
  update_steps_by_pk?: Maybe<Steps>;
};


/** mutation root */
export type Mutation_RootCreate_SimulationArgs = {
  object: Simulations_Insert_Input;
  on_conflict?: InputMaybe<Simulations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootCreate_SimulationsArgs = {
  objects: Array<Simulations_Insert_Input>;
  on_conflict?: InputMaybe<Simulations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootDelete_Previous_RunArgs = {
  where: Runs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Runs_By_PkArgs = {
  run_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Simpipe_CpuArgs = {
  where: Simpipe_Cpu_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Simpipe_Cpu_By_PkArgs = {
  id: Scalars['bigint'];
};


/** mutation root */
export type Mutation_RootDelete_Simpipe_LogsArgs = {
  where: Simpipe_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Simpipe_Logs_By_PkArgs = {
  step_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Simpipe_MemoryArgs = {
  where: Simpipe_Memory_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Simpipe_Memory_By_PkArgs = {
  id: Scalars['bigint'];
};


/** mutation root */
export type Mutation_RootDelete_SimulationArgs = {
  simulation_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_SimulationsArgs = {
  where: Simulations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_StepsArgs = {
  where: Steps_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Steps_By_PkArgs = {
  step_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootInsert_Simpipe_CpuArgs = {
  objects: Array<Simpipe_Cpu_Insert_Input>;
  on_conflict?: InputMaybe<Simpipe_Cpu_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Simpipe_Cpu_OneArgs = {
  object: Simpipe_Cpu_Insert_Input;
  on_conflict?: InputMaybe<Simpipe_Cpu_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Simpipe_LogsArgs = {
  objects: Array<Simpipe_Logs_Insert_Input>;
  on_conflict?: InputMaybe<Simpipe_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Simpipe_Logs_OneArgs = {
  object: Simpipe_Logs_Insert_Input;
  on_conflict?: InputMaybe<Simpipe_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Simpipe_MemoryArgs = {
  objects: Array<Simpipe_Memory_Insert_Input>;
  on_conflict?: InputMaybe<Simpipe_Memory_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Simpipe_Memory_OneArgs = {
  object: Simpipe_Memory_Insert_Input;
  on_conflict?: InputMaybe<Simpipe_Memory_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_StepsArgs = {
  objects: Array<Steps_Insert_Input>;
  on_conflict?: InputMaybe<Steps_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Steps_OneArgs = {
  object: Steps_Insert_Input;
  on_conflict?: InputMaybe<Steps_On_Conflict>;
};


/** mutation root */
export type Mutation_RootStart_RunArgs = {
  object: Runs_Insert_Input;
  on_conflict?: InputMaybe<Runs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootStart_RunsArgs = {
  objects: Array<Runs_Insert_Input>;
  on_conflict?: InputMaybe<Runs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_RunsArgs = {
  _append?: InputMaybe<Runs_Append_Input>;
  _delete_at_path?: InputMaybe<Runs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Runs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Runs_Delete_Key_Input>;
  _prepend?: InputMaybe<Runs_Prepend_Input>;
  _set?: InputMaybe<Runs_Set_Input>;
  where: Runs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Runs_By_PkArgs = {
  _append?: InputMaybe<Runs_Append_Input>;
  _delete_at_path?: InputMaybe<Runs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Runs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Runs_Delete_Key_Input>;
  _prepend?: InputMaybe<Runs_Prepend_Input>;
  _set?: InputMaybe<Runs_Set_Input>;
  pk_columns: Runs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Simpipe_CpuArgs = {
  _inc?: InputMaybe<Simpipe_Cpu_Inc_Input>;
  _set?: InputMaybe<Simpipe_Cpu_Set_Input>;
  where: Simpipe_Cpu_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Simpipe_Cpu_By_PkArgs = {
  _inc?: InputMaybe<Simpipe_Cpu_Inc_Input>;
  _set?: InputMaybe<Simpipe_Cpu_Set_Input>;
  pk_columns: Simpipe_Cpu_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Simpipe_LogsArgs = {
  _inc?: InputMaybe<Simpipe_Logs_Inc_Input>;
  _set?: InputMaybe<Simpipe_Logs_Set_Input>;
  where: Simpipe_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Simpipe_Logs_By_PkArgs = {
  _inc?: InputMaybe<Simpipe_Logs_Inc_Input>;
  _set?: InputMaybe<Simpipe_Logs_Set_Input>;
  pk_columns: Simpipe_Logs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Simpipe_MemoryArgs = {
  _inc?: InputMaybe<Simpipe_Memory_Inc_Input>;
  _set?: InputMaybe<Simpipe_Memory_Set_Input>;
  where: Simpipe_Memory_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Simpipe_Memory_By_PkArgs = {
  _inc?: InputMaybe<Simpipe_Memory_Inc_Input>;
  _set?: InputMaybe<Simpipe_Memory_Set_Input>;
  pk_columns: Simpipe_Memory_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_SimulationsArgs = {
  _set?: InputMaybe<Simulations_Set_Input>;
  where: Simulations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Simulations_By_PkArgs = {
  _set?: InputMaybe<Simulations_Set_Input>;
  pk_columns: Simulations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_StepsArgs = {
  _inc?: InputMaybe<Steps_Inc_Input>;
  _set?: InputMaybe<Steps_Set_Input>;
  where: Steps_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Steps_By_PkArgs = {
  _inc?: InputMaybe<Steps_Inc_Input>;
  _set?: InputMaybe<Steps_Set_Input>;
  pk_columns: Steps_Pk_Columns_Input;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']>;
  _gt?: InputMaybe<Scalars['numeric']>;
  _gte?: InputMaybe<Scalars['numeric']>;
  _in?: InputMaybe<Array<Scalars['numeric']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['numeric']>;
  _lte?: InputMaybe<Scalars['numeric']>;
  _neq?: InputMaybe<Scalars['numeric']>;
  _nin?: InputMaybe<Array<Scalars['numeric']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "simpipe.runs" using primary key columns */
  get_run?: Maybe<Runs>;
  /** fetch data from the table: "simpipe.simulations" using primary key columns */
  get_simulation?: Maybe<Simulations>;
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runs_aggregate: Runs_Aggregate;
  /** fetch data from the table: "simpipe.cpu" */
  simpipe_cpu: Array<Simpipe_Cpu>;
  /** fetch aggregated fields from the table: "simpipe.cpu" */
  simpipe_cpu_aggregate: Simpipe_Cpu_Aggregate;
  /** fetch data from the table: "simpipe.cpu" using primary key columns */
  simpipe_cpu_by_pk?: Maybe<Simpipe_Cpu>;
  /** fetch data from the table: "simpipe.logs" */
  simpipe_logs: Array<Simpipe_Logs>;
  /** fetch aggregated fields from the table: "simpipe.logs" */
  simpipe_logs_aggregate: Simpipe_Logs_Aggregate;
  /** fetch data from the table: "simpipe.logs" using primary key columns */
  simpipe_logs_by_pk?: Maybe<Simpipe_Logs>;
  /** fetch data from the table: "simpipe.memory" */
  simpipe_memory: Array<Simpipe_Memory>;
  /** fetch aggregated fields from the table: "simpipe.memory" */
  simpipe_memory_aggregate: Simpipe_Memory_Aggregate;
  /** fetch data from the table: "simpipe.memory" using primary key columns */
  simpipe_memory_by_pk?: Maybe<Simpipe_Memory>;
  /** fetch data from the table: "simpipe.simulations" */
  simulations: Array<Simulations>;
  /** fetch aggregated fields from the table: "simpipe.simulations" */
  simulations_aggregate: Simulations_Aggregate;
  /** fetch data from the table: "simpipe.steps" */
  steps: Array<Steps>;
  /** fetch aggregated fields from the table: "simpipe.steps" */
  steps_aggregate: Steps_Aggregate;
  /** fetch data from the table: "simpipe.steps" using primary key columns */
  steps_by_pk?: Maybe<Steps>;
};


export type Query_RootGet_RunArgs = {
  run_id: Scalars['uuid'];
};


export type Query_RootGet_SimulationArgs = {
  simulation_id: Scalars['uuid'];
};


export type Query_RootRunsArgs = {
  distinct_on?: InputMaybe<Array<Runs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Runs_Order_By>>;
  where?: InputMaybe<Runs_Bool_Exp>;
};


export type Query_RootRuns_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Runs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Runs_Order_By>>;
  where?: InputMaybe<Runs_Bool_Exp>;
};


export type Query_RootSimpipe_CpuArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Cpu_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Cpu_Order_By>>;
  where?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
};


export type Query_RootSimpipe_Cpu_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Cpu_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Cpu_Order_By>>;
  where?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
};


export type Query_RootSimpipe_Cpu_By_PkArgs = {
  id: Scalars['bigint'];
};


export type Query_RootSimpipe_LogsArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Logs_Order_By>>;
  where?: InputMaybe<Simpipe_Logs_Bool_Exp>;
};


export type Query_RootSimpipe_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Logs_Order_By>>;
  where?: InputMaybe<Simpipe_Logs_Bool_Exp>;
};


export type Query_RootSimpipe_Logs_By_PkArgs = {
  step_id: Scalars['Int'];
};


export type Query_RootSimpipe_MemoryArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Memory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Memory_Order_By>>;
  where?: InputMaybe<Simpipe_Memory_Bool_Exp>;
};


export type Query_RootSimpipe_Memory_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Memory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Memory_Order_By>>;
  where?: InputMaybe<Simpipe_Memory_Bool_Exp>;
};


export type Query_RootSimpipe_Memory_By_PkArgs = {
  id: Scalars['bigint'];
};


export type Query_RootSimulationsArgs = {
  distinct_on?: InputMaybe<Array<Simulations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simulations_Order_By>>;
  where?: InputMaybe<Simulations_Bool_Exp>;
};


export type Query_RootSimulations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simulations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simulations_Order_By>>;
  where?: InputMaybe<Simulations_Bool_Exp>;
};


export type Query_RootStepsArgs = {
  distinct_on?: InputMaybe<Array<Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Steps_Order_By>>;
  where?: InputMaybe<Steps_Bool_Exp>;
};


export type Query_RootSteps_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Steps_Order_By>>;
  where?: InputMaybe<Steps_Bool_Exp>;
};


export type Query_RootSteps_By_PkArgs = {
  step_id: Scalars['Int'];
};

/** Boolean expression to compare columns of type "run_status". All fields are combined with logical 'AND'. */
export type Run_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['run_status']>;
  _gt?: InputMaybe<Scalars['run_status']>;
  _gte?: InputMaybe<Scalars['run_status']>;
  _in?: InputMaybe<Array<Scalars['run_status']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['run_status']>;
  _lte?: InputMaybe<Scalars['run_status']>;
  _neq?: InputMaybe<Scalars['run_status']>;
  _nin?: InputMaybe<Array<Scalars['run_status']>>;
};

/**
 * Simulation run
 *
 *
 * columns and relationships of "simpipe.runs"
 */
export type Runs = {
  __typename?: 'runs';
  created: Scalars['timestamptz'];
  dsl: Scalars['jsonb'];
  ended?: Maybe<Scalars['timestamptz']>;
  run_id: Scalars['uuid'];
  /** An object relationship */
  simulation: Simulations;
  simulation_id: Scalars['uuid'];
  started?: Maybe<Scalars['timestamptz']>;
  status: Scalars['run_status'];
  /** fetch data from the table: "simpipe.steps" */
  steps: Array<Steps>;
  /** fetch aggregated fields from the table: "simpipe.steps" */
  steps_aggregate: Steps_Aggregate;
};


/**
 * Simulation run
 *
 *
 * columns and relationships of "simpipe.runs"
 */
export type RunsDslArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/**
 * Simulation run
 *
 *
 * columns and relationships of "simpipe.runs"
 */
export type RunsStepsArgs = {
  distinct_on?: InputMaybe<Array<Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Steps_Order_By>>;
  where?: InputMaybe<Steps_Bool_Exp>;
};


/**
 * Simulation run
 *
 *
 * columns and relationships of "simpipe.runs"
 */
export type RunsSteps_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Steps_Order_By>>;
  where?: InputMaybe<Steps_Bool_Exp>;
};

/** aggregated selection of "simpipe.runs" */
export type Runs_Aggregate = {
  __typename?: 'runs_aggregate';
  aggregate?: Maybe<Runs_Aggregate_Fields>;
  nodes: Array<Runs>;
};

/** aggregate fields of "simpipe.runs" */
export type Runs_Aggregate_Fields = {
  __typename?: 'runs_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Runs_Max_Fields>;
  min?: Maybe<Runs_Min_Fields>;
};


/** aggregate fields of "simpipe.runs" */
export type Runs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Runs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.runs" */
export type Runs_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Runs_Max_Order_By>;
  min?: InputMaybe<Runs_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Runs_Append_Input = {
  dsl?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "simpipe.runs" */
export type Runs_Arr_Rel_Insert_Input = {
  data: Array<Runs_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Runs_On_Conflict>;
};

/** Boolean expression to filter rows from the table "simpipe.runs". All fields are combined with a logical 'AND'. */
export type Runs_Bool_Exp = {
  _and?: InputMaybe<Array<Runs_Bool_Exp>>;
  _not?: InputMaybe<Runs_Bool_Exp>;
  _or?: InputMaybe<Array<Runs_Bool_Exp>>;
  created?: InputMaybe<Timestamptz_Comparison_Exp>;
  dsl?: InputMaybe<Jsonb_Comparison_Exp>;
  ended?: InputMaybe<Timestamptz_Comparison_Exp>;
  run_id?: InputMaybe<Uuid_Comparison_Exp>;
  simulation?: InputMaybe<Simulations_Bool_Exp>;
  simulation_id?: InputMaybe<Uuid_Comparison_Exp>;
  started?: InputMaybe<Timestamptz_Comparison_Exp>;
  status?: InputMaybe<Run_Status_Comparison_Exp>;
  steps?: InputMaybe<Steps_Bool_Exp>;
};

/** unique or primary key constraints on table "simpipe.runs" */
export enum Runs_Constraint {
  /** unique or primary key constraint */
  RunsPkey = 'runs_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Runs_Delete_At_Path_Input = {
  dsl?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Runs_Delete_Elem_Input = {
  dsl?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Runs_Delete_Key_Input = {
  dsl?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "simpipe.runs" */
export type Runs_Insert_Input = {
  created?: InputMaybe<Scalars['timestamptz']>;
  dsl?: InputMaybe<Scalars['jsonb']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  run_id?: InputMaybe<Scalars['uuid']>;
  simulation?: InputMaybe<Simulations_Obj_Rel_Insert_Input>;
  simulation_id?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['run_status']>;
  steps?: InputMaybe<Steps_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Runs_Max_Fields = {
  __typename?: 'runs_max_fields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  run_id?: Maybe<Scalars['uuid']>;
  simulation_id?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "simpipe.runs" */
export type Runs_Max_Order_By = {
  created?: InputMaybe<Order_By>;
  ended?: InputMaybe<Order_By>;
  run_id?: InputMaybe<Order_By>;
  simulation_id?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Runs_Min_Fields = {
  __typename?: 'runs_min_fields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  run_id?: Maybe<Scalars['uuid']>;
  simulation_id?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "simpipe.runs" */
export type Runs_Min_Order_By = {
  created?: InputMaybe<Order_By>;
  ended?: InputMaybe<Order_By>;
  run_id?: InputMaybe<Order_By>;
  simulation_id?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "simpipe.runs" */
export type Runs_Mutation_Response = {
  __typename?: 'runs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Runs>;
};

/** on conflict condition type for table "simpipe.runs" */
export type Runs_On_Conflict = {
  constraint: Runs_Constraint;
  update_columns?: Array<Runs_Update_Column>;
  where?: InputMaybe<Runs_Bool_Exp>;
};

/** Ordering options when selecting data from "simpipe.runs". */
export type Runs_Order_By = {
  created?: InputMaybe<Order_By>;
  dsl?: InputMaybe<Order_By>;
  ended?: InputMaybe<Order_By>;
  run_id?: InputMaybe<Order_By>;
  simulation?: InputMaybe<Simulations_Order_By>;
  simulation_id?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  steps_aggregate?: InputMaybe<Steps_Aggregate_Order_By>;
};

/** primary key columns input for table: runs */
export type Runs_Pk_Columns_Input = {
  run_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Runs_Prepend_Input = {
  dsl?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "simpipe.runs" */
export enum Runs_Select_Column {
  /** column name */
  Created = 'created',
  /** column name */
  Dsl = 'dsl',
  /** column name */
  Ended = 'ended',
  /** column name */
  RunId = 'run_id',
  /** column name */
  SimulationId = 'simulation_id',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "simpipe.runs" */
export type Runs_Set_Input = {
  created?: InputMaybe<Scalars['timestamptz']>;
  dsl?: InputMaybe<Scalars['jsonb']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  run_id?: InputMaybe<Scalars['uuid']>;
  simulation_id?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['run_status']>;
};

/** update columns of table "simpipe.runs" */
export enum Runs_Update_Column {
  /** column name */
  Created = 'created',
  /** column name */
  Dsl = 'dsl',
  /** column name */
  Ended = 'ended',
  /** column name */
  RunId = 'run_id',
  /** column name */
  SimulationId = 'simulation_id',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status'
}

/** columns and relationships of "simpipe.cpu" */
export type Simpipe_Cpu = {
  __typename?: 'simpipe_cpu';
  id: Scalars['bigint'];
  step_id: Scalars['Int'];
  time: Scalars['timestamp'];
  value: Scalars['numeric'];
};

/** aggregated selection of "simpipe.cpu" */
export type Simpipe_Cpu_Aggregate = {
  __typename?: 'simpipe_cpu_aggregate';
  aggregate?: Maybe<Simpipe_Cpu_Aggregate_Fields>;
  nodes: Array<Simpipe_Cpu>;
};

/** aggregate fields of "simpipe.cpu" */
export type Simpipe_Cpu_Aggregate_Fields = {
  __typename?: 'simpipe_cpu_aggregate_fields';
  avg?: Maybe<Simpipe_Cpu_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Simpipe_Cpu_Max_Fields>;
  min?: Maybe<Simpipe_Cpu_Min_Fields>;
  stddev?: Maybe<Simpipe_Cpu_Stddev_Fields>;
  stddev_pop?: Maybe<Simpipe_Cpu_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Simpipe_Cpu_Stddev_Samp_Fields>;
  sum?: Maybe<Simpipe_Cpu_Sum_Fields>;
  var_pop?: Maybe<Simpipe_Cpu_Var_Pop_Fields>;
  var_samp?: Maybe<Simpipe_Cpu_Var_Samp_Fields>;
  variance?: Maybe<Simpipe_Cpu_Variance_Fields>;
};


/** aggregate fields of "simpipe.cpu" */
export type Simpipe_Cpu_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Simpipe_Cpu_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.cpu" */
export type Simpipe_Cpu_Aggregate_Order_By = {
  avg?: InputMaybe<Simpipe_Cpu_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Simpipe_Cpu_Max_Order_By>;
  min?: InputMaybe<Simpipe_Cpu_Min_Order_By>;
  stddev?: InputMaybe<Simpipe_Cpu_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Simpipe_Cpu_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Simpipe_Cpu_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Simpipe_Cpu_Sum_Order_By>;
  var_pop?: InputMaybe<Simpipe_Cpu_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Simpipe_Cpu_Var_Samp_Order_By>;
  variance?: InputMaybe<Simpipe_Cpu_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.cpu" */
export type Simpipe_Cpu_Arr_Rel_Insert_Input = {
  data: Array<Simpipe_Cpu_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Simpipe_Cpu_On_Conflict>;
};

/** aggregate avg on columns */
export type Simpipe_Cpu_Avg_Fields = {
  __typename?: 'simpipe_cpu_avg_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "simpipe.cpu". All fields are combined with a logical 'AND'. */
export type Simpipe_Cpu_Bool_Exp = {
  _and?: InputMaybe<Array<Simpipe_Cpu_Bool_Exp>>;
  _not?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
  _or?: InputMaybe<Array<Simpipe_Cpu_Bool_Exp>>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  step_id?: InputMaybe<Int_Comparison_Exp>;
  time?: InputMaybe<Timestamp_Comparison_Exp>;
  value?: InputMaybe<Numeric_Comparison_Exp>;
};

/** unique or primary key constraints on table "simpipe.cpu" */
export enum Simpipe_Cpu_Constraint {
  /** unique or primary key constraint */
  CpuPkey = 'cpu_pkey'
}

/** input type for incrementing numeric columns in table "simpipe.cpu" */
export type Simpipe_Cpu_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']>;
  step_id?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['numeric']>;
};

/** input type for inserting data into table "simpipe.cpu" */
export type Simpipe_Cpu_Insert_Input = {
  id?: InputMaybe<Scalars['bigint']>;
  step_id?: InputMaybe<Scalars['Int']>;
  time?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['numeric']>;
};

/** aggregate max on columns */
export type Simpipe_Cpu_Max_Fields = {
  __typename?: 'simpipe_cpu_max_fields';
  id?: Maybe<Scalars['bigint']>;
  step_id?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['timestamp']>;
  value?: Maybe<Scalars['numeric']>;
};

/** order by max() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  time?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Simpipe_Cpu_Min_Fields = {
  __typename?: 'simpipe_cpu_min_fields';
  id?: Maybe<Scalars['bigint']>;
  step_id?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['timestamp']>;
  value?: Maybe<Scalars['numeric']>;
};

/** order by min() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  time?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "simpipe.cpu" */
export type Simpipe_Cpu_Mutation_Response = {
  __typename?: 'simpipe_cpu_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Simpipe_Cpu>;
};

/** on conflict condition type for table "simpipe.cpu" */
export type Simpipe_Cpu_On_Conflict = {
  constraint: Simpipe_Cpu_Constraint;
  update_columns?: Array<Simpipe_Cpu_Update_Column>;
  where?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
};

/** Ordering options when selecting data from "simpipe.cpu". */
export type Simpipe_Cpu_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  time?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: simpipe_cpu */
export type Simpipe_Cpu_Pk_Columns_Input = {
  id: Scalars['bigint'];
};

/** select columns of table "simpipe.cpu" */
export enum Simpipe_Cpu_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  StepId = 'step_id',
  /** column name */
  Time = 'time',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "simpipe.cpu" */
export type Simpipe_Cpu_Set_Input = {
  id?: InputMaybe<Scalars['bigint']>;
  step_id?: InputMaybe<Scalars['Int']>;
  time?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['numeric']>;
};

/** aggregate stddev on columns */
export type Simpipe_Cpu_Stddev_Fields = {
  __typename?: 'simpipe_cpu_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Simpipe_Cpu_Stddev_Pop_Fields = {
  __typename?: 'simpipe_cpu_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Simpipe_Cpu_Stddev_Samp_Fields = {
  __typename?: 'simpipe_cpu_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Simpipe_Cpu_Sum_Fields = {
  __typename?: 'simpipe_cpu_sum_fields';
  id?: Maybe<Scalars['bigint']>;
  step_id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['numeric']>;
};

/** order by sum() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** update columns of table "simpipe.cpu" */
export enum Simpipe_Cpu_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  StepId = 'step_id',
  /** column name */
  Time = 'time',
  /** column name */
  Value = 'value'
}

/** aggregate var_pop on columns */
export type Simpipe_Cpu_Var_Pop_Fields = {
  __typename?: 'simpipe_cpu_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Simpipe_Cpu_Var_Samp_Fields = {
  __typename?: 'simpipe_cpu_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Simpipe_Cpu_Variance_Fields = {
  __typename?: 'simpipe_cpu_variance_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "simpipe.cpu" */
export type Simpipe_Cpu_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** columns and relationships of "simpipe.logs" */
export type Simpipe_Logs = {
  __typename?: 'simpipe_logs';
  step_id: Scalars['Int'];
  text: Scalars['String'];
};

/** aggregated selection of "simpipe.logs" */
export type Simpipe_Logs_Aggregate = {
  __typename?: 'simpipe_logs_aggregate';
  aggregate?: Maybe<Simpipe_Logs_Aggregate_Fields>;
  nodes: Array<Simpipe_Logs>;
};

/** aggregate fields of "simpipe.logs" */
export type Simpipe_Logs_Aggregate_Fields = {
  __typename?: 'simpipe_logs_aggregate_fields';
  avg?: Maybe<Simpipe_Logs_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Simpipe_Logs_Max_Fields>;
  min?: Maybe<Simpipe_Logs_Min_Fields>;
  stddev?: Maybe<Simpipe_Logs_Stddev_Fields>;
  stddev_pop?: Maybe<Simpipe_Logs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Simpipe_Logs_Stddev_Samp_Fields>;
  sum?: Maybe<Simpipe_Logs_Sum_Fields>;
  var_pop?: Maybe<Simpipe_Logs_Var_Pop_Fields>;
  var_samp?: Maybe<Simpipe_Logs_Var_Samp_Fields>;
  variance?: Maybe<Simpipe_Logs_Variance_Fields>;
};


/** aggregate fields of "simpipe.logs" */
export type Simpipe_Logs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Simpipe_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Simpipe_Logs_Avg_Fields = {
  __typename?: 'simpipe_logs_avg_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "simpipe.logs". All fields are combined with a logical 'AND'. */
export type Simpipe_Logs_Bool_Exp = {
  _and?: InputMaybe<Array<Simpipe_Logs_Bool_Exp>>;
  _not?: InputMaybe<Simpipe_Logs_Bool_Exp>;
  _or?: InputMaybe<Array<Simpipe_Logs_Bool_Exp>>;
  step_id?: InputMaybe<Int_Comparison_Exp>;
  text?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "simpipe.logs" */
export enum Simpipe_Logs_Constraint {
  /** unique or primary key constraint */
  LogsPkey = 'logs_pkey'
}

/** input type for incrementing numeric columns in table "simpipe.logs" */
export type Simpipe_Logs_Inc_Input = {
  step_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "simpipe.logs" */
export type Simpipe_Logs_Insert_Input = {
  step_id?: InputMaybe<Scalars['Int']>;
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Simpipe_Logs_Max_Fields = {
  __typename?: 'simpipe_logs_max_fields';
  step_id?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Simpipe_Logs_Min_Fields = {
  __typename?: 'simpipe_logs_min_fields';
  step_id?: Maybe<Scalars['Int']>;
  text?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "simpipe.logs" */
export type Simpipe_Logs_Mutation_Response = {
  __typename?: 'simpipe_logs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Simpipe_Logs>;
};

/** input type for inserting object relation for remote table "simpipe.logs" */
export type Simpipe_Logs_Obj_Rel_Insert_Input = {
  data: Simpipe_Logs_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Simpipe_Logs_On_Conflict>;
};

/** on conflict condition type for table "simpipe.logs" */
export type Simpipe_Logs_On_Conflict = {
  constraint: Simpipe_Logs_Constraint;
  update_columns?: Array<Simpipe_Logs_Update_Column>;
  where?: InputMaybe<Simpipe_Logs_Bool_Exp>;
};

/** Ordering options when selecting data from "simpipe.logs". */
export type Simpipe_Logs_Order_By = {
  step_id?: InputMaybe<Order_By>;
  text?: InputMaybe<Order_By>;
};

/** primary key columns input for table: simpipe_logs */
export type Simpipe_Logs_Pk_Columns_Input = {
  step_id: Scalars['Int'];
};

/** select columns of table "simpipe.logs" */
export enum Simpipe_Logs_Select_Column {
  /** column name */
  StepId = 'step_id',
  /** column name */
  Text = 'text'
}

/** input type for updating data in table "simpipe.logs" */
export type Simpipe_Logs_Set_Input = {
  step_id?: InputMaybe<Scalars['Int']>;
  text?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Simpipe_Logs_Stddev_Fields = {
  __typename?: 'simpipe_logs_stddev_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Simpipe_Logs_Stddev_Pop_Fields = {
  __typename?: 'simpipe_logs_stddev_pop_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Simpipe_Logs_Stddev_Samp_Fields = {
  __typename?: 'simpipe_logs_stddev_samp_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Simpipe_Logs_Sum_Fields = {
  __typename?: 'simpipe_logs_sum_fields';
  step_id?: Maybe<Scalars['Int']>;
};

/** update columns of table "simpipe.logs" */
export enum Simpipe_Logs_Update_Column {
  /** column name */
  StepId = 'step_id',
  /** column name */
  Text = 'text'
}

/** aggregate var_pop on columns */
export type Simpipe_Logs_Var_Pop_Fields = {
  __typename?: 'simpipe_logs_var_pop_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Simpipe_Logs_Var_Samp_Fields = {
  __typename?: 'simpipe_logs_var_samp_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Simpipe_Logs_Variance_Fields = {
  __typename?: 'simpipe_logs_variance_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "simpipe.memory" */
export type Simpipe_Memory = {
  __typename?: 'simpipe_memory';
  id: Scalars['bigint'];
  step_id: Scalars['Int'];
  time: Scalars['timestamp'];
  value: Scalars['numeric'];
};

/** aggregated selection of "simpipe.memory" */
export type Simpipe_Memory_Aggregate = {
  __typename?: 'simpipe_memory_aggregate';
  aggregate?: Maybe<Simpipe_Memory_Aggregate_Fields>;
  nodes: Array<Simpipe_Memory>;
};

/** aggregate fields of "simpipe.memory" */
export type Simpipe_Memory_Aggregate_Fields = {
  __typename?: 'simpipe_memory_aggregate_fields';
  avg?: Maybe<Simpipe_Memory_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Simpipe_Memory_Max_Fields>;
  min?: Maybe<Simpipe_Memory_Min_Fields>;
  stddev?: Maybe<Simpipe_Memory_Stddev_Fields>;
  stddev_pop?: Maybe<Simpipe_Memory_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Simpipe_Memory_Stddev_Samp_Fields>;
  sum?: Maybe<Simpipe_Memory_Sum_Fields>;
  var_pop?: Maybe<Simpipe_Memory_Var_Pop_Fields>;
  var_samp?: Maybe<Simpipe_Memory_Var_Samp_Fields>;
  variance?: Maybe<Simpipe_Memory_Variance_Fields>;
};


/** aggregate fields of "simpipe.memory" */
export type Simpipe_Memory_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Simpipe_Memory_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.memory" */
export type Simpipe_Memory_Aggregate_Order_By = {
  avg?: InputMaybe<Simpipe_Memory_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Simpipe_Memory_Max_Order_By>;
  min?: InputMaybe<Simpipe_Memory_Min_Order_By>;
  stddev?: InputMaybe<Simpipe_Memory_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Simpipe_Memory_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Simpipe_Memory_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Simpipe_Memory_Sum_Order_By>;
  var_pop?: InputMaybe<Simpipe_Memory_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Simpipe_Memory_Var_Samp_Order_By>;
  variance?: InputMaybe<Simpipe_Memory_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "simpipe.memory" */
export type Simpipe_Memory_Arr_Rel_Insert_Input = {
  data: Array<Simpipe_Memory_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Simpipe_Memory_On_Conflict>;
};

/** aggregate avg on columns */
export type Simpipe_Memory_Avg_Fields = {
  __typename?: 'simpipe_memory_avg_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "simpipe.memory". All fields are combined with a logical 'AND'. */
export type Simpipe_Memory_Bool_Exp = {
  _and?: InputMaybe<Array<Simpipe_Memory_Bool_Exp>>;
  _not?: InputMaybe<Simpipe_Memory_Bool_Exp>;
  _or?: InputMaybe<Array<Simpipe_Memory_Bool_Exp>>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  step_id?: InputMaybe<Int_Comparison_Exp>;
  time?: InputMaybe<Timestamp_Comparison_Exp>;
  value?: InputMaybe<Numeric_Comparison_Exp>;
};

/** unique or primary key constraints on table "simpipe.memory" */
export enum Simpipe_Memory_Constraint {
  /** unique or primary key constraint */
  MemoryPkey = 'memory_pkey'
}

/** input type for incrementing numeric columns in table "simpipe.memory" */
export type Simpipe_Memory_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']>;
  step_id?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['numeric']>;
};

/** input type for inserting data into table "simpipe.memory" */
export type Simpipe_Memory_Insert_Input = {
  id?: InputMaybe<Scalars['bigint']>;
  step_id?: InputMaybe<Scalars['Int']>;
  time?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['numeric']>;
};

/** aggregate max on columns */
export type Simpipe_Memory_Max_Fields = {
  __typename?: 'simpipe_memory_max_fields';
  id?: Maybe<Scalars['bigint']>;
  step_id?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['timestamp']>;
  value?: Maybe<Scalars['numeric']>;
};

/** order by max() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  time?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Simpipe_Memory_Min_Fields = {
  __typename?: 'simpipe_memory_min_fields';
  id?: Maybe<Scalars['bigint']>;
  step_id?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['timestamp']>;
  value?: Maybe<Scalars['numeric']>;
};

/** order by min() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  time?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "simpipe.memory" */
export type Simpipe_Memory_Mutation_Response = {
  __typename?: 'simpipe_memory_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Simpipe_Memory>;
};

/** on conflict condition type for table "simpipe.memory" */
export type Simpipe_Memory_On_Conflict = {
  constraint: Simpipe_Memory_Constraint;
  update_columns?: Array<Simpipe_Memory_Update_Column>;
  where?: InputMaybe<Simpipe_Memory_Bool_Exp>;
};

/** Ordering options when selecting data from "simpipe.memory". */
export type Simpipe_Memory_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  time?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: simpipe_memory */
export type Simpipe_Memory_Pk_Columns_Input = {
  id: Scalars['bigint'];
};

/** select columns of table "simpipe.memory" */
export enum Simpipe_Memory_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  StepId = 'step_id',
  /** column name */
  Time = 'time',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "simpipe.memory" */
export type Simpipe_Memory_Set_Input = {
  id?: InputMaybe<Scalars['bigint']>;
  step_id?: InputMaybe<Scalars['Int']>;
  time?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['numeric']>;
};

/** aggregate stddev on columns */
export type Simpipe_Memory_Stddev_Fields = {
  __typename?: 'simpipe_memory_stddev_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Simpipe_Memory_Stddev_Pop_Fields = {
  __typename?: 'simpipe_memory_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Simpipe_Memory_Stddev_Samp_Fields = {
  __typename?: 'simpipe_memory_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Simpipe_Memory_Sum_Fields = {
  __typename?: 'simpipe_memory_sum_fields';
  id?: Maybe<Scalars['bigint']>;
  step_id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['numeric']>;
};

/** order by sum() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** update columns of table "simpipe.memory" */
export enum Simpipe_Memory_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  StepId = 'step_id',
  /** column name */
  Time = 'time',
  /** column name */
  Value = 'value'
}

/** aggregate var_pop on columns */
export type Simpipe_Memory_Var_Pop_Fields = {
  __typename?: 'simpipe_memory_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Simpipe_Memory_Var_Samp_Fields = {
  __typename?: 'simpipe_memory_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Simpipe_Memory_Variance_Fields = {
  __typename?: 'simpipe_memory_variance_fields';
  id?: Maybe<Scalars['Float']>;
  step_id?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "simpipe.memory" */
export type Simpipe_Memory_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/**
 * Simulations
 *
 *
 * columns and relationships of "simpipe.simulations"
 */
export type Simulations = {
  __typename?: 'simulations';
  /** DateTime of when the simulation was created */
  created: Scalars['timestamptz'];
  /** UUID of the model */
  model_id: Scalars['uuid'];
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runs_aggregate: Runs_Aggregate;
  /** UUID of the simulation */
  simulation_id: Scalars['uuid'];
};


/**
 * Simulations
 *
 *
 * columns and relationships of "simpipe.simulations"
 */
export type SimulationsRunsArgs = {
  distinct_on?: InputMaybe<Array<Runs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Runs_Order_By>>;
  where?: InputMaybe<Runs_Bool_Exp>;
};


/**
 * Simulations
 *
 *
 * columns and relationships of "simpipe.simulations"
 */
export type SimulationsRuns_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Runs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Runs_Order_By>>;
  where?: InputMaybe<Runs_Bool_Exp>;
};

/** aggregated selection of "simpipe.simulations" */
export type Simulations_Aggregate = {
  __typename?: 'simulations_aggregate';
  aggregate?: Maybe<Simulations_Aggregate_Fields>;
  nodes: Array<Simulations>;
};

/** aggregate fields of "simpipe.simulations" */
export type Simulations_Aggregate_Fields = {
  __typename?: 'simulations_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Simulations_Max_Fields>;
  min?: Maybe<Simulations_Min_Fields>;
};


/** aggregate fields of "simpipe.simulations" */
export type Simulations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Simulations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "simpipe.simulations". All fields are combined with a logical 'AND'. */
export type Simulations_Bool_Exp = {
  _and?: InputMaybe<Array<Simulations_Bool_Exp>>;
  _not?: InputMaybe<Simulations_Bool_Exp>;
  _or?: InputMaybe<Array<Simulations_Bool_Exp>>;
  created?: InputMaybe<Timestamptz_Comparison_Exp>;
  model_id?: InputMaybe<Uuid_Comparison_Exp>;
  runs?: InputMaybe<Runs_Bool_Exp>;
  simulation_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "simpipe.simulations" */
export enum Simulations_Constraint {
  /** unique or primary key constraint */
  SimulationsModelIdKey = 'simulations_modelId_key',
  /** unique or primary key constraint */
  SimulationsPkey = 'simulations_pkey'
}

/** input type for inserting data into table "simpipe.simulations" */
export type Simulations_Insert_Input = {
  /** DateTime of when the simulation was created */
  created?: InputMaybe<Scalars['timestamptz']>;
  /** UUID of the model */
  model_id?: InputMaybe<Scalars['uuid']>;
  runs?: InputMaybe<Runs_Arr_Rel_Insert_Input>;
  /** UUID of the simulation */
  simulation_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Simulations_Max_Fields = {
  __typename?: 'simulations_max_fields';
  /** DateTime of when the simulation was created */
  created?: Maybe<Scalars['timestamptz']>;
  /** UUID of the model */
  model_id?: Maybe<Scalars['uuid']>;
  /** UUID of the simulation */
  simulation_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Simulations_Min_Fields = {
  __typename?: 'simulations_min_fields';
  /** DateTime of when the simulation was created */
  created?: Maybe<Scalars['timestamptz']>;
  /** UUID of the model */
  model_id?: Maybe<Scalars['uuid']>;
  /** UUID of the simulation */
  simulation_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "simpipe.simulations" */
export type Simulations_Mutation_Response = {
  __typename?: 'simulations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Simulations>;
};

/** input type for inserting object relation for remote table "simpipe.simulations" */
export type Simulations_Obj_Rel_Insert_Input = {
  data: Simulations_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<Simulations_On_Conflict>;
};

/** on conflict condition type for table "simpipe.simulations" */
export type Simulations_On_Conflict = {
  constraint: Simulations_Constraint;
  update_columns?: Array<Simulations_Update_Column>;
  where?: InputMaybe<Simulations_Bool_Exp>;
};

/** Ordering options when selecting data from "simpipe.simulations". */
export type Simulations_Order_By = {
  created?: InputMaybe<Order_By>;
  model_id?: InputMaybe<Order_By>;
  runs_aggregate?: InputMaybe<Runs_Aggregate_Order_By>;
  simulation_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: simulations */
export type Simulations_Pk_Columns_Input = {
  /** UUID of the simulation */
  simulation_id: Scalars['uuid'];
};

/** select columns of table "simpipe.simulations" */
export enum Simulations_Select_Column {
  /** column name */
  Created = 'created',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  SimulationId = 'simulation_id'
}

/** input type for updating data in table "simpipe.simulations" */
export type Simulations_Set_Input = {
  /** DateTime of when the simulation was created */
  created?: InputMaybe<Scalars['timestamptz']>;
  /** UUID of the model */
  model_id?: InputMaybe<Scalars['uuid']>;
  /** UUID of the simulation */
  simulation_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "simpipe.simulations" */
export enum Simulations_Update_Column {
  /** column name */
  Created = 'created',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  SimulationId = 'simulation_id'
}

/** Boolean expression to compare columns of type "step_status". All fields are combined with logical 'AND'. */
export type Step_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['step_status']>;
  _gt?: InputMaybe<Scalars['step_status']>;
  _gte?: InputMaybe<Scalars['step_status']>;
  _in?: InputMaybe<Array<Scalars['step_status']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['step_status']>;
  _lte?: InputMaybe<Scalars['step_status']>;
  _neq?: InputMaybe<Scalars['step_status']>;
  _nin?: InputMaybe<Array<Scalars['step_status']>>;
};

/** columns and relationships of "simpipe.steps" */
export type Steps = {
  __typename?: 'steps';
  /** An array relationship */
  cpu: Array<Simpipe_Cpu>;
  /** An aggregate relationship */
  cpu_aggregate: Simpipe_Cpu_Aggregate;
  created: Scalars['timestamptz'];
  ended?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  log?: Maybe<Simpipe_Logs>;
  /** An array relationship */
  memory: Array<Simpipe_Memory>;
  /** An aggregate relationship */
  memory_aggregate: Simpipe_Memory_Aggregate;
  name: Scalars['String'];
  run_id: Scalars['uuid'];
  started?: Maybe<Scalars['timestamptz']>;
  status: Scalars['step_status'];
  step_id: Scalars['Int'];
};


/** columns and relationships of "simpipe.steps" */
export type StepsCpuArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Cpu_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Cpu_Order_By>>;
  where?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
};


/** columns and relationships of "simpipe.steps" */
export type StepsCpu_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Cpu_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Cpu_Order_By>>;
  where?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
};


/** columns and relationships of "simpipe.steps" */
export type StepsMemoryArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Memory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Memory_Order_By>>;
  where?: InputMaybe<Simpipe_Memory_Bool_Exp>;
};


/** columns and relationships of "simpipe.steps" */
export type StepsMemory_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Memory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Memory_Order_By>>;
  where?: InputMaybe<Simpipe_Memory_Bool_Exp>;
};

/** aggregated selection of "simpipe.steps" */
export type Steps_Aggregate = {
  __typename?: 'steps_aggregate';
  aggregate?: Maybe<Steps_Aggregate_Fields>;
  nodes: Array<Steps>;
};

/** aggregate fields of "simpipe.steps" */
export type Steps_Aggregate_Fields = {
  __typename?: 'steps_aggregate_fields';
  avg?: Maybe<Steps_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Steps_Max_Fields>;
  min?: Maybe<Steps_Min_Fields>;
  stddev?: Maybe<Steps_Stddev_Fields>;
  stddev_pop?: Maybe<Steps_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Steps_Stddev_Samp_Fields>;
  sum?: Maybe<Steps_Sum_Fields>;
  var_pop?: Maybe<Steps_Var_Pop_Fields>;
  var_samp?: Maybe<Steps_Var_Samp_Fields>;
  variance?: Maybe<Steps_Variance_Fields>;
};


/** aggregate fields of "simpipe.steps" */
export type Steps_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Steps_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "simpipe.steps" */
export type Steps_Aggregate_Order_By = {
  avg?: InputMaybe<Steps_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
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
export type Steps_Arr_Rel_Insert_Input = {
  data: Array<Steps_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Steps_On_Conflict>;
};

/** aggregate avg on columns */
export type Steps_Avg_Fields = {
  __typename?: 'steps_avg_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "simpipe.steps" */
export type Steps_Avg_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "simpipe.steps". All fields are combined with a logical 'AND'. */
export type Steps_Bool_Exp = {
  _and?: InputMaybe<Array<Steps_Bool_Exp>>;
  _not?: InputMaybe<Steps_Bool_Exp>;
  _or?: InputMaybe<Array<Steps_Bool_Exp>>;
  cpu?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
  created?: InputMaybe<Timestamptz_Comparison_Exp>;
  ended?: InputMaybe<Timestamptz_Comparison_Exp>;
  log?: InputMaybe<Simpipe_Logs_Bool_Exp>;
  memory?: InputMaybe<Simpipe_Memory_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  run_id?: InputMaybe<Uuid_Comparison_Exp>;
  started?: InputMaybe<Timestamptz_Comparison_Exp>;
  status?: InputMaybe<Step_Status_Comparison_Exp>;
  step_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "simpipe.steps" */
export enum Steps_Constraint {
  /** unique or primary key constraint */
  StepsPkey = 'steps_pkey',
  /** unique or primary key constraint */
  StepsRunIdNameKey = 'steps_run_id_name_key'
}

/** input type for incrementing numeric columns in table "simpipe.steps" */
export type Steps_Inc_Input = {
  step_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "simpipe.steps" */
export type Steps_Insert_Input = {
  cpu?: InputMaybe<Simpipe_Cpu_Arr_Rel_Insert_Input>;
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  log?: InputMaybe<Simpipe_Logs_Obj_Rel_Insert_Input>;
  memory?: InputMaybe<Simpipe_Memory_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  run_id?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['step_status']>;
  step_id?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Steps_Max_Fields = {
  __typename?: 'steps_max_fields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  run_id?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
  step_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "simpipe.steps" */
export type Steps_Max_Order_By = {
  created?: InputMaybe<Order_By>;
  ended?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  run_id?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Steps_Min_Fields = {
  __typename?: 'steps_min_fields';
  created?: Maybe<Scalars['timestamptz']>;
  ended?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  run_id?: Maybe<Scalars['uuid']>;
  started?: Maybe<Scalars['timestamptz']>;
  step_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "simpipe.steps" */
export type Steps_Min_Order_By = {
  created?: InputMaybe<Order_By>;
  ended?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  run_id?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "simpipe.steps" */
export type Steps_Mutation_Response = {
  __typename?: 'steps_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Steps>;
};

/** on conflict condition type for table "simpipe.steps" */
export type Steps_On_Conflict = {
  constraint: Steps_Constraint;
  update_columns?: Array<Steps_Update_Column>;
  where?: InputMaybe<Steps_Bool_Exp>;
};

/** Ordering options when selecting data from "simpipe.steps". */
export type Steps_Order_By = {
  cpu_aggregate?: InputMaybe<Simpipe_Cpu_Aggregate_Order_By>;
  created?: InputMaybe<Order_By>;
  ended?: InputMaybe<Order_By>;
  log?: InputMaybe<Simpipe_Logs_Order_By>;
  memory_aggregate?: InputMaybe<Simpipe_Memory_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  run_id?: InputMaybe<Order_By>;
  started?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: steps */
export type Steps_Pk_Columns_Input = {
  step_id: Scalars['Int'];
};

/** select columns of table "simpipe.steps" */
export enum Steps_Select_Column {
  /** column name */
  Created = 'created',
  /** column name */
  Ended = 'ended',
  /** column name */
  Name = 'name',
  /** column name */
  RunId = 'run_id',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status',
  /** column name */
  StepId = 'step_id'
}

/** input type for updating data in table "simpipe.steps" */
export type Steps_Set_Input = {
  created?: InputMaybe<Scalars['timestamptz']>;
  ended?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  run_id?: InputMaybe<Scalars['uuid']>;
  started?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['step_status']>;
  step_id?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Steps_Stddev_Fields = {
  __typename?: 'steps_stddev_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "simpipe.steps" */
export type Steps_Stddev_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Steps_Stddev_Pop_Fields = {
  __typename?: 'steps_stddev_pop_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "simpipe.steps" */
export type Steps_Stddev_Pop_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Steps_Stddev_Samp_Fields = {
  __typename?: 'steps_stddev_samp_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "simpipe.steps" */
export type Steps_Stddev_Samp_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Steps_Sum_Fields = {
  __typename?: 'steps_sum_fields';
  step_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "simpipe.steps" */
export type Steps_Sum_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

/** update columns of table "simpipe.steps" */
export enum Steps_Update_Column {
  /** column name */
  Created = 'created',
  /** column name */
  Ended = 'ended',
  /** column name */
  Name = 'name',
  /** column name */
  RunId = 'run_id',
  /** column name */
  Started = 'started',
  /** column name */
  Status = 'status',
  /** column name */
  StepId = 'step_id'
}

/** aggregate var_pop on columns */
export type Steps_Var_Pop_Fields = {
  __typename?: 'steps_var_pop_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "simpipe.steps" */
export type Steps_Var_Pop_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Steps_Var_Samp_Fields = {
  __typename?: 'steps_var_samp_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "simpipe.steps" */
export type Steps_Var_Samp_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Steps_Variance_Fields = {
  __typename?: 'steps_variance_fields';
  step_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "simpipe.steps" */
export type Steps_Variance_Order_By = {
  step_id?: InputMaybe<Order_By>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "simpipe.runs" using primary key columns */
  get_run?: Maybe<Runs>;
  /** fetch data from the table: "simpipe.simulations" using primary key columns */
  get_simulation?: Maybe<Simulations>;
  /** An array relationship */
  runs: Array<Runs>;
  /** An aggregate relationship */
  runs_aggregate: Runs_Aggregate;
  /** fetch data from the table: "simpipe.cpu" */
  simpipe_cpu: Array<Simpipe_Cpu>;
  /** fetch aggregated fields from the table: "simpipe.cpu" */
  simpipe_cpu_aggregate: Simpipe_Cpu_Aggregate;
  /** fetch data from the table: "simpipe.cpu" using primary key columns */
  simpipe_cpu_by_pk?: Maybe<Simpipe_Cpu>;
  /** fetch data from the table: "simpipe.logs" */
  simpipe_logs: Array<Simpipe_Logs>;
  /** fetch aggregated fields from the table: "simpipe.logs" */
  simpipe_logs_aggregate: Simpipe_Logs_Aggregate;
  /** fetch data from the table: "simpipe.logs" using primary key columns */
  simpipe_logs_by_pk?: Maybe<Simpipe_Logs>;
  /** fetch data from the table: "simpipe.memory" */
  simpipe_memory: Array<Simpipe_Memory>;
  /** fetch aggregated fields from the table: "simpipe.memory" */
  simpipe_memory_aggregate: Simpipe_Memory_Aggregate;
  /** fetch data from the table: "simpipe.memory" using primary key columns */
  simpipe_memory_by_pk?: Maybe<Simpipe_Memory>;
  /** fetch data from the table: "simpipe.simulations" */
  simulations: Array<Simulations>;
  /** fetch aggregated fields from the table: "simpipe.simulations" */
  simulations_aggregate: Simulations_Aggregate;
  /** fetch data from the table: "simpipe.steps" */
  steps: Array<Steps>;
  /** fetch aggregated fields from the table: "simpipe.steps" */
  steps_aggregate: Steps_Aggregate;
  /** fetch data from the table: "simpipe.steps" using primary key columns */
  steps_by_pk?: Maybe<Steps>;
};


export type Subscription_RootGet_RunArgs = {
  run_id: Scalars['uuid'];
};


export type Subscription_RootGet_SimulationArgs = {
  simulation_id: Scalars['uuid'];
};


export type Subscription_RootRunsArgs = {
  distinct_on?: InputMaybe<Array<Runs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Runs_Order_By>>;
  where?: InputMaybe<Runs_Bool_Exp>;
};


export type Subscription_RootRuns_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Runs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Runs_Order_By>>;
  where?: InputMaybe<Runs_Bool_Exp>;
};


export type Subscription_RootSimpipe_CpuArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Cpu_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Cpu_Order_By>>;
  where?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
};


export type Subscription_RootSimpipe_Cpu_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Cpu_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Cpu_Order_By>>;
  where?: InputMaybe<Simpipe_Cpu_Bool_Exp>;
};


export type Subscription_RootSimpipe_Cpu_By_PkArgs = {
  id: Scalars['bigint'];
};


export type Subscription_RootSimpipe_LogsArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Logs_Order_By>>;
  where?: InputMaybe<Simpipe_Logs_Bool_Exp>;
};


export type Subscription_RootSimpipe_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Logs_Order_By>>;
  where?: InputMaybe<Simpipe_Logs_Bool_Exp>;
};


export type Subscription_RootSimpipe_Logs_By_PkArgs = {
  step_id: Scalars['Int'];
};


export type Subscription_RootSimpipe_MemoryArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Memory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Memory_Order_By>>;
  where?: InputMaybe<Simpipe_Memory_Bool_Exp>;
};


export type Subscription_RootSimpipe_Memory_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simpipe_Memory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simpipe_Memory_Order_By>>;
  where?: InputMaybe<Simpipe_Memory_Bool_Exp>;
};


export type Subscription_RootSimpipe_Memory_By_PkArgs = {
  id: Scalars['bigint'];
};


export type Subscription_RootSimulationsArgs = {
  distinct_on?: InputMaybe<Array<Simulations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simulations_Order_By>>;
  where?: InputMaybe<Simulations_Bool_Exp>;
};


export type Subscription_RootSimulations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Simulations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Simulations_Order_By>>;
  where?: InputMaybe<Simulations_Bool_Exp>;
};


export type Subscription_RootStepsArgs = {
  distinct_on?: InputMaybe<Array<Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Steps_Order_By>>;
  where?: InputMaybe<Steps_Bool_Exp>;
};


export type Subscription_RootSteps_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Steps_Order_By>>;
  where?: InputMaybe<Steps_Bool_Exp>;
};


export type Subscription_RootSteps_By_PkArgs = {
  step_id: Scalars['Int'];
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type AllSimulationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllSimulationsQuery = { __typename?: 'query_root', simulations: Array<{ __typename?: 'simulations', simulation_id: string, runs: Array<{ __typename?: 'runs', created: string, simulation: { __typename?: 'simulations', created: string } }> }> };

export type AllRunsAndStepsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRunsAndStepsQuery = { __typename?: 'query_root', runs: Array<{ __typename?: 'runs', created: string, started?: string | null | undefined, status: 'waiting'|'active'|'completed'|'failed'|'cancelled', steps: Array<{ __typename?: 'steps', created: string, ended?: string | null | undefined }> }> };

export type StartNewRunMutationVariables = Exact<{
  simulation_id: Scalars['uuid'];
}>;


export type StartNewRunMutation = { __typename?: 'mutation_root', start_run?: { __typename?: 'runs', run_id: string, created: string } | null | undefined };

export type TestMutationVariables = Exact<{ [key: string]: never; }>;


export type TestMutation = { __typename?: 'mutation_root', start_run?: { __typename?: 'runs', run_id: string } | null | undefined };

export type CreateStepMutationVariables = Exact<{
  run_id: Scalars['uuid'];
  name: Scalars['String'];
}>;


export type CreateStepMutation = { __typename?: 'mutation_root', insert_steps_one?: { __typename?: 'steps', created: string, run_id: string, step_id: number, status: 'waiting'|'active'|'completed'|'failed'|'cancelled', name: string } | null | undefined };


export const AllSimulationsDocument = gql`
    query AllSimulations {
  simulations {
    simulation_id
    runs {
      created
      simulation {
        created
      }
    }
  }
}
    `;
export const AllRunsAndStepsDocument = gql`
    query allRunsAndSteps {
  runs {
    created
    started
    status
    steps {
      created
      ended
    }
  }
}
    `;
export const StartNewRunDocument = gql`
    mutation startNewRun($simulation_id: uuid!) {
  start_run(object: {dsl: {test: true}, simulation_id: $simulation_id}) {
    run_id
    created
  }
}
    `;
export const TestDocument = gql`
    mutation test {
  start_run(object: {simulation_id: "1"}) {
    run_id
  }
}
    `;
export const CreateStepDocument = gql`
    mutation createStep($run_id: uuid!, $name: String!) {
  insert_steps_one(object: {run_id: $run_id, name: $name}) {
    created
    run_id
    step_id
    status
    name
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AllSimulations(variables?: AllSimulationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllSimulationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllSimulationsQuery>(AllSimulationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AllSimulations');
    },
    allRunsAndSteps(variables?: AllRunsAndStepsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllRunsAndStepsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllRunsAndStepsQuery>(AllRunsAndStepsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allRunsAndSteps');
    },
    startNewRun(variables: StartNewRunMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<StartNewRunMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<StartNewRunMutation>(StartNewRunDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'startNewRun');
    },
    test(variables?: TestMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<TestMutation>(TestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'test');
    },
    createStep(variables: CreateStepMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateStepMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateStepMutation>(CreateStepDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createStep');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;