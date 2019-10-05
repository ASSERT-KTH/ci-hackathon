# The Travis Silhouette Problem

This piece is inspired by [the work of Robert Bosch](http://www2.oberlin.edu/math/faculty/bosch/tspart-page.html).

We take the Travis Logo, and select some points. Then we solve a Traveling Salesman Problem taking those points as cities and the Euclidean distance in the 2D space. We finally draw the solution to obtain a nice drawing.

<image src="./oscarlvp_tsp/images/logo.png" width="300" alt="Travis Logo"/>
<image src="./oscarlvp_tsp/images/solution.png" width="300" alt="Solution"/>


To solve the TSP we use a [Hill Climbing](https://en.wikipedia.org/wiki/Hill_climbing) implementation with [variable neighborhood](https://en.wikipedia.org/wiki/Variable_neighborhood_search) starting from a random solution.
We let Travis set the pace for the solution. Whenever we receive an event from the server, then we execute the next iteration of the algorithm. The implementation includes three neighborhood operators:
- [**2-Opt**](https://en.wikipedia.org/wiki/2-opt): Reorder the tour to remove a cross
- Swap: Exchange two cities in the tour
- Move: Change the order of a city in the tour

Here is a speedrun for the impacients:

[![TSP Solution](http://img.youtube.com/vi/e8KOHeqhNwQ/0.jpg)](https://youtu.be/e8KOHeqhNwQ "Solving the TSP")

Big thanks to @alyfdezarias, my wife, for her help with the neighborhoods.
