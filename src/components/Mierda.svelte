<script>
    const data = [
        20, 12, 5, 8, 19, 14, 10, 11, 15, 6, 24, 7, 7, 13, 29, 13, 6, 4, 11, 11,
    ];
    let totalPercentage = 0;
    let totalData = 0;
    const min = 100;
    const max = 590;
    const range = max - min;
    const k = parseInt(1 + 3.322 * Math.log10(data.length));
    const amplitude = range / k;
    const rows = [];
    let media = 0;
    const fs = [12, 6, 15, 15, 12];
    for (let i = 0; i < k; i++) {
        const limit = {
            lower: min + i * amplitude,
            upper: min + i * amplitude + amplitude,
        };
        const count = fs[i];
        console.log((limit.upper + limit.lower) / 2);
        media += ((limit.upper + limit.lower) * count) / 2;
        const percentage = count / fs.reduce((a, b) => a + b);
        totalPercentage += percentage;
        totalData += count;
        const row = {
            x: `${limit.lower} - ${limit.upper}`,
            fi: count,
            hi: percentage.toFixed(2),
            Fi: totalData,
            Hi: totalPercentage.toFixed(2),
            pi: (percentage * 100).toFixed(2),
            Pi: (totalPercentage * 100).toFixed(2),
        };
        rows.push(row);
    }
</script>

<table>
    <thead>
        <tr>
            <td>x</td>
            <td>fi</td>
            <td>hi</td>
            <td>Fi</td>
            <td>Hi</td>
            <td>pi</td>
            <td>Pi</td>
        </tr>
    </thead>
    <tbody>
        {#each rows as row, x}
            <tr>
                {#each Object.entries(row) as [name, value], y}
                    <td>{value}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    td {
        border: 1px solid black;
        padding: 0.5rem 1rem;
    }
</style>
