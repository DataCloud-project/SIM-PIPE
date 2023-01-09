<script lang="ts">
  import { getContext } from 'svelte';
  import CreateRunModal from '../modals/create-run-modal.svelte';
  import type { ModalContext } from 'src/types';

  const { open } = getContext<ModalContext>('simple-modal');
  function openCreateRunModal(): void {
    open(CreateRunModal);
  }
</script>

<button class="action_button" on:click="{openCreateRunModal}">Create new run</button>

<style>
  button {
    margin-left: 40px;
  }
</style>
