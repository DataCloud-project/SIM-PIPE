<script lang="ts">
  import { getContext } from 'svelte';
  import CreateSimulationModal from '../modals/create-simulation-modal.svelte';
  import type { ModalContext } from 'src/types';

  const { open } = getContext<ModalContext>('simple-modal');
  function openCreateSimulationModal(): void {
    open(CreateSimulationModal);
  }
</script>

<button class="action_button" on:click="{openCreateSimulationModal}">Create new simulation</button>
