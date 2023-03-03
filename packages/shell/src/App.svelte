<script lang="ts">
  import lazy from "lazy";
  let Header = lazy<HeaderType>(() => import("header/Header"));
</script>

<div>
  <Header title="Module Federation Demo" />
</div>
