$( document ).ready(function() {

	var wc = new WC();
	wc.create_standings();
	wc.rank();
	wc.show();


	$( ".newscore" ).keyup(function() {
		if (isNaN($(this).val()) === true) {
			$(this).val('');
			value = -1;
		} else {
			value = parseInt($(this).val());
	};
		$(".message").empty();
		code = parseInt(this.id[0]);
		country = this.id.slice(1,this.id.length);
		
		wc.update_scores(code, country, value);
		wc.create_standings();
		wc.rank();
		wc.show();

	});

});

function WC() {
	this.standings = {
						NGR: {name: "NGR", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0},
						BIH: {name: "BIH", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0},
						IRN: {name: "IRN", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0},
						ARG: {name: "ARG", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0}
					};

	this.scores = [
		{code: 1, team1: {name: "ARG", score:2 }, team2: {name: "BIH", score:1}},
		{code: 2, team1: {name: "IRN", score:0 }, team2: {name: "NGR", score:0}},
		{code: 3, team1: {name: "ARG", score:1 }, team2: {name: "IRN", score:0}},
		{code: 4, team1: {name: "NGR", score:1 }, team2: {name: "BIH", score:0}},
		{code: 5, team1: {name: "NGR", score:-1 }, team2: {name: "ARG", score:-1}},
		{code: 6, team1: {name: "BIH", score:-1 }, team2: {name: "IRN", score:-1}}
	];

};


WC.prototype.update_scores = function (code, country, value) {
			for (i=0; i<this.scores.length; i++) {
				if (this.scores[i].code == code) {
					if (this.scores[i].team1.name == country) {
						this.scores[i].team1.score = value;
					} else {
						this.scores[i].team2.score = value;
					};

				};
			};

}

WC.prototype.create_standings = function () {
		this.standings = {
						NGR: {name: "NGR", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0},
						BIH: {name: "BIH", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0},
						IRN: {name: "IRN", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0},
						ARG: {name: "ARG", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored:0, scored_against:0, goal_diff:0, points: 0, rank:0}
					};
		for (i=0; i<this.scores.length; i++) {


			var team_1_name = this.scores[i].team1.name;
			var team_1_score = this.scores[i].team1.score;

			var team_2_name = this.scores[i].team2.name;
			var team_2_score = this.scores[i].team2.score;

			if (team_1_score > -1 && team_2_score > -1) {
		   		this.standings[team_1_name].games_played = this.standings[team_1_name].games_played + 1;
				this.standings[team_1_name].goals_scored = this.standings[team_1_name].goals_scored + team_1_score;
				this.standings[team_1_name].scored_against = this.standings[team_1_name].scored_against + team_2_score;
				this.standings[team_1_name].goal_diff = this.standings[team_1_name].goal_diff + (team_1_score - team_2_score);

				this.standings[team_2_name].games_played = this.standings[team_2_name].games_played + 1;
				this.standings[team_2_name].goals_scored = this.standings[team_2_name].goals_scored + team_2_score;
				this.standings[team_2_name].scored_against = this.standings[team_2_name].scored_against + team_1_score;
				this.standings[team_2_name].goal_diff = this.standings[team_2_name].goal_diff + (team_2_score - team_1_score);

				if (team_1_score == team_2_score) {
					this.standings[team_1_name].games_draw = this.standings[team_1_name].games_draw + 1;
					this.standings[team_2_name].games_draw = this.standings[team_2_name].games_draw + 1;

					this.standings[team_1_name].points = this.standings[team_1_name].points + 1;
					this.standings[team_2_name].points = this.standings[team_2_name].points + 1;
				};

				if (team_1_score > team_2_score ) {

					this.standings[team_1_name].games_won = this.standings[team_1_name].games_won + 1;
					this.standings[team_1_name].points = this.standings[team_1_name].points + 3

					this.standings[team_2_name].games_lost = this.standings[team_2_name].games_lost + 1

				};

				if (team_1_score < team_2_score) {

					this.standings[team_2_name].games_won = this.standings[team_2_name].games_won + 1;
					this.standings[team_2_name].points = this.standings[team_2_name].points + 3

					this.standings[team_1_name].games_lost = this.standings[team_1_name].games_lost + 1

				};
	  		};
		};

};

