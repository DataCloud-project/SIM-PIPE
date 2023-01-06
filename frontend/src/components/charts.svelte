<script lang="ts">
  // TODO we probably do not need dayjs
  import dayjs from 'dayjs';
  import HighStocks, {
    type HTMLDOMElement,
    type SeriesOptionsType,
    type XrangePointOptionsObject,
  } from 'highcharts/highstock';
  import { afterUpdate } from 'svelte';

  import { selectedResourceUsage } from '../stores/stores.js';

  function renderHighstock(
    container: HTMLDOMElement | string,
    title_text: string,
    y_title_text: string,
    series: SeriesOptionsType[],
  ): void {
    afterUpdate(() => {
      HighStocks.stockChart(container, {
        accessibility: {
          enabled: false,
        },
        rangeSelector: {
          enabled: false,
        },
        /* navigator: {
          xAxis: {
            dateTimeLabelFormats: '%L'
          }
        }, */
        title: {
          text: title_text,
        },
        xAxis: {
          // name: 'Timestamps',
          // dateTimeLabelFormats: '%L',
          labels: {
            style: {
              color: 'black',
              fontSize: '21px',
            },
          },
          title: {
            style: {
              color: 'black',
              fontSize: '21px',
            },
          },
        },
        yAxis: {
          labels: {
            style: {
              color: 'black',
              fontSize: '21px',
            },
          },
          title: {
            text: y_title_text,
            style: {
              color: 'black',
              fontSize: '21px',
            },
          },
        },
        series,
      });
    });
  }

  function getDataHighStock(): void {
    const usages = $selectedResourceUsage;
    const cpu: XrangePointOptionsObject[] = [];
    const memory: XrangePointOptionsObject[] = [];
    const memoryMax: XrangePointOptionsObject[] = [];
    const networkRx: XrangePointOptionsObject[] = [];
    const networkTx: XrangePointOptionsObject[] = [];
    for (const usage of usages) {
      const time = dayjs(usage.time).diff(usages[0].time) / 1000;
      // let time = dayjs(usage.time).valueOf();
      cpu.push({ x: time, y: usage.cpu * 100 });
      memory.push({ x: time, y: usage.memory });
      memoryMax.push({ x: time, y: usage.memory_max });
      networkRx.push({ x: time, y: usage.rx_value });
      networkTx.push({ x: time, y: usage.tx_value });
    }
    const tooltip = {
      xDateFormat: '%L',
    };
    renderHighstock('cpu_container', 'CPU', 'CPU usage in percentage', [
      {
        name: 'CPU usage',
        data: cpu,
        type: 'line',
        tooltip: {
          xDateFormat: '%L',
          valueDecimals: 2,
        },
      },
    ]);
    renderHighstock('memory_container', '', 'Memory usage', [
      {
        name: 'Memory used',
        data: memory,
        type: 'line',
        tooltip,
        // color: 'orange'
      },
      {
        name: 'Memory max',
        data: memoryMax,
        type: 'line',
        tooltip,
        color: 'orange',
      },
    ]);
    renderHighstock('network_container', '', 'Network usage', [
      {
        name: 'Received bytes',
        data: networkRx,
        type: 'line',
        // color: 'orange',
        tooltip,
      },
      {
        name: 'Transferred bytes',
        data: networkTx,
        type: 'line',
        tooltip,
        color: 'orange',
      },
    ]);
  }

  // $: $selectedResourceUsage = undefined;
  getDataHighStock();
</script>

<div class="graphs">
  <div class="graphstyle" id="cpu_container"></div>
</div>

<div class="graphs">
  <div class="graphstyle" id="memory_container"></div>
</div>

<div class="graphs">
  <div class="graphstyle" id="network_container"></div>
</div>

<style>
  .graphs {
    float: left;
    padding: 1px;
  }
  .graphstyle {
    width: 720px;
    height: 600px;
    border-radius: 0px;
    border: 1px solid #093a7af5;
  }
</style>
