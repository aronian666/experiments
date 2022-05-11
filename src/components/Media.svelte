<script>
    const data = [
        4, 2, 5, 3, 1, 1, 2, 1, 5, 3, 4, 2, 5, 2, 1, 2, 1, 4, 5, 3, 5, 1, 4, 3,
        5, 1, 2, 4, 4, 2, 4, 5, 4, 5, 5,
    ];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const asd = [];
    for (let i = min; i <= max; i++) {
        asd.push([data.filter((a) => a == i).length, i]);
    }
    const media = data.reduce((a, b) => a + b) / data.length;
    const mediana =
        data.length % 2 != 0
            ? data[parseInt(data.length / 2)]
            : (data[data.length / 2] + data[data.length / 2 - 1]) / 2;
    const cuadrado = data.map((item) => {
        return Math.pow(item - media, 2);
    });
    const varianza = cuadrado.reduce((a, b) => a + b) / data.length;
    const desviacion = Math.pow(varianza, 0.5);
    console.log(media, mediana, asd);
</script>
