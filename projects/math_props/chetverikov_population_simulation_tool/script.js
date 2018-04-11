'use strict';
// TO DO:
// deal with onpopstate and the event.state object and use pushState() instead of replaceState()
window.onload = function(){
	var _0 = bigInt('0'),
		_1 = bigInt('1'),
		_2 = bigInt('2'),
		_4 = bigInt('4'),
		generation_count,
		offspring_ave,
		sc, //self crossing
		population_correlation,
		survival_correlation,
		generation,
		popln_ctrl = true,
		popln_ctrl_limit = bigInt('1000000000000000000000'),
		percentage_decimal = 6,
		percentage_scaling = bigInt(Math.pow(10, 2 + percentage_decimal)),
		fractions = {
			AA: {
				AA: {
					AA: _1,
					Aa: 0,
					aa: 0,
				},
				Aa: {
					AA: _2,
					Aa: _2,
					aa: 0,
				},
				aa: {
					AA: 0,
					Aa: _1,
					aa: 0,
				},
			},
			Aa: {
				AA: {
					AA: _2,
					Aa: _2,
					aa: 0,
				},
				Aa: {
					AA: _4,
					Aa: _2,
					aa: _4,
				},
				aa: {
					AA: 0,
					Aa: _2,
					aa: _2,
				},
			},
			aa: {
				AA: {
					AA: 0,
					Aa: _1,
					aa: 0,
				},
				Aa: {
					AA: 0,
					Aa: _2,
					aa: _2,
				},
				aa: {
					AA: 0,
					Aa: 0,
					aa: _1,
				},
			},
			BB: {
				BB: {
					BB: _1,
					Bb: 0,
					bb: 0,
				},
				Bb: {
					BB: _2,
					Bb: _2,
					bb: 0,
				},
				bb: {
					BB: 0,
					Bb: _1,
					bb: 0,
				},
			},
			Bb: {
				BB: {
					BB: _2,
					Bb: _2,
					bb: 0,
				},
				Bb: {
					BB: _4,
					Bb: _2,
					bb: _4,
				},
				bb: {
					BB: 0,
					Bb: _2,
					bb: _2,
				},
			},
			bb: {
				BB: {
					BB: 0,
					Bb: _1,
					bb: 0,
				},
				Bb: {
					BB: 0,
					Bb: _2,
					bb: _2,
				},
				bb: {
					BB: 0,
					Bb: 0,
					bb: _1,
				},
			},
		},
		genotypes = ['AABB', 'AABb', 'AAbb', 'AaBB', 'AaBb', 'Aabb', 'aaBB', 'aaBb', 'aabb'],
		colors = ['#800080', '#ae105e', '#dc143c', '#6135b1', '#aa4aaa', '#d87488', '#4169e1', '#8a96ea', '#d3d3d3'],
		prefixes = {
			init_pop: "p_",
			srvl_rate: "s_",
		},
		in_focus_class_name = "in_focus",
		pos_pheno_class_name = 3;

	var area_chart_element = document.getElementById("area_chart_canvas").getContext('2d'),
		pie_chart_element = document.getElementById("pie_chart_canvas").getContext('2d');

	var area_chart = new Chart(area_chart_element, {
			type: 'line',
			data: {
				labels: [],
				spanGaps: true,
				datasets: [],
			},
			options: {
				elements: {
					line: {
						tension: 0,
					},
				},
				showLines: true,
				scales: {
					yAxes: [{
						stacked: true,
						ticks: {
							beginAtZero: true,
						},
					}],
				},
				animation: {
					duration: 0,
				},
				hover: {
					animationDuration: 0,
				},
				responsiveAnimationDuration: 0,
				resposive: true,
				maintainAspectRatio: false,
				plugins: {
					filler: {
						propogate: false,
					},
				},
			},
		}),
		pie_chart = new Chart(pie_chart_element, {
			type: 'doughnut',
			data: {
				labels: genotypes,
				datasets: [{
					data: [],
					backgroundColor: colors,
					label: '0',
				}],
			},
			options: {
				legend: {
					position: 'top',
				},
				animation: {
					animateScale: false,
					animateRotate: false,
					duration: 400,
				},
				resposive: true,
				maintainAspectRatio: false,
			},
		});

	function transparentize(color, opacity){
		var alpha = opacity === undefined ? 0.5 : 1 - opacity;
		return Color(color).alpha(alpha).rgbString();
	}

	function percentage(p, sum){
		return p.times(percentage_scaling).over(sum).value / percentage_scaling;
	}

	function population_sum(g){
		return g.AABB.p.plus(g.AABb.p).plus(g.AAbb.p).plus(g.AaBB.p).plus(g.AaBb.p).plus(g.Aabb.p).plus(g.aaBB.p).plus(g.aaBb.p).plus(g.aabb.p);
	}

	function population_ctrl(g){
		var sum = population_sum(g);
		if (popln_ctrl && sum.compare(popln_ctrl_limit)) {
			genotypes.forEach((genotype) => {
				g[genotype].p = g[genotype].p.times(popln_ctrl_limit).over(sum);	
			});
		};
		return g;
	}

//equivalent to cross()
	function cross_without_logging(parent_1, parent_2, result, number_of_crossings){
		var p_1 = {
				a: parent_1.substring(0, 2),
				b: parent_1.substring(2),
			},
			p_2 = {
				a: parent_2.substring(0, 2),
				b: parent_2.substring(2),
			},
			r = {
				a: result.substring(0, 2),
				b: result.substring(2),
			};
		if (results[p_1.a][p_2.a][r.a] && results[p_1.b][p_2.b][r.b]) {
			return number_of_crossings.over(results[p_1.a][p_2.a][r.a].times(results[p_1.b][p_2.b][r.b]));
		} else {
			return _0;
		};
	}

	function cross(parent_1, parent_2, result, number_of_crossings){
		var combined_fraction;
		if (fractions.hasOwnProperty(parent_1) && fractions[parent_1].hasOwnProperty(parent_2) && fractions[parent_1][parent_2].hasOwnProperty(result)) {
			combined_fraction = fractions[parent_1][parent_2][result];
		} else {
			var p_1 = {
					a: parent_1.substring(0, 2),
					b: parent_1.substring(2),
				},
				p_2 = {
					a: parent_2.substring(0, 2),
					b: parent_2.substring(2),
				},
				r = {
					a: result.substring(0, 2),
					b: result.substring(2),
				};
			if (fractions[p_1.a][p_2.a][r.a] === 0 || fractions[p_1.b][p_2.b][r.b] === 0) {
				combined_fraction = 0;
			} else {
				combined_fraction = fractions[p_1.a][p_2.a][r.a].times(fractions[p_1.b][p_2.b][r.b]);
			};

			if (!fractions.hasOwnProperty(parent_1)) {
				fractions[parent_1] = {};
			};
			if (!fractions[parent_1].hasOwnProperty(parent_2)) {
				fractions[parent_1][parent_2] = {};
			};
			fractions[parent_1][parent_2][result] = combined_fraction;
		};
		return combined_fraction?number_of_crossings.over(combined_fraction):_0;
	}

	function free_crossing(n, g){
		var g_ = {},
			sum = population_sum(g),
			crossings = [];
		// pushing data in g
		area_chart.data.labels.push(n.toString());
		area_chart.data.datasets.forEach((dataset) => {
			dataset.data.push(percentage(g[dataset.label].p, sum));
		});
		if (n == generation_count) {
			return g;
		} else {
			// initializing g_
			genotypes.forEach((genotype) => {
				g_[genotype] = {p: bigInt('0'), s: g[genotype].s};
			});
			// generating crossings array
			for (var i = 0; i < genotypes.length; i++) {
				var parent_1 = genotypes[i];
				crossings.push(g[parent_1].p.times(g[parent_1].p.minus(sc)));
				for (var j = i + 1; j < genotypes.length; j++) {
					var parent_2 = genotypes[j];
					crossings.push(g[parent_1].p.times(g[parent_2].p));
				};
			};
			// free-cross
			genotypes.forEach((genotype) => {
				var pairs = bigInt('0'),
					counter = 0;
				for (var i = 0; i < genotypes.length; i++) {
					var parent_1 = genotypes[i];
					for (var j = i; j < genotypes.length; j++) {
						var parent_2 = genotypes[j];
						pairs = pairs.plus(cross(parent_1, parent_2, genotype, crossings[counter]));
						counter++;
					};
				};
				g_[genotype].p = offspring_ave.times(pairs).times(g_[genotype].s).over(percentage_scaling)
			});
			g_ = population_ctrl(g_);
			return free_crossing(n + 1, g_);
		};
	}

	function update_input(event){
		var sum;
		
		survival_correlation = document.getElementById("survival_correlate").checked;
		population_correlation = document.getElementById("population_correlate").checked;
		if (event && event.target) {
			if (event.target.classList.contains("survival_rate") && survival_correlation) {
				Array.prototype.forEach.call(document.getElementsByClassName(event.target.classList[pos_pheno_class_name] + " survival_rate"), function(element){
					element.value = event.target.value;
				});
			};

			if (event.target.classList.contains("population") && population_correlation) {
				Array.prototype.forEach.call(document.getElementsByClassName("population"), function(element){
					element.value = event.target.value;
				});
			};
		};

		generation_count = parseInt(document.getElementById("g_count").value);
		offspring_ave = bigInt(document.getElementById("offspring_ave").value);
		if (document.getElementById("self_crossing").checked) {
			sc = bigInt('0');
		} else {
			sc = bigInt('1');
		};
		generation = {};
		genotypes.forEach((genotype) => {
			generation[genotype] = {
				p: bigInt(parseInt(document.getElementById(prefixes.init_pop + genotype).value)),
				s: bigInt(parseFloat(document.getElementById(prefixes.srvl_rate + genotype).value) * percentage_scaling),
			};
		});

		sum = population_sum(generation);
		pie_chart.data.datasets[0].data = [];
		genotypes.forEach((genotype) => {
			pie_chart.data.datasets[0].data.push(percentage(generation[genotype].p, sum));
		});
		pie_chart.update();
	}

	function focus(action, event){
		if (action === 'add') {
			update_input();
		};
		if (event && event.target) {
			if (population_correlation && event.target.classList.contains('population')) {
				Array.prototype.forEach.call(document.querySelectorAll('.cell input.population'), function(element){
					if (element.id != event.target.id) {
						element.classList[action](in_focus_class_name);
					};
				});
			} else if (survival_correlation && event.target.classList.contains('survival_rate')) {
				Array.prototype.forEach.call(document.querySelectorAll('.cell input.survival_rate'), function(element){
					if (element.classList[pos_pheno_class_name] === event.target.classList[pos_pheno_class_name] && element.id !== event.target.id) {
						element.classList[action](in_focus_class_name);
					};
				});
			};
		};
	}

	function add_focus(event){
		focus('add', event);
	}

	function remove_focus(event){
		focus('remove', event);
	}

	function simulate(g){
		var new_parameter_string = "";
		document.body.classList.add("loading");
		Array.prototype.forEach.call(document.getElementsByTagName("input"), function(element){
			element.setAttribute("disabled", "");
		});

		area_chart.data.labels = [];
		area_chart.data.datasets.forEach((dataset) => {
			dataset.data = [];
		});
// where the magic happens
		free_crossing(0, g);

		area_chart.update();

		document.getElementById("has_run").value = "1";

		document.body.classList.remove("loading");
		Array.prototype.forEach.call(document.getElementsByTagName("input"), function(element){
			element.removeAttribute("disabled");
			if (element.type !== "submit") {
				if (element.type === "number" || element.type === "hidden") {
					new_parameter_string += "&" + encodeURIComponent(element.id) + "=" + encodeURIComponent(element.value);
				} else if (element.type === "checkbox") {
					new_parameter_string += "&" + encodeURIComponent(element.id) + "=" + encodeURIComponent(element.checked);
				};
			};
		});
		window.history.replaceState(generation, '', 'index.html?' + new_parameter_string.substring(1));
	}

	// window.onpopstate = function(event){
	// 	if (event.state) {
	// 		generation = event.state;
	// 		simulate();
	// 	};
	// };

	for (var i = 0; i < genotypes.length; i++) {
		area_chart.data.datasets.push({
			backgroundColor: transparentize(colors[i]),
			borderColor: colors[i],
			data: [],
			label: genotypes[i],
			fill: '-1',
		});
	};
	area_chart.data.datasets[0].fill = 'origin';

	(function update_query_variables(query){
		var vars = query.split("&");
		vars.forEach((var_string) => {
			var parts = var_string.split("="),
				name = decodeURIComponent(parts[0]),
				value = decodeURIComponent(parts[1]),
				input_element = document.getElementById(name);
			if (input_element) {
				if ((input_element.type === "number" || input_element.type === "hidden")  && !Number.isNaN(parseInt(value))) {
					input_element.value = value;
				} else if (input_element.type === "checkbox") {
					input_element.checked = (value === "true")?true:false;
				};
			};
		});
	})(window.location.search.substring(1));

	update_input();

	Array.prototype.forEach.call(document.getElementsByTagName("input"), function(element){
		element.addEventListener('input', update_input);
	});

	Array.prototype.forEach.call(document.querySelectorAll('.cell input'), function(element){
		element.addEventListener('focus', add_focus);
		element.addEventListener('focusout', remove_focus);
	});

	document.getElementById("form").onsubmit = function(){
		simulate(generation);
		return false;
	};

	area_chart.options.tooltips.custom = function(tooltipModel){
		var n, 
			new_pie_chart_data = [];
		if (tooltipModel.dataPoints) {
			n = parseInt(tooltipModel.title);
			area_chart.data.datasets.forEach((dataset) => {
				new_pie_chart_data.push(dataset.data[n]);
			});
		};
		if (new_pie_chart_data.length) {
			pie_chart.data.datasets[0].data = new_pie_chart_data;
			pie_chart.update();
		};
	};

	if (document.getElementById("has_run").value == "1") simulate(generation);
};