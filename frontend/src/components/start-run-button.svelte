<script lang="ts">
  import { getContext } from 'svelte';

  import Alert from '../modals/alert-modal.svelte';
  import startRunMutation from '../queries/start-run.js';
  import { clickedRun, graphQLClient } from '../stores/stores.js';
  import refreshActiveRuns from '../utils/refresh-runs.js';
  import type { ModalContext } from 'src/types';

  const { open, close } = getContext<ModalContext>('simple-modal');

  async function executeStartRun(): Promise<void> {
    if (!$clickedRun) {
      throw new Error('No run selected');
    }
    const result = await $graphQLClient.request<{
      Start_Run: string;
    }>(startRunMutation, { run_id: $clickedRun.run_id });
    const output = JSON.parse(result.Start_Run) as { code: number; message: string };
    if (output.code >= 200 && output.code < 300) {
      open(Alert, { message: `🎐 Success! ${$clickedRun.name} has been added to the queue` });
      setTimeout(() => {
        close();
      }, 1500);
      // refresh the runs until there are no active runs
      setTimeout(refreshActiveRuns, 4000);
    } else {
      open(Alert, { message: output.message });
      setTimeout(() => {
        close();
      }, 1000);
    }
  }
</script>

{#if $clickedRun?.status === 'waiting'}
  <button title="Start run" class="action_button start_run" on:click="{executeStartRun}">
    ▶
  </button>
{/if}
