<script context="module">
	import { gql } from 'graphql-request';

	export const delete_simulation_mutation = gql`
		mutation delete_simulation($simulation_id: String!) {
			Delete_Simulation(simulation_id: $simulation_id)
		}
	`;
</script>
