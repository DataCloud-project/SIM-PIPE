<script lang="ts">
  import { getContext } from 'svelte';
  import AreYouSure from './are-you-sure.svelte';
  import type { ModalContext } from '../types';

  const { open } = getContext<ModalContext>('simple-modal');

  function openAreYouSure(): void {
    open(AreYouSure, { flag: 'run' });
  }
</script>

<button title="Delete run" class="action_button delete_run" on:click="{openAreYouSure}"
  ><span>🗑️</span></button
>
