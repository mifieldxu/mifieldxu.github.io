'use strict';
//
(function make_stuff(){

//input management
window.onload = function(){
	var _0 = bigInt('0'),
		_1 = bigInt('1'),
		_2 = bigInt('2'),
		_4 = bigInt('4'),
		_8 = bigInt('8'),
		_16 = bigInt('16'),
		generation_count,
		offspring_ave,
		sc, //self crossing
		generation,
		popln_ctrl = true,
		popln_ctrl_limit = bigInt('1000000000000000000000'),
		percentage_decimal = 4,
		percentage_scaling = bigInt(Math.pow(10, 2 + percentage_decimal));

	var area_chart_element = document.getElementById("area-chart").getContext('2d'),
		pie_chart_element = document.getElementById("pie-chart").getContext('2d');

	var area_chart = new Chart(area_chart_element, {
			type: 'line',
			data: {
				labels: [],
				spanGaps: true,
				datasets: [{
					backgroundColor: Samples.utils.transparentize(window.chartColors.red),
					borderColor: window.chartColors.red,
					data: [],
					label: 'AABB',
					fill: 'origin',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.orange),
					borderColor: window.chartColors.orange,
					data: [],
					label: 'AABb',
					fill: '-1',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.yellow),
					borderColor: window.chartColors.yellow,
					data: [],
					label: 'AAbb',
					fill: '-1',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.green),
					borderColor: window.chartColors.green,
					data: [],
					label: 'AaBB',
					fill: '-1',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.blue),
					borderColor: window.chartColors.blue,
					data: [],
					label: 'AaBb',
					fill: '-1',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.grey),
					borderColor: window.chartColors.grey,
					data: [],
					label: 'Aabb',
					fill: '-1',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.purple),
					borderColor: window.chartColors.purple,
					data: [],
					label: 'aaBB',
					fill: '-1',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.red),
					borderColor: window.chartColors.red,
					data: [],
					label: 'aaBb',
					fill: '-1',
				}, {
					backgroundColor: Samples.utils.transparentize(window.chartColors.orange),
					borderColor: window.chartColors.orange,
					data: [],
					label: 'aabb',
					fill: '-1',
				}],
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
				labels: [
					"AABB",
					"AABb",
					"AAbb",
					"AaBB",
					"AaBb",
					"Aabb",
					"aaBB",
					"aaBb",
					"aabb",
				],
				datasets: [{
					data: [],
					backgroundColor: [
						window.chartColors.red,
						window.chartColors.orange,
						window.chartColors.yellow,
						window.chartColors.green,
						window.chartColors.blue,
						window.chartColors.grey,
						window.chartColors.purple,
						window.chartColors.red,
						window.chartColors.orange,
					],
					label: '0',
				}],
			},
			options: {
				legend: {
					position: 'right',
				},
				animation: {
					animateScale: false,
					animateRotate: false,
					duration: 500,
				}
			},
		});

	function percentage(p, sum){
		return p.times(percentage_scaling).over(sum).value / percentage_scaling;
	}

	function population_sum(g){
		return g.AABB.p.plus(g.AABb.p).plus(g.AAbb.p).plus(g.AaBB.p).plus(g.AaBb.p).plus(g.Aabb.p).plus(g.aaBB.p).plus(g.aaBb.p).plus(g.aabb.p);
	}

	function population_ctrl(g){
		var sum = population_sum(g);
		if (popln_ctrl && sum.compare(popln_ctrl_limit)) {
			g.AABB.p = g.AABB.p.times(popln_ctrl_limit).over(sum);
			g.AABb.p = g.AABb.p.times(popln_ctrl_limit).over(sum);
			g.AAbb.p = g.AAbb.p.times(popln_ctrl_limit).over(sum);
			g.AaBB.p = g.AaBB.p.times(popln_ctrl_limit).over(sum);
			g.AaBb.p = g.AaBb.p.times(popln_ctrl_limit).over(sum);
			g.Aabb.p = g.Aabb.p.times(popln_ctrl_limit).over(sum);
			g.aaBB.p = g.aaBB.p.times(popln_ctrl_limit).over(sum);
			g.aaBb.p = g.aaBb.p.times(popln_ctrl_limit).over(sum);
			g.aabb.p = g.aabb.p.times(popln_ctrl_limit).over(sum);
		};
		return g;
	}

	function free_cross(n, g){
		var g_ = {
				AABB: {p: bigInt('0'), s: g.AABB.s},
				AABb: {p: bigInt('0'), s: g.AABb.s},
				AAbb: {p: bigInt('0'), s: g.AAbb.s},
				AaBB: {p: bigInt('0'), s: g.AaBB.s},
				AaBb: {p: bigInt('0'), s: g.AaBb.s},
				Aabb: {p: bigInt('0'), s: g.Aabb.s},
				aaBB: {p: bigInt('0'), s: g.aaBB.s},
				aaBb: {p: bigInt('0'), s: g.aaBb.s},
				aabb: {p: bigInt('0'), s: g.aabb.s},
			},
			sum = population_sum(g);
		area_chart.data.labels.push(n.toString());
		area_chart.data.datasets.forEach((dataset) => {
			dataset.data.push(percentage(g[dataset.label].p, sum));
		});
		if (n == generation_count) {
			return g;
		} else {
			g_.AABB.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).over(_1)	.plus(g.AABB.p.times(g.AABb.p).over(_2))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).over(_2))			.plus(g.AABB.p.times(g.AaBb.p).over(_4))			.plus(g.AABB.p.times(g.Aabb.p).times(_0))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).times(_0))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).over(_4))	.plus(g.AABb.p.times(g.AAbb.p).times(_0))			.plus(g.AABb.p.times(g.AaBB.p).over(_4))			.plus(g.AABb.p.times(g.AaBb.p).over(_8))			.plus(g.AABb.p.times(g.Aabb.p).times(_0))			.plus(g.AABb.p.times(g.aaBB.p).times(_0))			.plus(g.AABb.p.times(g.aaBb.p).times(_0))			.plus(g.AABb.p.times(g.aabb.p).times(_0))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).times(_0))			.plus(g.AAbb.p.times(g.AaBb.p).times(_0))			.plus(g.AAbb.p.times(g.Aabb.p).times(_0))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).times(_0))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).over(_4))	.plus(g.AaBB.p.times(g.AaBb.p).over(_8))			.plus(g.AaBB.p.times(g.Aabb.p).times(_0))			.plus(g.AaBB.p.times(g.aaBB.p).times(_0))			.plus(g.AaBB.p.times(g.aaBb.p).times(_0))			.plus(g.AaBB.p.times(g.aabb.p).times(_0))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_16))	.plus(g.AaBb.p.times(g.Aabb.p).times(_0))			.plus(g.AaBb.p.times(g.aaBB.p).times(_0))			.plus(g.AaBb.p.times(g.aaBb.p).times(_0))			.plus(g.AaBb.p.times(g.aabb.p).times(_0))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).times(_0))	.plus(g.Aabb.p.times(g.aaBB.p).times(_0))			.plus(g.Aabb.p.times(g.aaBb.p).times(_0))			.plus(g.Aabb.p.times(g.aabb.p).times(_0))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).times(_0))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).times(_0))	.plus(g.aaBb.p.times(g.aabb.p).times(_0))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.AABB.s).over(percentage_scaling);
			g_.AABb.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).over(_2))			.plus(g.AABB.p.times(g.AAbb.p).over(_1))			.plus(g.AABB.p.times(g.AaBB.p).times(_0))			.plus(g.AABB.p.times(g.AaBb.p).over(_4))			.plus(g.AABB.p.times(g.Aabb.p).over(_2))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).times(_0))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).over(_2))	.plus(g.AABb.p.times(g.AAbb.p).over(_2))			.plus(g.AABb.p.times(g.AaBB.p).over(_4))			.plus(g.AABb.p.times(g.AaBb.p).over(_4))			.plus(g.AABb.p.times(g.Aabb.p).over(_4))			.plus(g.AABb.p.times(g.aaBB.p).times(_0))			.plus(g.AABb.p.times(g.aaBb.p).times(_0))			.plus(g.AABb.p.times(g.aabb.p).times(_0))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).over(_2))			.plus(g.AAbb.p.times(g.AaBb.p).over(_4))			.plus(g.AAbb.p.times(g.Aabb.p).times(_0))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).times(_0))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).times(_0))	.plus(g.AaBB.p.times(g.AaBb.p).over(_8))			.plus(g.AaBB.p.times(g.Aabb.p).over(_4))			.plus(g.AaBB.p.times(g.aaBB.p).times(_0))			.plus(g.AaBB.p.times(g.aaBb.p).times(_0))			.plus(g.AaBB.p.times(g.aabb.p).times(_0))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_8))	.plus(g.AaBb.p.times(g.Aabb.p).over(_8))			.plus(g.AaBb.p.times(g.aaBB.p).times(_0))			.plus(g.AaBb.p.times(g.aaBb.p).times(_0))			.plus(g.AaBb.p.times(g.aabb.p).times(_0))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).times(_0))	.plus(g.Aabb.p.times(g.aaBB.p).times(_0))			.plus(g.Aabb.p.times(g.aaBb.p).times(_0))			.plus(g.Aabb.p.times(g.aabb.p).times(_0))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).times(_0))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).times(_0))	.plus(g.aaBb.p.times(g.aabb.p).times(_0))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.AABb.s).over(percentage_scaling);
			g_.AAbb.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).times(_0))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).times(_0))			.plus(g.AABB.p.times(g.AaBb.p).times(_0))			.plus(g.AABB.p.times(g.Aabb.p).times(_0))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).times(_0))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).over(_4))	.plus(g.AABb.p.times(g.AAbb.p).over(_2))			.plus(g.AABb.p.times(g.AaBB.p).times(_0))			.plus(g.AABb.p.times(g.AaBb.p).over(_8))			.plus(g.AABb.p.times(g.Aabb.p).over(_4))			.plus(g.AABb.p.times(g.aaBB.p).times(_0))			.plus(g.AABb.p.times(g.aaBb.p).times(_0))			.plus(g.AABb.p.times(g.aabb.p).times(_0))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).over(_1))	.plus(g.AAbb.p.times(g.AaBB.p).times(_0))			.plus(g.AAbb.p.times(g.AaBb.p).over(_4))			.plus(g.AAbb.p.times(g.Aabb.p).over(_2))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).times(_0))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).times(_0))	.plus(g.AaBB.p.times(g.AaBb.p).times(_0))			.plus(g.AaBB.p.times(g.Aabb.p).times(_0))			.plus(g.AaBB.p.times(g.aaBB.p).times(_0))			.plus(g.AaBB.p.times(g.aaBb.p).times(_0))			.plus(g.AaBB.p.times(g.aabb.p).times(_0))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_16))	.plus(g.AaBb.p.times(g.Aabb.p).over(_8))			.plus(g.AaBb.p.times(g.aaBB.p).times(_0))			.plus(g.AaBb.p.times(g.aaBb.p).times(_0))			.plus(g.AaBb.p.times(g.aabb.p).times(_0))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).over(_4))	.plus(g.Aabb.p.times(g.aaBB.p).times(_0))			.plus(g.Aabb.p.times(g.aaBb.p).times(_0))			.plus(g.Aabb.p.times(g.aabb.p).times(_0))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).times(_0))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).times(_0))	.plus(g.aaBb.p.times(g.aabb.p).times(_0))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.AAbb.s).over(percentage_scaling);
			g_.AaBB.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).times(_0))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).over(_2))			.plus(g.AABB.p.times(g.AaBb.p).over(_4))			.plus(g.AABB.p.times(g.Aabb.p).times(_0))			.plus(g.AABB.p.times(g.aaBB.p).over(_1))			.plus(g.AABB.p.times(g.aaBb.p).over(_2))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).times(_0))	.plus(g.AABb.p.times(g.AAbb.p).times(_0))			.plus(g.AABb.p.times(g.AaBB.p).over(_4))			.plus(g.AABb.p.times(g.AaBb.p).over(_8))			.plus(g.AABb.p.times(g.Aabb.p).times(_0))			.plus(g.AABb.p.times(g.aaBB.p).over(_2))			.plus(g.AABb.p.times(g.aaBb.p).over(_2))			.plus(g.AABb.p.times(g.aabb.p).times(_0))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).times(_0))			.plus(g.AAbb.p.times(g.AaBb.p).times(_0))			.plus(g.AAbb.p.times(g.Aabb.p).times(_0))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).times(_0))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).over(_2))	.plus(g.AaBB.p.times(g.AaBb.p).over(_4))			.plus(g.AaBB.p.times(g.Aabb.p).times(_0))			.plus(g.AaBB.p.times(g.aaBB.p).over(_2))			.plus(g.AaBB.p.times(g.aaBb.p).over(_4))			.plus(g.AaBB.p.times(g.aabb.p).times(_0))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_8))	.plus(g.AaBb.p.times(g.Aabb.p).times(_0))			.plus(g.AaBb.p.times(g.aaBB.p).over(_4))			.plus(g.AaBb.p.times(g.aaBb.p).over(_4))			.plus(g.AaBb.p.times(g.aabb.p).times(_0))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).times(_0))	.plus(g.Aabb.p.times(g.aaBB.p).times(_0))			.plus(g.Aabb.p.times(g.aaBb.p).times(_0))			.plus(g.Aabb.p.times(g.aabb.p).times(_0))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).times(_0))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).times(_0))	.plus(g.aaBb.p.times(g.aabb.p).times(_0))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.AaBB.s).over(percentage_scaling);
			g_.AaBb.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).times(_0))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).times(_0))			.plus(g.AABB.p.times(g.AaBb.p).over(_4))			.plus(g.AABB.p.times(g.Aabb.p).over(_2))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).over(_2))			.plus(g.AABB.p.times(g.aabb.p).over(_1))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).times(_0))	.plus(g.AABb.p.times(g.AAbb.p).times(_0))			.plus(g.AABb.p.times(g.AaBB.p).over(_4))			.plus(g.AABb.p.times(g.AaBb.p).over(_4))			.plus(g.AABb.p.times(g.Aabb.p).over(_4))			.plus(g.AABb.p.times(g.aaBB.p).over(_2))			.plus(g.AABb.p.times(g.aaBb.p).over(_2))			.plus(g.AABb.p.times(g.aabb.p).over(_2))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).over(_2))			.plus(g.AAbb.p.times(g.AaBb.p).over(_4))			.plus(g.AAbb.p.times(g.Aabb.p).times(_0))			.plus(g.AAbb.p.times(g.aaBB.p).over(_1))			.plus(g.AAbb.p.times(g.aaBb.p).over(_2))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).times(_0))	.plus(g.AaBB.p.times(g.AaBb.p).over(_4))			.plus(g.AaBB.p.times(g.Aabb.p).over(_2))			.plus(g.AaBB.p.times(g.aaBB.p).times(_0))			.plus(g.AaBB.p.times(g.aaBb.p).over(_4))			.plus(g.AaBB.p.times(g.aabb.p).over(_2))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_4))	.plus(g.AaBb.p.times(g.Aabb.p).over(_4))			.plus(g.AaBb.p.times(g.aaBB.p).over(_4))			.plus(g.AaBb.p.times(g.aaBb.p).over(_4))			.plus(g.AaBb.p.times(g.aabb.p).over(_4))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).times(_0))	.plus(g.Aabb.p.times(g.aaBB.p).over(_2))			.plus(g.Aabb.p.times(g.aaBb.p).over(_4))			.plus(g.Aabb.p.times(g.aabb.p).times(_0))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).times(_0))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).times(_0))	.plus(g.aaBb.p.times(g.aabb.p).times(_0))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.AaBb.s).over(percentage_scaling);
			g_.Aabb.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).times(_0))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).times(_0))			.plus(g.AABB.p.times(g.AaBb.p).times(_0))			.plus(g.AABB.p.times(g.Aabb.p).times(_0))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).times(_0))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).times(_0))	.plus(g.AABb.p.times(g.AAbb.p).times(_0))			.plus(g.AABb.p.times(g.AaBB.p).times(_0))			.plus(g.AABb.p.times(g.AaBb.p).over(_4))			.plus(g.AABb.p.times(g.Aabb.p).over(_4))			.plus(g.AABb.p.times(g.aaBB.p).times(_0))			.plus(g.AABb.p.times(g.aaBb.p).over(_2))			.plus(g.AABb.p.times(g.aabb.p).over(_2))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).times(_0))			.plus(g.AAbb.p.times(g.AaBb.p).over(_4))			.plus(g.AAbb.p.times(g.Aabb.p).over(_2))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).over(_2))			.plus(g.AAbb.p.times(g.aabb.p).over(_1))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).times(_0))	.plus(g.AaBB.p.times(g.AaBb.p).times(_0))			.plus(g.AaBB.p.times(g.Aabb.p).times(_0))			.plus(g.AaBB.p.times(g.aaBB.p).times(_0))			.plus(g.AaBB.p.times(g.aaBb.p).times(_0))			.plus(g.AaBB.p.times(g.aabb.p).times(_0))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_8))	.plus(g.AaBb.p.times(g.Aabb.p).over(_4))			.plus(g.AaBb.p.times(g.aaBB.p).times(_0))			.plus(g.AaBb.p.times(g.aaBb.p).over(_8))			.plus(g.AaBb.p.times(g.aabb.p).over(_4))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).over(_2))	.plus(g.Aabb.p.times(g.aaBB.p).times(_0))			.plus(g.Aabb.p.times(g.aaBb.p).over(_4))			.plus(g.Aabb.p.times(g.aabb.p).over(_2))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).times(_0))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).times(_0))	.plus(g.aaBb.p.times(g.aabb.p).times(_0))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.Aabb.s).over(percentage_scaling);
			g_.aaBB.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).times(_0))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).times(_0))			.plus(g.AABB.p.times(g.AaBb.p).times(_0))			.plus(g.AABB.p.times(g.Aabb.p).times(_0))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).times(_0))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).times(_0))	.plus(g.AABb.p.times(g.AAbb.p).times(_0))			.plus(g.AABb.p.times(g.AaBB.p).times(_0))			.plus(g.AABb.p.times(g.AaBb.p).times(_0))			.plus(g.AABb.p.times(g.Aabb.p).times(_0))			.plus(g.AABb.p.times(g.aaBB.p).times(_0))			.plus(g.AABb.p.times(g.aaBb.p).times(_0))			.plus(g.AABb.p.times(g.aabb.p).times(_0))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).times(_0))			.plus(g.AAbb.p.times(g.AaBb.p).times(_0))			.plus(g.AAbb.p.times(g.Aabb.p).times(_0))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).times(_0))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).over(_4))	.plus(g.AaBB.p.times(g.AaBb.p).over(_8))			.plus(g.AaBB.p.times(g.Aabb.p).times(_0))			.plus(g.AaBB.p.times(g.aaBB.p).over(_2))			.plus(g.AaBB.p.times(g.aaBb.p).over(_4))			.plus(g.AaBB.p.times(g.aabb.p).times(_0))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_16))	.plus(g.AaBb.p.times(g.Aabb.p).times(_0))			.plus(g.AaBb.p.times(g.aaBB.p).over(_4))			.plus(g.AaBb.p.times(g.aaBb.p).over(_8))			.plus(g.AaBb.p.times(g.aabb.p).times(_0))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).times(_0))	.plus(g.Aabb.p.times(g.aaBB.p).times(_0))			.plus(g.Aabb.p.times(g.aaBb.p).times(_0))			.plus(g.Aabb.p.times(g.aabb.p).times(_0))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).over(_1))	.plus(g.aaBB.p.times(g.aaBb.p).over(_2))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).over(_4))	.plus(g.aaBb.p.times(g.aabb.p).times(_0))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.aaBB.s).over(percentage_scaling);
			g_.aaBb.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).times(_0))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).times(_0))			.plus(g.AABB.p.times(g.AaBb.p).times(_0))			.plus(g.AABB.p.times(g.Aabb.p).times(_0))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).times(_0))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).times(_0))	.plus(g.AABb.p.times(g.AAbb.p).times(_0))			.plus(g.AABb.p.times(g.AaBB.p).times(_0))			.plus(g.AABb.p.times(g.AaBb.p).times(_0))			.plus(g.AABb.p.times(g.Aabb.p).times(_0))			.plus(g.AABb.p.times(g.aaBB.p).times(_0))			.plus(g.AABb.p.times(g.aaBb.p).times(_0))			.plus(g.AABb.p.times(g.aabb.p).times(_0))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).times(_0))			.plus(g.AAbb.p.times(g.AaBb.p).times(_0))			.plus(g.AAbb.p.times(g.Aabb.p).times(_0))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).times(_0))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).times(_0))	.plus(g.AaBB.p.times(g.AaBb.p).over(_8))			.plus(g.AaBB.p.times(g.Aabb.p).over(_4))			.plus(g.AaBB.p.times(g.aaBB.p).times(_0))			.plus(g.AaBB.p.times(g.aaBb.p).over(_4))			.plus(g.AaBB.p.times(g.aabb.p).over(_2))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_8))	.plus(g.AaBb.p.times(g.Aabb.p).over(_8))			.plus(g.AaBb.p.times(g.aaBB.p).over(_4))			.plus(g.AaBb.p.times(g.aaBb.p).over(_4))			.plus(g.AaBb.p.times(g.aabb.p).over(_4))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).times(_0))	.plus(g.Aabb.p.times(g.aaBB.p).over(_2))			.plus(g.Aabb.p.times(g.aaBb.p).over(_4))			.plus(g.Aabb.p.times(g.aabb.p).times(_0))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).over(_2))			.plus(g.aaBB.p.times(g.aabb.p).over(_1))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).over(_2))	.plus(g.aaBb.p.times(g.aabb.p).over(_2))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).times(_0))
			).times(g.aaBb.s).over(percentage_scaling);
			g_.aabb.p = offspring_ave.times(
				g.AABB.p.times(g.AABB.p.minus(sc)).times(_0).plus(g.AABB.p.times(g.AABb.p).times(_0))			.plus(g.AABB.p.times(g.AAbb.p).times(_0))			.plus(g.AABB.p.times(g.AaBB.p).times(_0))			.plus(g.AABB.p.times(g.AaBb.p).times(_0))			.plus(g.AABB.p.times(g.Aabb.p).times(_0))			.plus(g.AABB.p.times(g.aaBB.p).times(_0))			.plus(g.AABB.p.times(g.aaBb.p).times(_0))			.plus(g.AABB.p.times(g.aabb.p).times(_0))
															.plus(g.AABb.p.times(g.AABb.p.minus(sc)).times(_0))	.plus(g.AABb.p.times(g.AAbb.p).times(_0))			.plus(g.AABb.p.times(g.AaBB.p).times(_0))			.plus(g.AABb.p.times(g.AaBb.p).times(_0))			.plus(g.AABb.p.times(g.Aabb.p).times(_0))			.plus(g.AABb.p.times(g.aaBB.p).times(_0))			.plus(g.AABb.p.times(g.aaBb.p).times(_0))			.plus(g.AABb.p.times(g.aabb.p).times(_0))
																												.plus(g.AAbb.p.times(g.AAbb.p.minus(sc)).times(_0))	.plus(g.AAbb.p.times(g.AaBB.p).times(_0))			.plus(g.AAbb.p.times(g.AaBb.p).times(_0))			.plus(g.AAbb.p.times(g.Aabb.p).times(_0))			.plus(g.AAbb.p.times(g.aaBB.p).times(_0))			.plus(g.AAbb.p.times(g.aaBb.p).times(_0))			.plus(g.AAbb.p.times(g.aabb.p).times(_0))
																																									.plus(g.AaBB.p.times(g.AaBB.p.minus(sc)).times(_0))	.plus(g.AaBB.p.times(g.AaBb.p).times(_0))			.plus(g.AaBB.p.times(g.Aabb.p).times(_0))			.plus(g.AaBB.p.times(g.aaBB.p).times(_0))			.plus(g.AaBB.p.times(g.aaBb.p).times(_0))			.plus(g.AaBB.p.times(g.aabb.p).times(_0))
																																																						.plus(g.AaBb.p.times(g.AaBb.p.minus(sc)).over(_16))	.plus(g.AaBb.p.times(g.Aabb.p).over(_8))			.plus(g.AaBb.p.times(g.aaBB.p).times(_0))			.plus(g.AaBb.p.times(g.aaBb.p).over(_8))			.plus(g.AaBb.p.times(g.aabb.p).over(_4))
																																																																			.plus(g.Aabb.p.times(g.Aabb.p.minus(sc)).over(_4))	.plus(g.Aabb.p.times(g.aaBB.p).times(_0))			.plus(g.Aabb.p.times(g.aaBb.p).over(_4))			.plus(g.Aabb.p.times(g.aabb.p).over(_2))
																																																																																.plus(g.aaBB.p.times(g.aaBB.p.minus(sc)).times(_0))	.plus(g.aaBB.p.times(g.aaBb.p).times(_0))			.plus(g.aaBB.p.times(g.aabb.p).times(_0))
																																																																																													.plus(g.aaBb.p.times(g.aaBb.p.minus(sc)).over(_4))	.plus(g.aaBb.p.times(g.aabb.p).over(_2))
																																																																																																										.plus(g.aabb.p.times(g.aabb.p.minus(sc)).over(_1))
			).times(g.aabb.s).over(percentage_scaling);

			g_ = population_ctrl(g_);
			return free_cross(n + 1, g_);
		};
	}

	function update_input(){
		var sum;
		generation_count = parseInt(document.getElementById("generation-count").value);
		offspring_ave = bigInt(document.getElementById("offspring-average").value);
		if (document.getElementById("self-crossing").checked) sc = bigInt('0');
			else sc = bigInt('1');
		generation = {
			AABB: {p: bigInt(document.getElementById("AABB-initial-population").value), s: bigInt(parseFloat(document.getElementById("AABB-survivability").value) * percentage_scaling)},
			AABb: {p: bigInt(document.getElementById("AABb-initial-population").value), s: bigInt(parseFloat(document.getElementById("AABb-survivability").value) * percentage_scaling)},
			AAbb: {p: bigInt(document.getElementById("AAbb-initial-population").value), s: bigInt(parseFloat(document.getElementById("AAbb-survivability").value) * percentage_scaling)},
			AaBB: {p: bigInt(document.getElementById("AaBB-initial-population").value), s: bigInt(parseFloat(document.getElementById("AaBB-survivability").value) * percentage_scaling)},
			AaBb: {p: bigInt(document.getElementById("AaBb-initial-population").value), s: bigInt(parseFloat(document.getElementById("AaBb-survivability").value) * percentage_scaling)},
			Aabb: {p: bigInt(document.getElementById("Aabb-initial-population").value), s: bigInt(parseFloat(document.getElementById("Aabb-survivability").value) * percentage_scaling)},
			aaBB: {p: bigInt(document.getElementById("aaBB-initial-population").value), s: bigInt(parseFloat(document.getElementById("aaBB-survivability").value) * percentage_scaling)},
			aaBb: {p: bigInt(document.getElementById("aaBb-initial-population").value), s: bigInt(parseFloat(document.getElementById("aaBb-survivability").value) * percentage_scaling)},
			aabb: {p: bigInt(document.getElementById("aabb-initial-population").value), s: bigInt(parseFloat(document.getElementById("aabb-survivability").value) * percentage_scaling)},
		};
		sum = population_sum(generation);

		pie_chart.data.datasets[0].data = [
			percentage(generation.AABB.p, sum),
			percentage(generation.AABb.p, sum),
			percentage(generation.AAbb.p, sum),
			percentage(generation.AaBB.p, sum),
			percentage(generation.AaBb.p, sum),
			percentage(generation.Aabb.p, sum),
			percentage(generation.aaBB.p, sum),
			percentage(generation.aaBb.p, sum),
			percentage(generation.aabb.p, sum),
		];
		pie_chart.update();
	}

	function simulate(g){
		document.body.classList.add("loading");
		Array.prototype.forEach.call(document.getElementsByTagName("input"), function(element){
			element.setAttribute("disabled", "");
		});

		area_chart.data.labels = [];
		area_chart.data.datasets.forEach((dataset) => {
			dataset.data = [];
		});

		console.log(JSON.stringify(free_cross(0, g)));

		area_chart.update();

		document.body.classList.remove("loading");
		Array.prototype.forEach.call(document.getElementsByTagName("input"), function(element){
			element.removeAttribute("disabled");
		});
	}

	update_input();

	Array.prototype.forEach.call(document.getElementsByTagName("input"), function(element){
		element.oninput = update_input;
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

	// simulate(generation);
};
})();