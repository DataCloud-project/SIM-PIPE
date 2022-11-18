<script context="module">
	import { gql } from 'graphql-request';

	export const stop_run_mutation = gql`
		mutation stop_run($run_id: String!) {
			Stop_Run(run_id: $run_id)
		}
	`;
</script>
