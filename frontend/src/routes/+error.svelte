<script lang="ts">
  // eslint-disable-next-line import/extensions
  import { page } from '$app/stores';

  const title = $page.status ?? 'Error';
</script>

<h1>Oops..</h1>
<h2>{title}</h2>
