<script lang="ts">
  export let component: (() => Promise<any>) | undefined = undefined;
  let loading;

  $: loading = component?.();
</script>

{#await loading then { default: Component }}
  <Component {...$$props} />
{/await}
