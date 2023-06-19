import { writable } from 'svelte/store';
import type { GraphQLClient } from 'graphql-request';

export const graphQlClient = writable<GraphQLClient>();

// TODO: remove; temporary list to keep dry runs [samples used in frontend until api is ready]
export const dry_runs = {
    "name": "TLU",
    "dry_run_count": "42",
    "simulations_count": "3",
    "created_date": "07-06-2023",
    "project_id": "1234",
    "data":
    [
        {
            "name": "run 1",
            "run_result": "success",
            "duration_seconds": "1267",
            "action": "rerun",
            "created_at": "07/06/2023 03:05:15"
        },
        {
            "name": "run 2",
            "run_result": "failed",
            "duration_seconds": "2",
            "action": "rerun",
            "created_at": "07/06/2023 03:05:15"
        },
        {
            "name": "run 3",
            "run_result": "pending",
            "duration_seconds": "",
            "action": "run",
            "created_at": "07/06/2023 03:05:15"
        },
        {
            "name": "run 4",
            "run_result": "running",
            "duration_seconds": "986",
            "action": "stop",
            "created_at": "07/06/2023 03:05:15"
        }        
    ]
}