
exports.interpolate = function interpolate(points, path, tension = 1) {
    path.points = catmull_rom_spline(points, tension);
}

function catmull_rom_spline(data, k) {

    if (k == null) k = 1;

    const size = data.length;
    const last = size - 4;

    let path = "M" + [data[0], data[1]];

    for (let i = 0; i < size - 2; i +=2) {

        const x0 = i ? data[i - 2] : data[0];
        const y0 = i ? data[i - 1] : data[1];

        const x1 = data[i];
        const y1 = data[i + 1];

        const x2 = data[i + 2];
        const y2 = data[i + 3];

        const x3 = i !== last ? data[i + 4] : x2;
        const y3 = i !== last ? data[i + 5] : y2;

        const cp1x = x1 + (x2 - x0) / 6 * k;
        const cp1y = y1 + (y2 - y0) / 6 * k;

        const cp2x = x2 - (x3 - x1) / 6 * k;
        const cp2y = y2 - (y3 - y1) / 6 * k;

        path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
    }
    return path;
}