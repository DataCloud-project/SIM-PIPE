<script lang="ts">
    import OverlayComponent from '../../modals/artifact-browser.svelte'

    let isOverlayOpen = false;

    const openOverlay = () => {
      console.log('openOverlay');
      isOverlayOpen = true;
    };

    const closeOverlay = () => {
      console.log('closeOverlay');
      isOverlayOpen = false;
    };
</script>
    

<div>
  <h1>
      Hello there!
  </h1>
  <OverlayComponent isOpen={isOverlayOpen} close={closeOverlay} />
  <button class="btn variant-ghost-primary" on:click={openOverlay}>Click me</button>
</div>