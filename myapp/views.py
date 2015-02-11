from myapp import app
from flask import render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from models import Entry
from l_helpers import allowed_file, UW_UPLOAD_FOLDER, generate_file_name, parse_csv, get_month_number
import os
from q_uw import get_uw_example_by_unique
import math
from datetime import date, timedelta
import json
from myapp import db


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/underwrite/<uw_unique>')
def underwrite(uw_unique):
    claims = get_uw_example_by_unique(uw_unique)
    return render_template('uw.html', claims=claims)


@app.route('/ramona-dike')
def wedding():
    return '<html>Website coming soon<br>Wedding on June 6th</html>'


@app.route('/changeassumptions/<uw_unique>', methods=['POST'])
def change_assumptions(uw_unique):
    claims = get_uw_example_by_unique(uw_unique)
    attribute = request.form['attribute']
    new_value = request.form['new_value']

    if attribute == 'projected_period_start':
        # import pdb; pdb.set_trace()
        try:
            new_value = new_value.split('-')
            month = new_value[0]
            year = new_value[1]
            proj_start_date = date(int(year), get_month_number(month), 1)
            proxy_date = proj_start_date + timedelta(370)
            if proxy_date.month == 1:
                proj_end_date = date(proxy_date.year - 1, 12, 1)
            else:
                proj_end_date = date(proxy_date.year, proxy_date.month - 1, 1)

            if proj_start_date <= claims.entries[0].date:
                return jsonify({"error_value": "Date must be after experience period"})

            claims.proj_start_date = proj_start_date
            claims.proj_end_date = proj_end_date
            db.session.commit()
        except:
            return jsonify({"error_value": "Date is Not Valid"})

    if attribute == 'med_month_of_lag':
        if int(new_value) < 4:
            claims.lag_med = int(new_value)
            db.session.commit()
        else:
            return jsonify({"error_value": "Lag must be less than 4"})

    if attribute == 'rx_month_of_lag':
        if int(new_value) < 4:
            claims.lag_rx = int(new_value)
            db.session.commit()
        else:
            return jsonify({"error_value": "Lag must be less than 4"})

    if attribute == 'med_expected_trend':
        if float(new_value) >= 0 and float(new_value) <= 1:
            claims.med_trend = float(new_value)
            db.session.commit()
        else:
            return jsonify({"error_value": "Trend must be between 0 and 1"})

    if attribute == 'rx_expected_trend':
        if float(new_value) >= 0 and float(new_value) <= 1:
            claims.rx_trend = float(new_value)
            db.session.commit()
        else:
            return jsonify({"error_value": "Trend must be between 0 and 1"})

    if attribute == 'med_margin':
        if float(new_value) < 4:
            claims.med_margin_perc = float(new_value)
            db.session.commit()
        else:
            return jsonify({"error_value": "Margin must be less than 4"})

    if attribute == 'rx_margin':
        if float(new_value) < 4:
            claims.rx_margin_perc = float(new_value)
            db.session.commit()
        else:
            return jsonify({"error_value": "Margin must be less than 4"})

    if attribute == 'med_est_future_avg_enroll' or attribute == 'rx_est_future_avg_enroll':
        if int(new_value) > 0:
            claims.proj_annual_enroll = int(new_value)
            db.session.commit()
        else:
            return jsonify({"error_value": "Future enrollment must be a non-zero number"})

    return redirect(url_for('uw_calc', uw_unique=uw_unique))


    # med_est_future_avg_enroll uw.js:9
    # rx_est_future_avg_enroll 
    # return redirect(url_for('uw_calc', uw_unique=uw_unique))


@app.route('/uwapp', methods=['GET', 'POST'])
def underwriting_app():
    if request.method == 'POST':
        thefile = request.files['file']
        message = ''
        # import pdb; pdb.set_trace()
        if thefile and allowed_file(thefile.filename):
            parse_result = parse_csv(thefile)
            if parse_result is False:
                message = "CSV format is not correct."
                return render_template('uwapp.html', message=message)

            return redirect(url_for('underwrite', uw_uniqe=parse_result))

        message = "File or file format not allowed."
        return render_template('uwapp.html', message=message)

    return render_template('uwapp.html')

# Writings

@app.route('/writing/<slug>')
def writing(slug):
    file_name = slug + '.html'
    return render_template(file_name)


# writings end


