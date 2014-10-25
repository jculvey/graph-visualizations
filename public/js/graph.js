function BFS(G, s, seen) {
    var Q = [];
    var seen = seen || [];

    //bookkeeping for later
    var P = {s: null};
    var visits = [];

    Q.push(s);
    while (Q.length > 0) {
        var u = Q.shift();
        if (_.contains(seen, u)) continue;
        seen.push(u);
        _.each(G[u].neighbors, function(v) {
          P[v] = u;
          Q.push(v);
        });

        // Record some stats to drive visualization
        visits.push({
          u: u,
          v: G[u].neighbors,
          q_length: Q.length,
          seen_length: seen.length
        });
    }
    return visits;
}

function DFS(G, s, seen) {
    var Q = [];
    var seen = seen || [];

    //bookkeeping for later
    var P = {s: null};
    var visits = [];

    Q.push(s);
    while (Q.length > 0) {
        var u = Q.pop();
        if (_.contains(seen, u)) continue;
        seen.push(u);
        _.each(G[u].neighbors, function(v) {
          P[v] = u;
          Q.push(v);
        });

        // Record some stats to drive visualization
        visits.push({
          u: u,
          v: G[u].neighbors,
          q_length: Q.length,
          seen_length: seen.length
        });
    }
    return visits;
}

function components(G) {
    var seen = [];
    var visits = [];

    _.each(G, function(v, u) {
        if (!_.contains(seen, u)) {
          visits = visits.concat(BFS(G, parseInt(u), seen));
        }
    });
    return visits;
}

window.timeout = null;

function printVisits(visits, G, E) {
    if (visits.length === 0) return;

    window.timeout = setTimeout(function() {
        var visit = visits.shift();
        var u = visit.u;
        var v = visit.v;
        G[u].visited = true;
        currentNode = G[u];
        _.each(v, function(i) {
          G[i].discovered = true;
        });

        // Render the display
        update({
          G: G,
          edges: E,
          seen_length: visit.seen_length
        });
        printVisits(visits, G, E);
    }, animationDelay);
}

