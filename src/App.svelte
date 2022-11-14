<script>
  import { onMount } from "svelte";
  import Quagga from "quagga";
  let code;

  onMount(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#camera"), // Or '#yourElement' (optional)
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );
    Quagga.onDetected(function (data) {
      console.log("Es este", data.codeResult.code);
      code = data.codeResult.code;
    });
  });
</script>

<div id="camera" />

<h1>Codigo: {code}</h1>