WC.prototype.rank = function () {
	countries = [];

	for (i in this.standings){
		countries.push(this.standings[i]);
	};

	sorted_countries = get_rank(countries, this.scores);
	for (i=0; i< sorted_countries.length; i++) {

		var new_rank = i + 1;
		var country = sorted_countries[i].name;
		this.standings[country].rank = new_rank;
	};

};
// <i>Legend: MP = Matches Played, W = Wins, D = Draws, L = Losses, GF = Goals Scored, GA = Goals Scored Agains, P = Points, R = Rank</i>
// ARG: {name: "ARG", games_played:0, games_won:0, games_lost: 0, games_draw:0, goals_scored, scored_against, goal_diff:0, points: 0, rank:0}


WC.prototype.show = function () {
	all = []

	for (i in this.standings) {
		all.push(this.standings[i]);
	}
	// console.log(all)
	all.sort(function(a, b){return a.rank-b.rank});
	$(".standings-table").empty();
	// $(".standings-table").append("<tr><th></th><th>MP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>P</th><th>R</th></tr>")
	$(".standings-table").append("<tr><th></th><th>Matches Played</th><th>Wins</th><th>Draws</th><th>Losses</th><th>Goals For</th><th>Goals Against</th><th>Points</th><th>Rank</th></tr>")

	for (i=0; i<all.length; i++) {
		team = all[i];
		// console.log(team);
		$(".standings-table").append("<tr><td>" + team.name +  "</td><td>" + team.games_played + "</td><td>" + team.games_won + "</td><td>" + team.games_draw + "</td><td>" + team.games_lost + "</td><td>" + team.goals_scored + "</td><td>" + team.scored_against + "</td><td>" + team.points + "</td><td>" + team.rank + "</td></tr>")
		
	};

};



var get_rank = function(country_list, scores) {
		rank_me = []

		while (country_list.length > 0) {
			if (country_list == 1 ) {
				rank_me.push(country_list[0]);
				return rank_me;
			} else {
				base = [country_list.shift()];
				rest = country_list;
				if (is_highest(base, rest, scores) === true ) {
					rank_me.push(base[0]);
				} else {
					country_list = rest.concat(base);
				};

			};
		};

		return rank_me;


}


var is_highest = function(base, rest, scores) {
	base_country = base[0];
	counter = 0;
	for (i=0; i<rest.length; i++) {
		if (maxx(base_country, rest[i], scores) === true) {
			counter = counter + 1;
		};
	};

	if (counter == rest.length ) {
		
		return true;
	} else {
		return false;
	};
}


var maxx = function(value1, value2, scores) {

	if (value1.points < value2.points) {

		return false;
	} else {
		if (value1.points > value2.points) {
			return true;
		};
	};

	if (value1.goal_diff < value2.goal_diff) {
		return false;

	} else {
		if (value1.goal_diff > value2.goal_diff) {
			console.log(value1.name)
			console.log(value1.goal_diff + '-' + value2.goal_diff)
			var message = "<b>" + value1.name + "</b>" +  " beats " + "<b> " + value2.name + " </b>" + " with goal difference tie-breaker."
			var new_message = "<div class='alert alert-warning'>" + message + "</div>" 
			$(".message").empty();
			$(".message").append(new_message);
			return true;
		}
	}

	if (value1.goals_scored < value2.goals_scored) {
		return false;
	} else {
		if (value1.goals_scored > value2.goals_scored) {
			var message = "<b>" + value1.name + "</b>" +  " beats " + "<b> " + value2.name + " </b>" + " with goals scored tie-breaker."
			var new_message = "<div class='alert alert-warning'>" + message + "</div>" 
			$(".message").empty();
			$(".message").append(new_message);
			return true;
		}
	}


	var message = "Tie between " + "<b>" + value1.name + " </b>" + "and " + "<b> " + value2.name + " </b>" + "is not accounted for. See rules below to figure out the tie-break."
	// console.log('happens now')
	var new_message = "<div class='alert alert-warning'>" + message + "</div>" 
	$(".message").empty();
	$(".message").append(new_message);
	return true;




};


