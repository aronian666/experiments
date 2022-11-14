<script>
  import { onMount } from "svelte";
  import Quagga from "quagga";
  const decodes = [
    "code_128_reader",
    "ean_reader",
    "ean_8_reader",
    "code_39_reader",
    "code_39_vin_reader",
    "codabar_reader",
    "upc_reader",
    "upc_e_reader",
    "i2of5_reader",
    "2of5_reader",
    "code_93_reader",
  ];
  let code;
  let decoder = "code_128_reader";
  const changeDecoder = (decoder) => {
    console.log("cada vez que el decoder cambie", decoder);
    try {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#camera"), // Or '#yourElement' (optional)
          },
          decoder: {
            readers: [decoder],
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
    } catch {
      console.log("no se pudo iniciar");
    }
  };
  $: changeDecoder(decoder);
</script>

<select name="decoders" id="decoders" bind:value={decoder}>
  {#each decodes as decoder}
    <option value={decoder}>{decoder}</option>
  {/each}
</select>
<div id="camera" />

{#if code}
  <h1>Codigo: {code}</h1>
{/if}
