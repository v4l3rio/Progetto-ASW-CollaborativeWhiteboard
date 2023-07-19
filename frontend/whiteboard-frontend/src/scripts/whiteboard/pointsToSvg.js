

exports.traitToPaths = function (trait, svg, id) {
    const LINE_WIDTH = 8;
    let pathString = "";
    if (trait?.points && trait.points.length > 0) {
        let point = getCursors(trait.points[0].x, trait.points[0].y, svg);
        //console.log(point);
        pathString += 'M' + point.x + ',' + point.y;
        trait.points.splice(0, 1);
        trait.points.forEach(p => {
            point = getCursors(p.x, p.y, svg);
            pathString += 'L' + point.x + ',' + point.y;
        })
        return createPath(id, pathString, trait.color, LINE_WIDTH);
    }
    return {}

}

function createPath (id, line, lineColor, width){
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', line);
    path.setAttributeNS(null, 'fill', 'none');
    path.setAttributeNS(null, 'stroke-linecap', 'round');
    path.setAttributeNS(null, 'stroke-linejoin', 'round');
    path.setAttributeNS(null, 'stroke', lineColor);
    path.setAttribute("id", id);
    path.setAttributeNS(null, 'stroke-width', width);
    return path;
}

function getCursors(x,y, svg) {
    const point = {}
    let rect = svg.getBoundingClientRect();
    point.x = Math.round(x - rect.x)
    point.y = Math.round(y - rect.y)
    return point;
}
