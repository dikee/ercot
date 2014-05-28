$( document ).ready(function() {
	get_values()
	


});	




var get_values = function() {
	var uniqueid = $('#uniqueid').text();
	var url = '/uwcalc/' + uniqueid;
   
	$.get( url, function( data ) {
	console.log('working...');
	console.log(typeof(data));
	  if(data.result == 'success') {
	  	console.log(data);
	  	update_values(data);
	  }

	});

}


var update_values = function(data) {

	// experience period
	var experience_period_start = data.experience_periods.begin;
	var experience_period_end = data.experience_periods.end;

	$( '#experience_period_start' ).attr('placeholder', experience_period_start);
	$( '#experience_period_end' ).append(experience_period_end);

	// projection period
	var projected_period_start = data.projected_periods.begin;
	var projected_period_end = data.projected_periods.end;

	$( '#projected_period_start' ).attr('placeholder', projected_period_start);
	$( '#projected_period_end' ).append(projected_period_end);

	// months of lag
	var med_month_of_lag = data.month_of_lag.medical
	var rx_month_of_lag = data.month_of_lag.rx

	$( '#med_month_of_lag' ).attr('placeholder', med_month_of_lag);
	$( '#rx_month_of_lag' ).attr('placeholder', rx_month_of_lag);

	// average lagged enrollment
	var med_average_lag_enrollment = data.average_lag_enrollment.medical;
	var rx_average_lag_enrollment = data.average_lag_enrollment.rx;

	$( '#med_average_lag_enrollment' ).append(med_average_lag_enrollment);
	$( '#rx_average_lag_enrollment' ).append(rx_average_lag_enrollment);

	// PEPM Cost

	var med_est_future_avg_enroll = data.est_future_avg_enroll.medical;
	var rx_est_future_avg_enroll = data.est_future_avg_enroll.rx;
	var total_est_future_avg_enroll = data.est_future_avg_enroll.total;

	$('#med_est_future_avg_enroll').attr('placeholder', med_est_future_avg_enroll);
	$('#rx_est_future_avg_enroll').attr('placeholder', rx_est_future_avg_enroll);
	$('#total_est_future_avg_enroll').attr('placeholder', total_est_future_avg_enroll);

	// expected trend
	var med_expected_trend = data.expected_trend.medical.toFixed(3);
	var rx_expected_trend = data.expected_trend.rx.toFixed(3);

	$('#med_expected_trend').attr('placeholder', med_expected_trend)
	$('#rx_expected_trend').attr('placeholder', rx_expected_trend)

	// final claims dollars
	var med_final_claims_dollars = data.final_claims_dollars.medical.toFixed(2);
	var rx_final_claims_dollars = data.final_claims_dollars.rx.toFixed(2);
	var total_final_claims_dollars = data.final_claims_dollars.total.toFixed(2);

	$( '#med_final_claims_dollars' ).append(med_final_claims_dollars);
	$( '#rx_final_claims_dollars' ).append(rx_final_claims_dollars);
	$( '#total_final_claims_dollars' ).append(total_final_claims_dollars);

	// margin
	var med_margin = data.margin.medical.toFixed(2);
	var rx_margin = data.margin.rx.toFixed(2);

	$('#med_margin').attr('placeholder', med_margin);
	$('#rx_margin').attr('placeholder', rx_margin);

	// midpoint month
	var med_midpoint_month = data.midpoint_month.medical;
	var rx_midpoint_month = data.midpoint_month.rx;

	$( '#med_midpoint_month' ).append(med_midpoint_month);
	$( '#rx_midpoint_month' ).append(rx_midpoint_month);	

	// pepm cost
	var med_pepm_cost = data.pepm_cost.medical.toFixed(2);
	var rx_pepm_cost = data.pepm_cost.rx.toFixed(2);
	var total_pepm_cost = data.pepm_cost.total.toFixed(2);

	$( '#med_pepm_cost' ).append(med_pepm_cost);
	$( '#rx_pepm_cost' ).append(rx_pepm_cost);	
	$( '#total_pepm_cost' ).append(total_pepm_cost);	

	// pepm after before cost
	var med_projected_pepm = data.projected_pepm.medical.toFixed(2);
	var rx_projected_pepm = data.projected_pepm.rx.toFixed(2);
	var total_projected_pepm = data.projected_pepm.total.toFixed(2);

	$( '#med_projected_pepm' ).append(med_projected_pepm);
	$( '#rx_projected_pepm' ).append(rx_projected_pepm);
	$( '#total_projected_pepm' ).append(total_projected_pepm);

	// stop loss reim
	var med_stop_loss_reimbursement = data.pepm_stop_loss_reim.medical.toFixed(2);
	var rx_stop_loss_reimbursement = data.pepm_stop_loss_reim.rx.toFixed(2);
	var total_stop_loss_reimbursement = data.pepm_stop_loss_reim.total.toFixed(2);

	$( '#med_stop_loss_reimbursement' ).append(med_stop_loss_reimbursement);
	$( '#rx_stop_loss_reimbursement' ).append(rx_stop_loss_reimbursement);
	$( '#total_stop_loss_reimbursement' ).append(total_stop_loss_reimbursement);
	
	// pepm net stop loss reim
	var med_net_stop_loss_reimbursement = data.net_stop_loss_reimbursement.medical.toFixed(2);
	var rx_net_stop_loss_reimbursement = data.net_stop_loss_reimbursement.rx.toFixed(2);
	var total_net_stop_loss_reimbursement = data.net_stop_loss_reimbursement.total.toFixed(2);

	$( '#med_net_stop_loss_reimbursement' ).append(med_net_stop_loss_reimbursement);
	$( '#rx_net_stop_loss_reimbursement' ).append(rx_net_stop_loss_reimbursement);
	$( '#total_net_stop_loss_reimbursement' ).append(total_net_stop_loss_reimbursement);


	// pepm cost after margin
	var med_pepm_proj_after_margin = data.pepm_proj_after_margin.medical.toFixed(2);
	var rx_pepm_proj_after_margin = data.pepm_proj_after_margin.rx.toFixed(2);
	var total_pepm_proj_after_margin = data.pepm_proj_after_margin.total.toFixed(2);

	$( '#med_pepm_proj_after_margin' ).append(med_pepm_proj_after_margin);
	$( '#rx_pepm_proj_after_margin' ).append(rx_pepm_proj_after_margin);	
	$( '#total_pepm_proj_after_margin' ).append(total_pepm_proj_after_margin);

	// utilized trend
	var med_utilized_trend = data.utilized_trend.medical.toFixed(3);
	var rx_utilized_trend = data.utilized_trend.rx.toFixed(3);

	$( '#med_utilized_trend' ).append(med_utilized_trend);
	$( '#rx_utilized_trend' ).append(rx_utilized_trend);	
}