class Controller {
    constructor(cities, distances, solver, neighborhood) {
        this.solver = new solver(cities, distances, neighborhood);
    }

    start(handler) {
        this.solver.start();
        handler(this.solver.optimum);
        this.loop(handler);
    }

    loop(handler) {
        throw new Error('loop should be implemented by derived classes');
    }

    step(handler, data) {
        this.solver.advance(data);
        handler(this.solver.optimum);
    }
}


class TimedController extends Controller {
    DEFAULT_TIMEOUT = 10;

    constructor(cities, distances, solver, neighborhood, timeout) {
        super(cities, distances, solver, neighborhood);
        this.timeout = timeout? timeout : this.DEFAULT_TIMEOUT;
    }

    loop(handler) {
        let self = this;
        setInterval(function () {
            self.step(handler)
        }, this.timeout);
    }
}


class TravisController extends Controller {
    
    constructor(cities, distances, solver) {
        super(cities, distances, solver);
        this.solver.neighborhood = this.next.bind(this); // Ugly, breaks encapsulation
        this.initialize();
    }

    initialize() {
        this.lastLanguage = 'generic';
        this.neighborhoods = [ FirstImprovement.move, FirstImprovement.swap, FirstImprovement.twoOpt ];
        d3.shuffle(this.neighborhoods);
        this.currentNeighborhood = 0;

    }

    next(tour, distances,  language) {
        if(language !== this.lastLanguage) {
            this.lastLanguage = language;
            this.currentNeighborhood = (this.currentNeighborhood + 1) % this.neighborhoods.length;
        }
        return this.neighborhoods[this.currentNeighborhood](tour, distances);
    }

    loop(handler) {

        let ws = new WebSocket('wss://travis.durieux.me');
        let self = this;

        let counter = 0;

        ws.onmessage = function (message) {
            let language = self.lastLanguage;
            if (message && message.data) {
                let event = JSON.parse(message.data);
                language = event.data.config.language;
            }
            self.step(handler,language);
        } 
    }
}