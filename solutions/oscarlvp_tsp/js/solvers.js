const randomTour = (length) => d3.shuffle(d3.range(length));

class Solver {
    constructor(cities, distances, neighborhood) {
        this.cities = cities;
        this.distances = distances;
        this.neighborhood = neighborhood;
    }

    cost(tour) {
        let result = 0;
        for(let index = 0; index < tour.length; index++) {
            result += this.distances[tour[index]][tour[(index + 1)%tour.length]];
        }
        return result;
    }

    evaluate(tour) {
        return { tour: tour, cost: this.cost(tour) };
    }

    randomSolution() {
        return this.evaluate(randomTour(this.cities.length));
    }

    start(initial) {
        this.optimum = initial? this.evaluate(initial) : this.randomSolution();
    }

    advance(data) {
        throw new Error("advance method should be implemented by deridev classes");
    }

}

class HillClimbingSolver extends Solver {
    constructor(cities, distances, neighborhood) { 
        super(cities, distances, neighborhood); 
        self.counter = 0;
    }

    advance(data) {
        let next = this.neighborhood(this.optimum.tour, this.distances, data);
        if(next.delta < 0) {
            this.optimum = { tour: next.tour, cost: this.optimum.cost + next.delta };
        }
    }
}
