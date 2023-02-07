<script context="module">
	import { gql } from 'graphql-request';

	export const import_pipeline_from_defpipe_query = gql`
		query ImportPipelineFromDEFPIPE($name: String) {
			ImportPipelineFromDEFPIPE(name:$name)
		}
	`;
</script>
