
const ESPILON = -0.001;

const FirstImprovement = {

    swap: function (tour, distances) {

        const next = (p) => tour[(p + 1) % tour.length];
        const prev = (p) => tour[(p - 1 + tour.length) % tour.length];
        
        function deltaGeneral(i, j) {
            let pi = prev(i);
            let ci = tour[i];
            let ni = next(i);
            let pj = prev(j);
            let cj = tour[j];
            let nj = next(j);
            return (distances[pi][cj] + distances[cj][ni] + distances[pj][ci] + distances[ci][nj] - (distances[pi][ci] + distances[ci][ni] + distances[pj][cj] + distances[cj][nj]))
        }

        function deltaConsecutive(i, j) {
            let pi = prev(i);
            let nj = next(j);
            let ci = tour[i];
            let cj = tour[j];
            return distances[pi][cj] + distances[ci][nj] - distances[pi][ci] - distances[cj][nj];
        }

        function delta(i, j) {
            if (i === 0 && j === tour.length - 1) {
                return deltaConsecutive(j, i);
            }
            if (j === i + 1) {
                return deltaConsecutive(i, j);
            }
            return deltaGeneral(i, j);
        }

        function move(i, j) {
            if (i === j) return tour;
            let result = [...tour];
            result[i] = tour[j];
            result[j] = tour[i];
            return result;
        }

        for(let from = 0; from < tour.length; from++) {
            for(let to = from + 1; to < tour.length; to ++) {
                let variation = delta(from, to);
                if(variation < ESPILON) {
                    return { tour: move(from, to), delta: variation };
                }
            }
        }
        return { tour: tour, delta: 0 };
    },


    twoOpt: function (tour, distances) {

        const next = (p) => tour[(p + 1) % tour.length];
       
        function delta(i, j) {
            let ni = next(i);
            let nj = next(j);
            let ci = tour[i];
            let cj = tour[j];
            return distances[ci][cj] + distances[ni][nj] - distances[ci][ni] - distances[cj][nj];
        }

        function move(from, to) {
            let result = [...tour]
            let count = to - from;
            for(let i = 0; i < count; i++) {
                result[from + 1 + i] = tour[to - i];
            }
            return result;
        }

        for(let i=0; i < tour.length - 2; i++) {
            for(let j = i + 2; j < tour.length; j++) {
                let variation = delta(i, j);
                if (variation < ESPILON) {
                    return { tour: move(i, j), delta: variation };
                }
            }
        }

        return { tour: tour, delta: 0 };
    },

    move: function(tour, distances) {

        const next = (p) => tour[(p + 1) % tour.length];
        const prev = (p) => tour[(p - 1 + tour.length) % tour.length];

        function delta(i, j) {
            if(i===0 && j === tour.length -1) return 0; // Its the same tour
            let pi = prev(i);
            let ci = tour[i];
            let ni = next(i);
            let cj = tour[j]
            let nj = next(j);
            return distances[pi][ni] + distances[cj][ci] + distances[ci][nj] - distances[pi][ci] - distances[ci][ni] - distances[cj][nj];
        }

        function move(from, to) {
            let result = [...tour];
            let toMove = tour[from];
            for(let i=from; i < to; i++) {
                result[i] = result[i+1];
            }
            result[to] = toMove;
            return result;
        }

        for(let i=0; i < tour.length-1; i++) {
            for(let j=i+1; j < tour.length; j++) {
                let variation = delta(i, j);
                if(variation < ESPILON) {
                    return { tour: move(i, j), delta: variation };
                }
            }
        }
        return { tour: tour, delta: 0 };
    }

};

