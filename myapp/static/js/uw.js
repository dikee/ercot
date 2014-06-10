$( document ).ready(function() {
	get_values();
	
});	


$(".updatable").blur(function(){
    var field = $(this).attr('id');
    var value = $(this).val();
    var send_field = field + '@$' + value;
    $(this).append(send_field);
    check = check_edit_value(field, value);
    if (check[0] === false) {
    	var error_html = error_code(check[1]);
    	$("#error").empty().html(error_html);
    	// zero_values();
    	// get_values();
		
    }

    else {
    	change_values(check);
		// check is a list with [attribute, new_value]
    	
    }
  });


var check_edit_value = function(field, value) {

	if (field === 'projected_period_start' || field === 'projected_period_start') {
		

		date = value.split('-');
		year = date[1];
		month = date[0].toLowerCase();
		month = months[month];

		if (typeof(year/1) != "number" || month === undefined) {
			error = [];
			error.push(false);
			error.push('Not a valid format. Example: Mar-2012 or March-2012');
			return error;
		} else {
			resp = [];
			resp.push(field);
			resp.push(month_str[month] + "-" + year);
			console.log(resp);
			return resp;
		};

	} else {
		if (isNaN(value) != false || value <= 0) {
			var error = [false, "Not a Valid Non-Zero Number"];
			return error;

		} else {
			resp = [];
			resp.push(field);
			resp.push(value);
			return resp;
		};

	};


};



var get_values = function() {
	var uniqueid = $('#uniqueid').text();
	var url = '/uwcalc/' + uniqueid;
   
	$.get( url, function( data ) {
	// console.log('working...');
	// console.log(typeof(data));
	  if(data.result == 'success') {
	  	// console.log(data);
	  	update_values(data);
	  }

	});

}




var change_values = function(value_list) {
	var attribute = value_list[0];
	var new_value = value_list[1];
	json = {attribute: attribute, new_value: new_value};

	var uniqueid = $('#uniqueid').text();
	var url = '/changeassumptions/' + uniqueid;

	$.post(url, json)
		.done(function(data){

			console.log(data.result);
			if(data.result == 'success') {
			update_values(data);
				} else {
					var error_html = error_code(data.error_value);
    				$("#error").empty().html(error_html);

				}

		});

}


