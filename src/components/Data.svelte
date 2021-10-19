<script>
    const data = [
        20, 12, 5, 8, 19, 14, 10, 11, 15, 6, 24, 7, 7, 13, 29, 13, 6, 4, 11, 11,
    ];
    let totalPercentage = 0;
    let totalData = 0;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const k = parseInt(1 + 3.322 * Math.log10(data.length));
    const amplitude = range / k;
    const rows = [];
    console.log(max, min);
    let media = 0;
    for (let i = 0; i < k; i++) {
        const limit = {
            lower: (min + i * amplitude).toFixed(2),
            upper: (min + i * amplitude + amplitude).toFixed(2),
        };
        const countArray = data.filter((item) => {
            if (i + 1 == k) {
                return item >= limit.lower && item <= limit.upper;
            }
            return item >= limit.lower && item < limit.upper;
        });
        console.log(limit);
        const count = countArray.length;
        media += ((limit.upper + limit.lower) * count) / 2;
        const percentage = count / data.length;
        totalPercentage += percentage;
        totalData += count;
        const row = {
            x: `${limit.lower} - ${limit.upper}`,
            fi: count,
            hi: percentage.toFixed(3),
            Fi: totalData,
            Hi: totalPercentage.toFixed(3),
            pi: (percentage * 100).toFixed(3),
            Pi: (totalPercentage * 100).toFixed(3),
        };
        rows.push(row);
    }
    function hacer(x, limit = 5) {
        console.log(x);
        if (limit === 1) return x;
        return x + hacer(x / 5 + 2, limit - 1);
    }
    const mierda = hacer(3440);
    console.log(mierda);
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
