<script lang="ts">
  import { getContext } from 'svelte';
  import Alert from '../modals/alert-modal.svelte';
  import stop_run_mutation from '../queries/stop-run.js';
  import { clickedRun, graphQLClient } from '../stores/stores.js';
  import type { ModalContext } from 'src/types';

  const { open, close } = getContext<ModalContext>('simple-modal');

  async function executeStopRun(): Promise<void> {
    if (!$clickedRun) {
      throw new Error('No run selected');
    }
    const result = await $graphQLClient.request<{
      Stop_Run: string;
    }>(stop_run_mutation, { run_id: $clickedRun.run_id });
    const output = JSON.parse(result.Stop_Run) as { code: number; message: string };
    if (output.code >= 200 && output.code < 300) {
      open(Alert, { message: `🎐 Success! Stop signal has been sent to ${$clickedRun.name}` });
      setTimeout(() => {
        close();
      }, 1500);
    } else {
      open(Alert, { message: output.message });
      setTimeout(() => {
        close();
      }, 1500);
    }
  }
</script>

{#if $clickedRun?.status === 'active' || $clickedRun?.status === 'queued'}
  <button title="Stop run" class="action_button stop_run" on:click="{executeStopRun}">STOP</button>
{/if}
