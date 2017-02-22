'use strict';
//
(function draw_board(){
	var board = JXG.JSXGraph.initBoard('jxgbox', {grid: false});

// force laws
	var fn = {
		simple_harmonic_motion : function(distance){
			return distance;
		},
		inverse_square : function(distance){
			return 1/(distance*distance);
		},
		inverse_cube : function(distance){
			return 1/(distance*distance*distance);
		}
	};
	
	function force_law(distance){
		return fn[document.getElementById('force_law_option').value](distance);
	}

	var point_names= ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
		pt = {},
		ln = {},
		cl = {};

// drawing
	pt["S"] = board.create('point', [0, 0], {name: 'S', size: 1});
	pt["A"] = board.create('point', [3, 0], {name: 'A', size: 1});
	pt["B"] = board.create('point', [0.35, 1], {name: 'B', size: 1});
	ln["SA"] = board.create('line', [pt["S"], pt["A"]], {straightFirst:false, straightLast:false, strokeWidth:2});
	ln["AB"] = board.create('line', [pt["A"], pt["B"]], {straightFirst:false, straightLast:false, strokeWidth:2});
	ln["SB"] = board.create('line', [pt["S"], pt["B"]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});

	pt["c"] = board.create('point', [function(){return pt["B"].X()*2-pt["A"].X()}, function(){return pt["B"].Y()*2-pt["A"].Y()}], {name: 'c', size: 1});
	ln["Sc"] = board.create('line', [pt["S"], pt["c"]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});
	ln["Bc"] = board.create('line', [pt["B"], pt["c"]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});
	ln["Cc_parallel"] = board.create('parallel', [ln["SB"],pt["c"]], {visible: false});
	pt["C"] = board.create('glider', [2, 0, ln["Cc_parallel"]], {name: 'C', size: 1});
	ln["Cc"] = board.create('line', [pt["C"], pt["c"]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});
	ln["BC"] = board.create('line', [pt["B"], pt["C"]], {straightFirst:false, straightLast:false, strokeWidth:2});
	ln["SC"] = board.create('line', [pt["S"], pt["C"]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});

	function draw_next_point(C_pt){
		var c_pt = C_pt.toLowerCase(),
			p_pt = point_names[point_names.indexOf(C_pt)-1],
			N_pt = point_names[point_names.indexOf(C_pt)+1],
			n_pt = N_pt.toLowerCase();
		pt[n_pt] = board.create('point', [function(){return pt[C_pt].X()*2-pt[p_pt].X()}, function(){return pt[C_pt].Y()*2-pt[p_pt].Y()}], {name: n_pt, size: 1});
		ln["S"+n_pt] = board.create('line', [pt["S"], pt[n_pt]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});
		ln[p_pt+n_pt] = board.create('line', [pt[C_pt], pt[n_pt]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});
		ln[N_pt+n_pt+"_parallel"] = board.create('parallel', [ln["S"+C_pt], pt[n_pt]], {visible: false});
		cl[n_pt+"_circle"] = board.create('circle', [pt[n_pt], force_law(pt["S"].Dist(pt[C_pt]))*pt[C_pt].Dist(pt[c_pt])/force_law(pt["S"].Dist(pt[p_pt]))], {visible: false});
		pt[N_pt] = board.create('intersection', [ln[N_pt+n_pt+"_parallel"], cl[n_pt+"_circle"], 0], {name: N_pt, size: 1});
		ln[N_pt+n_pt] = board.create('line', [pt[N_pt], pt[n_pt]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});
		ln[C_pt+N_pt] = board.create('line', [pt[C_pt], pt[N_pt]], {straightFirst:false, straightLast:false, strokeWidth:2});
		ln["S"+N_pt] = board.create('line', [pt["S"], pt[N_pt]], {straightFirst:false, straightLast:false, strokeWidth:1, dash:1});
	}

	function draw_points(first_point){
		for (var i = point_names.indexOf(first_point) + 1; i < point_names.length - 1; i++) {
			if (pt[point_names[i]]) board.removeObject(pt[point_names[i]]);
			if (pt[point_names[i].toLowerCase()]) board.removeObject(pt[point_names[i].toLowerCase()]);
		}
		for (var i = point_names.indexOf(first_point); i < Math.min(point_names.length, document.getElementById('number_slider').value)-1; i++) {
			draw_next_point(point_names[i]);
		};
	}

	draw_points('C');

// dynamic controls
	board.on('move', function(){
        pt["A"].moveTo([Math.max(pt["A"].X(), pt["S"].X()), pt["S"].Y()]);
        pt["B"].moveTo([Math.max(pt["B"].X(), pt["S"].X()), Math.max(pt["B"].Y(), pt["S"].Y())]);
        pt["C"].moveTo([Math.min(pt["C"].X(), pt["c"].X()), Math.min(pt["C"].Y(), pt["c"].Y())]);
	});
	var movement_S = board.create('transform', [function(){return pt["S"].X()}, function(){return pt["S"].Y()}], {type: 'translate'});
	movement_S.bindTo([pt["A"]]);
	var movement_A = board.create('transform', [function(){return pt["A"].X()}, function(){return pt["A"].Y()}], {type: 'translate'});
	movement_A.bindTo([pt["B"]]);

//input management
window.onload = function(){
	document.getElementById('number_slider').oninput = function(){
		document.getElementById('number_display').value = document.getElementById('number_slider').value;
		draw_points('C');
	};
	document.getElementById('number_slider').oninput();
	document.getElementById('force_law_option').oninput = function(){
		draw_points('C');
	};
	document.getElementById('reset_button').oninput = function(){
		draw_board();
	};
};
})();