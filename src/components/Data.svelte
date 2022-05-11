<script>
    const data = [
        ...Array(30).fill(10),
        ...Array(30).fill(20),
        ...Array(30).fill(30),
        ...Array(20).fill(50),
    ];
    function newPay(x) {
        return x + 270 - ((x + 270) * 3.5) / 100;
    }
    let totalPercentage = 0;
    let totalData = 0;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const k = parseInt(1 + 3.322 * Math.log10(data.length)) - 3;
    const amplitude = range / k;
    const rows = [];

    for (let i = 0; i < k; i++) {
        const limit = {
            lower: min + i * amplitude,
            upper: min + i * amplitude + amplitude,
        };
        const countArray = data.filter((item) => {
            if (i + 1 == k) {
                return item >= limit.lower && item <= limit.upper;
            }
            return item >= limit.lower && item < limit.upper;
        });
        const count = countArray.length;
        const percentage = count / data.length;
        totalPercentage += percentage;
        totalData += count;
        const row = {
            upper: limit.upper,
            lower: limit.lower,
            xi: (limit.upper + limit.lower) / 2,
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
    const mediaMierda = data.reduce((a, b) => a + b) / data.length;
    console.log(mediaMierda);
    const getP = (p) => {
        const ga = p / 100;
        const algo = data.length * ga;
        const index = rows.findIndex((r) => r.Fi === algo);
        if (index === -1) {
            const anotherIndex = rows.findIndex((r) => r.Fi > algo);
            const row = rows[anotherIndex];
            const beforeRow = rows[anotherIndex - 1];
            const algo1 = beforeRow ? beforeRow.Fi : 0;
            return row.lower + ((algo - algo1) / row.fi) * k;
        }
        return rows[index].upper;
    };
    const mediana = getP(50);
    const media = rows.reduce((a, b) => a + b.fi * b.xi, 0) / data.length;
    const mediaArmonica =
        data.length /
        rows.reduce((a, b) => {
            return a + b.fi / b.xi;
        }, 0);
    const agg =
        rows.reduce((a, b) => {
            return a + b.fi * Math.log10(b.xi);
        }, 0) / data.length;
    const mediaGeometrica = Math.pow(10, agg);
    const medicaCuadratica = Math.pow(
        rows.reduce((a, b) => a + b.fi * b.xi * b.xi, 0) / data.length,
        0.5
    );
    const getModa = () => {
        const max = Math.max(...rows.map((ro) => ro.fi));
        const index = rows.findIndex((r) => {
            console.log(r);
            return r.fi === max;
        });
        console.log(max, index);
        const row = rows[index];
        const beforeRow = rows[index - 1];
        const afterRow = rows[index + 1];
        console.log(beforeRow, afterRow);
        return (
            row.lower +
            ((row.fi - beforeRow.fi) /
                (row.fi - beforeRow.fi + row.fi - afterRow.fi)) *
                k
        );
    };
    const moda = getModa();
    let p = 50;
    $: qwe = getP(p);
</script>

<input type="number" bind:value={p} />
{qwe}
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

<table>
    <thead>
        <tr>
            <th>Data</th>
            <th>Answer</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Media</td>
            <td>{media}</td>
        </tr>
        <tr>
            <td>mediaana</td>
            <td>{mediana}</td>
        </tr>
        <tr>
            <td>Media Armonica</td>
            <td>{mediaArmonica}</td>
        </tr>
        <tr>
            <td>mediaGeometrica</td>
            <td>{mediaGeometrica}</td>
        </tr>
        <tr>
            <td>medicaCuadratica</td>
            <td>{medicaCuadratica}</td>
        </tr>
        <tr>
            <td>moda</td>
            <td>{moda}</td>
        </tr>
    </tbody>
</table>

<style>
    td {
        border: 1px solid black;
        padding: 0.5rem 1rem;
    }
</style>
