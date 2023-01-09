<script lang="ts">
  import { selectedLogs } from '../stores/stores.js';
</script>

<div class="logtext">
  <h3>Logs</h3>
  <p>{$selectedLogs}</p>
</div>

<style>
  .logtext {
    margin-right: 100px;
    margin-left: 40px;
  }
  h3 {
    font-size: 26px;
    margin: 20px 0;
    text-align: center;
    padding-left: 40px;
    padding-right: 40px;
  }
</style>