var update_values = function(data) {
	// experience period
	var experience_period_start = data.experience_periods.begin;
	var experience_period_end = data.experience_periods.end;

	// $( '#experience_period_start' ).attr('value', experience_period_start);
	$( '#experience_period_start' ).empty().append(experience_period_start);
	$( '#experience_period_end' ).empty().append(experience_period_end);

	// projection period
	var projected_period_start = data.projected_periods.begin;
	var projected_period_end = data.projected_periods.end;

	$( '#projected_period_start' ).attr('value', projected_period_start);
	$( '#projected_period_end' ).empty().append(projected_period_end);

	// months of lag
	var med_month_of_lag = data.month_of_lag.medical
	var rx_month_of_lag = data.month_of_lag.rx

	$( '#med_month_of_lag' ).attr('value', med_month_of_lag);
	$( '#rx_month_of_lag' ).attr('value', rx_month_of_lag);

	// average lagged enrollment
	var med_average_lag_enrollment = data.average_lag_enrollment.medical;
	var rx_average_lag_enrollment = data.average_lag_enrollment.rx;

	$( '#med_average_lag_enrollment' ).empty().append(med_average_lag_enrollment);
	$( '#rx_average_lag_enrollment' ).empty().append(rx_average_lag_enrollment);

	// PEPM Cost

	var med_est_future_avg_enroll = data.est_future_avg_enroll.medical;
	var rx_est_future_avg_enroll = data.est_future_avg_enroll.rx;
	var total_est_future_avg_enroll = data.est_future_avg_enroll.total;

	$('#med_est_future_avg_enroll').attr('value', med_est_future_avg_enroll);
	$('#rx_est_future_avg_enroll').attr('value', rx_est_future_avg_enroll);
	$('#total_est_future_avg_enroll').attr('value', total_est_future_avg_enroll);

	// expected trend
	var med_expected_trend = data.expected_trend.medical.toFixed(3);
	var rx_expected_trend = data.expected_trend.rx.toFixed(3);

	$('#med_expected_trend').attr('value', med_expected_trend)
	$('#rx_expected_trend').attr('value', rx_expected_trend)

	// final claims dollars
	var med_final_claims_dollars = data.final_claims_dollars.medical.toFixed(2);
	var rx_final_claims_dollars = data.final_claims_dollars.rx.toFixed(2);
	var total_final_claims_dollars = data.final_claims_dollars.total.toFixed(2);

	$( '#med_final_claims_dollars' ).empty().append(med_final_claims_dollars);
	$( '#rx_final_claims_dollars' ).empty().append(rx_final_claims_dollars);
	$( '#total_final_claims_dollars' ).empty().append(total_final_claims_dollars);

	// margin
	var med_margin = data.margin.medical.toFixed(2);
	var rx_margin = data.margin.rx.toFixed(2);

	$('#med_margin').attr('value', med_margin);
	$('#rx_margin').attr('value', rx_margin);

	// midpoint month
	var med_midpoint_month = data.midpoint_month.medical;
	var rx_midpoint_month = data.midpoint_month.rx;

	$( '#med_midpoint_month' ).empty().append(med_midpoint_month);
	$( '#rx_midpoint_month' ).empty().append(rx_midpoint_month);	

	// pepm cost
	var med_pepm_cost = data.pepm_cost.medical.toFixed(2);
	var rx_pepm_cost = data.pepm_cost.rx.toFixed(2);
	var total_pepm_cost = data.pepm_cost.total.toFixed(2);

	$( '#med_pepm_cost' ).empty().append(med_pepm_cost);
	$( '#rx_pepm_cost' ).empty().append(rx_pepm_cost);	
	$( '#total_pepm_cost' ).empty().append(total_pepm_cost);	

	// pepm after before cost
	var med_projected_pepm = data.projected_pepm.medical.toFixed(2);
	var rx_projected_pepm = data.projected_pepm.rx.toFixed(2);
	var total_projected_pepm = data.projected_pepm.total.toFixed(2);

	$( '#med_projected_pepm' ).empty().append(med_projected_pepm);
	$( '#rx_projected_pepm' ).empty().append(rx_projected_pepm);
	$( '#total_projected_pepm' ).empty().append(total_projected_pepm);

	// stop loss reim
	var med_stop_loss_reimbursement = data.pepm_stop_loss_reim.medical.toFixed(2);
	var rx_stop_loss_reimbursement = data.pepm_stop_loss_reim.rx.toFixed(2);
	var total_stop_loss_reimbursement = data.pepm_stop_loss_reim.total.toFixed(2);

	$( '#med_stop_loss_reimbursement' ).empty().append(med_stop_loss_reimbursement);
	$( '#rx_stop_loss_reimbursement' ).empty().append(rx_stop_loss_reimbursement);
	$( '#total_stop_loss_reimbursement' ).empty().append(total_stop_loss_reimbursement);
	
	// pepm net stop loss reim
	var med_net_stop_loss_reimbursement = data.net_stop_loss_reimbursement.medical.toFixed(2);
	var rx_net_stop_loss_reimbursement = data.net_stop_loss_reimbursement.rx.toFixed(2);
	var total_net_stop_loss_reimbursement = data.net_stop_loss_reimbursement.total.toFixed(2);

	$( '#med_net_stop_loss_reimbursement' ).empty().append(med_net_stop_loss_reimbursement);
	$( '#rx_net_stop_loss_reimbursement' ).empty().append(rx_net_stop_loss_reimbursement);
	$( '#total_net_stop_loss_reimbursement' ).empty().append(total_net_stop_loss_reimbursement);


	// pepm cost after margin
	var med_pepm_proj_after_margin = data.pepm_proj_after_margin.medical.toFixed(2);
	var rx_pepm_proj_after_margin = data.pepm_proj_after_margin.rx.toFixed(2);
	var total_pepm_proj_after_margin = data.pepm_proj_after_margin.total.toFixed(2);

	$( '#med_pepm_proj_after_margin' ).empty().append(med_pepm_proj_after_margin);
	$( '#rx_pepm_proj_after_margin' ).empty().append(rx_pepm_proj_after_margin);	
	$( '#total_pepm_proj_after_margin' ).empty().append(total_pepm_proj_after_margin);

	// utilized trend
	var med_utilized_trend = data.utilized_trend.medical.toFixed(3);
	var rx_utilized_trend = data.utilized_trend.rx.toFixed(3);

	$( '#med_utilized_trend' ).empty().append(med_utilized_trend);
	$( '#rx_utilized_trend' ).empty().append(rx_utilized_trend);	
}


var months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sept: 8,
    oct: 9,
    nov: 10,
    dec: 11
};

var month_str = {
	0: "January",
	1: "February",
	2: "March",
	3: "April",
	4: "May",
	5: "June",
	6: "july",
	7: "August",
	8: "September",
	9: "October",
	10: "November",
	11: "December"
};

var error_code = function (msg) {
	var first_line = "<div class='alert alert-warning alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
  	var second_line = "</div>";

  	return first_line + msg + second_line;


} 

var zero_values = function () {
	var inputs = $("input[type=text], textarea");
	console.log(inputs	)
	for (i=0; i < inputs.length; i++) {
		// console.log(inputs[1])
		// inputs[i].removeAttr("value");
	};

	return true;
}

var inputs = $("input[type=text], textarea");