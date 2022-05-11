<script>
    export let cuts;
    export let glass;

    function getGradienColor(index) {
        const green = (index + 1) * 30;
        return `rgb(255, ${green}, 0)`;
    }
    function setPosition(vector, index) {
        return `
            width: ${vector.x - 1}px;
            height: ${vector.y - 1}px;
            background-color: ${
                index !== undefined ? getGradienColor(index) : "skyblue"
            };
            bottom: ${vector.init?.y || 0}px;
            left: ${vector.init?.x || 0}px;
        `;
    }
</script>

<div>
    {#each cuts as cut, i}
        {i}
        <section
            style={`width: ${glass.x}px; height: ${glass.y}px`}
            class="parent"
        >
            {#each cut.sections as section, index}
                <section class="child" style={setPosition(section, index)} />
            {/each}
            {#each cut.glasses as glass}
                <section class="child" style={setPosition(glass)} />
            {/each}
        </section>
    {/each}
</div>

<style>
    div {
        display: grid;
        gap: 1rem;
    }
    .parent {
        position: relative;
    }
    .child {
        position: absolute;
    }
</style>
