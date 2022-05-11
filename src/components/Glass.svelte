<script>
    import { Vector2 } from "three";
    import Draw from "./components/Draw.svelte";
    const glass = new Vector2(300, 100);
    let mierdas = [];
    let cuts = [];
    $: sections = mierdas
        .map((s) => Array(s.quantity).fill(new Vector2(s.x, s.y)))
        .flat();
    glass.init = new Vector2(0, 0);
    function cut(glass, sections) {
        const section = sections[0];

        if (!section) return [];
        const forms = getForms(
            section,
            glass,
            sections.slice(1, sections.length)
        );
        return forms;
    }
    function getForms(section, glass, sections) {
        const axles = ["x", "y"];
        const count = section.x === section.y ? 1 : 2;

        let posibilities = [];
        for (let index = 0; index < count; index++) {
            const form = new Vector2(
                section[axles[index]],
                section[axles[axles.length - index - 1]]
            );
            form.init = glass.init;
            const glasses = getGlasses(form, glass);
            if (glasses === false) continue;
            glasses.forEach((glass) => {
                posibilities.push({
                    sections: [form],
                    glasses: glass.filter((g) => g.x !== 0 && g.y !== 0),
                });
            });
        }
        if (sections.length === 0) return posibilities;

        return nextGlass(posibilities, sections);
    }

    function nextGlass(posibilities, sections) {
        let fusion = [];
        posibilities.forEach((posibility) => {
            posibility.glasses.forEach((glass, index) => {
                const cuts = cut(glass, [sections[0]]);
                const restGlasses = [...posibility.glasses];
                restGlasses.splice(index, 1);
                cuts.forEach((cut) => {
                    fusion.push({
                        sections: [...posibility.sections, ...cut.sections],
                        glasses: [...restGlasses, ...cut.glasses],
                    });
                });
            });
        });
        const min = Math.min(...fusion.map((p) => p.glasses.length));
        fusion = fusion.filter((p) => p.glasses.length <= min + 1);

        if (sections[1])
            return nextGlass(fusion, sections.slice(1, sections.length));
        return fusion;
    }
    function getGlasses(section, glass) {
        const axles = ["x", "y"];
        const count = section.x === glass.x || section.y === glass.y ? 1 : 2;
        const ab = [];

        if (glass.x - section.x < 0 || glass.y - section.y < 0) return false;

        for (let index = 0; index < count; index++) {
            const axis = axles[index];
            const restGlass = new Vector2();
            if (axis === "x") {
                restGlass.set(-section.x, 0);
            } else {
                restGlass.set(0, -section.y);
            }
            const glass1 = glass.clone().add(restGlass);
            let glass2;
            if (axis === "x") {
                glass2 = glass.clone().add(new Vector2(-glass1.x, -section.y));
                glass1.init = new Vector2(
                    glass.x - glass1.x + glass.init.x,
                    glass.init.y
                );
                glass2.init = new Vector2(
                    glass.init.x,
                    glass.y - glass2.y + glass.init.y
                );
            } else {
                glass2 = glass.clone().add(new Vector2(-section.x, -glass1.y));
                glass1.init = new Vector2(
                    glass.init.x,
                    glass.y - glass1.y + glass.init.y
                );
                glass2.init = new Vector2(
                    glass.x - glass2.x + glass.init.x,
                    glass.init.y
                );
            }

            let glasses = [glass1, glass2].filter((g) => g.x >= 0 && g.y >= 0);
            ab.push(glasses);
        }
        return ab.filter((p) => p.length > 0);
    }
</script>

<form>
    <fieldset>
        <label for="glass[x]">Ancho</label>
        <input type="number" bind:value={glass.x} />
    </fieldset>
    <fieldset>
        <label for="glass[y]">Alto</label>
        <input type="number" bind:value={glass.y} />
    </fieldset>
    {#each mierdas as section, i}
        <div>
            <fieldset>
                <label for={`section[${i}][x]`}>Seccion {i + 1} Ancho</label>
                <input type="number" bind:value={section.x} />
            </fieldset>
            <fieldset>
                <label for={`section[${i}][y]`}>Seccion {i + 1} Alto</label>
                <input type="number" bind:value={section.y} />
            </fieldset>
            <fieldset>
                <label for={`section[${i}][quantity]`}
                    >Seccion {i + 1} cantidad</label
                >
                <input type="number" bind:value={section.quantity} />
            </fieldset>
        </div>
    {/each}
    <button
        type="button"
        on:click={(e) => {
            const vector = new Vector2();
            vector.quantity = 1;
            mierdas.push(vector);
            mierdas = mierdas;
        }}>A;adir corte</button
    >
    <button
        on:click={(e) => {
            const cutsArray = cut(glass, sections);
            const min = Math.min(...cutsArray.map((c) => c.glasses.length));

            cuts = cutsArray.filter((c) => c.glasses.length === min);
            console.log(cuts);
        }}
        type="button"
    >
        Cortar
    </button>
</form>
<Draw {glass} {cuts} />

<style>
    form {
        display: grid;
    }
    fieldset {
        border: none;
        display: grid;
        grid-template-columns: 5rem 10rem;
    }
    label {
        font-weight: bold;
    }
    div {
        display: flex;
    }
</style>
