<!-- example scroll.svelte from https://svelte.dev/repl/4863a658f3584b81bbe3d9f54eb67899?version=3.32.3 -->
<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let threshold = 0;
  export let horizontal = false;

  const dispatch = createEventDispatcher();
  let isLoadMore = false;
  let component: HTMLElement;

  const onScroll = (event: Event): void => {
    const element = event.target as Element;

    const offset = horizontal
      ? element.scrollWidth - element.clientWidth - element.scrollLeft
      : element.scrollHeight - element.clientHeight - element.scrollTop;

    if (offset <= threshold) {
      // if (!isLoadMore && hasMore) {
      if (!isLoadMore) {
        dispatch('loadMore');
      }
      isLoadMore = true;
    } else {
      isLoadMore = false;
    }
  };

  $: {
    if (component?.parentNode) {
      const element = component.parentNode;
      element.addEventListener('scroll', onScroll);
      element.addEventListener('resize', onScroll);
    }
  }

  onDestroy(() => {
    if (component?.parentNode) {
      const element = component.parentNode;
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('resize', onScroll);
    }
  });
</script>

<div bind:this="{component}" style="width:0px"></div>
