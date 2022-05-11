<script>
  import { onMount } from "svelte";

  const f = (x) => {
    return x * x;
  };
  const algo = (x) => {
    return (x * x * x) / 3;
  };
  const derived = (f) => {
    return function (x, diferencial = 0.00001) {
      return (f(x + diferencial) - f(x)) / diferencial;
    };
  };
  const integrated = (f) => {
    const g = function (x, end, divide = 5000) {
      const diferencial = end / divide;
      if (x > end) return f(x) * diferencial;
      const next = g(x + diferencial, end) + f(x) * diferencial;
      return next;
    };
    return g;
  };
  const d = derived(f);
  const i = integrated(f);
  console.log(i(0, 50), algo(50));
</script>
