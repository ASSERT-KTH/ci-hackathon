
Promise.all([
    d3.json('/data/cities.json'), 
    d3.json('/data/distances.json')
]).then(main);

function main(data) {

    let cities = data[0], distances = data[1];

    let view = d3.select('#optimum');

    let colorScale = d3.scaleLinear().domain([1, 4]).range(['lightgray', 'black']);
    let widthScale = d3.scaleLinear().domain([1, 4]).range([1, 3]);
    
    function draw(solution) {
        let tour = solution.tour;

        const city = (i) => cities[tour[i]];
        const next = (i) => city((i + 1)%tour.length);
        const weight = (i) => (city(i).s + next(i).s)/2;
        const color = (i) => colorScale(weight(i));
        const width = (i) => widthScale(weight(i));

        let selection = view.selectAll('line').data(tour);
        if(selection.size() == 0) {
            selection = selection.enter().append('line');
        }
        return selection
            .attr('x1', (i) => city(i).x)
            .attr('y1', (i) => city(i).y)
            .attr('x2', (i) => next(i).x)
            .attr('y2', (i) => next(i).y)
            .attr('stroke', color)
            .attr('stroke-width', width)
        ;
    }

    let controller = null;
    if(location.hash === '#timed') {
        controller = new TimedController(cities, distances, HillClimbingSolver, FirstImprovement.twoOpt, 2);
    }
    else {
        controller = new TravisController(cities, distances, HillClimbingSolver);
    }
    controller.start(draw);
}