@app.route('/uwcalc/<uw_unique>')
def uw_calc(uw_unique):
    claims = get_uw_example_by_unique(uw_unique)
    if claims.entries.count() < 12:
        return jsonify({"status": "error"})
    response = {}

    month_of_lag = {"medical": claims.lag_med, "rx": claims.lag_rx}
    average_lag_enrollment = {"medical": get_average_lag_enrollment(claims.lag_med, claims.entries),
                              "rx": get_average_lag_enrollment(claims.lag_rx, claims.entries)}

    claims_cost = get_total_claims_cost(claims.entries)
    pepm_cost = {"medical": claims_cost[0]/average_lag_enrollment['medical'],
                 "rx": claims_cost[1]/average_lag_enrollment['rx']}
    pepm_cost['total'] = (claims_cost[0] + claims_cost[1]) / average_lag_enrollment['medical']
    pepm_stop_loss_reim = {"medical": claims_cost[2]/average_lag_enrollment['medical'],
                           "rx": 0}
    pepm_stop_loss_reim['total'] = pepm_stop_loss_reim['medical']
    net_stop_loss_reimbursement = {"medical": pepm_cost['medical'] - pepm_stop_loss_reim['medical'],
                                   "rx": pepm_cost['rx'] - pepm_stop_loss_reim['rx']}

    net_stop_loss_reimbursement['total'] = net_stop_loss_reimbursement['medical'] + net_stop_loss_reimbursement['rx']
    expected_trend = {"medical": claims.med_trend, "rx": claims.rx_trend}
    experience_start_end_month = get_start_experience_month(claims.entries)
    a_midpoint_month = get_midpoint_months(experience_start_end_month[0], claims.proj_start_date)
    midpoint_month = {"medical": a_midpoint_month, "rx": a_midpoint_month}
    utilized_trend = {"medical": get_utilized_trend(expected_trend['medical'], a_midpoint_month),
                      "rx": get_utilized_trend(expected_trend['rx'], a_midpoint_month)}
    projected_pepm = {"medical": get_projected_claims(net_stop_loss_reimbursement['medical'], utilized_trend['medical']),
                      "rx": get_projected_claims(net_stop_loss_reimbursement['rx'], utilized_trend['rx'])}
    projected_pepm['total'] = projected_pepm['medical'] + projected_pepm['rx']
    est_future_avg_enroll = {"medical": claims.proj_annual_enroll, "rx": claims.proj_annual_enroll}
    pepm_proj_after_margin = {"medical": projected_pepm['medical'] * claims.med_margin_perc, "rx": projected_pepm['rx'] * claims.rx_margin_perc}
    pepm_proj_after_margin['total'] = pepm_proj_after_margin['medical'] + pepm_proj_after_margin['rx']
    final_claims_dollars = {"medical": pepm_proj_after_margin['medical'] * est_future_avg_enroll['medical'],
                            "rx":  pepm_proj_after_margin['rx'] * est_future_avg_enroll['rx']}
    final_claims_dollars['total'] = final_claims_dollars['medical'] + final_claims_dollars['rx']
    margin = {"medical": claims.med_margin_perc, "rx": claims.rx_margin_perc}
    projected_periods = {"begin": claims.proj_start_date, "end": claims.proj_end_date}
    experience_periods = {"begin": experience_start_end_month[0], "end": experience_start_end_month[1]}


    response['month_of_lag'] = month_of_lag
    response['average_lag_enrollment'] = average_lag_enrollment
    response['pepm_cost'] = pepm_cost
    response['expected_trend'] = expected_trend
    response['midpoint_month'] = midpoint_month
    response['utilized_trend'] = utilized_trend
    response['projected_pepm'] = projected_pepm
    response['margin'] = margin
    response['pepm_proj_after_margin'] = pepm_proj_after_margin
    response['final_claims_dollars'] = final_claims_dollars
    response['projected_periods'] = projected_periods
    response['experience_periods'] = experience_periods
    response['est_future_avg_enroll'] = est_future_avg_enroll
    response['pepm_stop_loss_reim'] = pepm_stop_loss_reim
    response['net_stop_loss_reimbursement'] = net_stop_loss_reimbursement

    for k, v in response.items():
        if type(response[k]) is date:
            response[k] = v.strftime("%b-%Y")

        if type(response[k]) is dict:
            for kk, vv in response[k].items():
                if type(response[k][kk]) is date:
                    response[k][kk] = vv.strftime("%b-%Y")

                # if type(k[v]) is dict:
                #     for k, v in k[v].items():
                #         if type(k[v]) is date:
                #             k[v] = v.strftime("%b-%Y")
    response['result'] = 'success'
    # return json.dumps(response)
    return jsonify(response)


def get_start_experience_month(entries):
    # assumes entries is sorted by month - descending
    count = 0
    for entry in entries:
        # import pdb; pdb.set_trace()
        count +=1
        if count == 1:
            end = entry.date
        if count == 12:
            start = entry.date
            return start, end


def get_average_lag_enrollment(lag, entries):
    thelist = []
    count = 0
    while count < 15:
        for entry in entries:
            thelist.append(entry.ee_count)
            count += 1
    return sum(thelist[lag:lag + 12]) / 12


def get_total_claims_cost(entries):
    med_list = []
    rx_list = []
    sl_list = []
    for entry in entries:
        med_list.append(entry.med_cost)
        rx_list.append(entry.rx_cost)
        sl_list.append(entry.sl_reim)
    return [sum(med_list[0:12]), sum(rx_list[0:12]), sum(sl_list[0:12])]


def get_utilized_trend(trend, midpoint_months):
    result = 1.00 * math.pow(1 + trend, midpoint_months / 12.0)
    return result


def get_midpoint_months(start_date1, start_date2):
    # import pdb; pdb.set_trace()
    midpoint_date1 = get_midpoint(start_date1)
    midpoint_date2 = get_midpoint(start_date2)

    months = 0
    start = midpoint_date1
    while midpoint_date2 != start:
        months += 1
        if start.month == 12:
            start = date(start.year + 1, 1, 1)
        else:
            start = date(start.year, start.month + 1, 1)
    return months



def get_midpoint(start_date):
    day = 1
    mid_month_1 = start_date.month + 6
    mid_year_1 = start_date.year
    if mid_month_1 > 12:
        mid_month_1 = mid_month_1 - 12
        mid_year_1 = start_date.year + 1
    proj_mid = date(mid_year_1, mid_month_1, day)
    return proj_mid


def get_projected_claims(trend, claims):
    # return projected pepm claims
    return trend * claims
