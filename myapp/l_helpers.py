import string
from random import randint

import pandas as pd 
import numpy as np
from datetime import date

from myapp import db
from models import UwExample, Entry, MED_TREND, RX_TREND

UW_UPLOAD_FOLDER = 'ercot/myapp/static/uw'
UW_UPLOAD_FOLDER_EXT = set(['csv'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in UW_UPLOAD_FOLDER_EXT


def generate_file_name():
    possible = string.digits + string.ascii_lowercase
    count = 0
    file_name = ''
    while count < 5:
        file_name = file_name + possible[randint(0, len(possible)-1)]
        count += 1
    return file_name

def parse_csv(thefile):
    claims = pd.read_csv(thefile)
    claims = claims.rename(columns={claims.columns.values[0]:"date",
                                   claims.columns.values[1]:"ee_count",
                                   claims.columns.values[2]:"med_cost",
                                   claims.columns.values[3]:"rx_cost",
                                   claims.columns.values[4]:"sl_reim"})
    claims = claims.fillna(0)
    for index in range(0, len(claims)):
        new_date = return_date(claims.date[index])
        if new_date is False:
            return "%s date could not be parsed" % claims.date[index]
        else:
            claims.date[index] = new_date

    for index in range(0, len(claims)):
        ee_count = parse_ee_count(claims.ee_count[index])
        if ee_count is False:
            return "%s date could not be parsed" % claims.ee_count[index]
        else:
            claims.ee_count[index] = ee_count

    for index in range(0, len(claims)):
        med_cost = parse_currency(claims.med_cost[index])
        if med_cost is False:
            return "%s medical claims amount could not be parsed" % claims.med_cost[index]
        else:
            claims.med_cost[index] = med_cost

    for index in range(0, len(claims)):
        rx_cost = parse_currency(claims.rx_cost[index])
        if rx_cost is False:
            return "%s rx claims amount could not be parsed" % claims.rx_cost[index]
        else:
            claims.rx_cost[index] = rx_cost

    for index in range(0, len(claims)):
        sl_reim = parse_currency(claims.sl_reim[index])
        if sl_reim is False:
            return "%s stop loss amount could not be parsed" % claims.sl_reim[index]
        else:
            claims.sl_reim[index] = sl_reim
    # import pdb; pdb.set_trace()
    response = load_claims(claims)
    return response


def load_claims(claims):
    example = UwExample()
    example.proj_start_date = date(claims.date.max().year + 1, 1, 1)
    example.proj_end_date = date(example.proj_start_date.year, 12, 31)
    example.unique_iden = generate_file_name()
    example.example_name = example.unique_iden
    example.proj_annual_enroll = int(claims.sort_index(by=['date'], ascending=[False])[:1].ee_count.min())
    example.med_trend = MED_TREND
    example.rx_trend = RX_TREND
    example.med_margin_perc = 1
    example.rx_margin_perc = 1
    example.lag_med = 2
    example.lag_rx = 1
    db.session.add(example)
    db.session.commit()
    
    for index, row in claims.iterrows():
        entry = Entry()
        entry.date = row.date
        entry.ee_count = int(row.ee_count)
        entry.med_cost = float(row.med_cost)
        entry.rx_cost = float(row.rx_cost)
        entry.sl_reim = float(row.sl_reim)
        entry.uw_example_id = example.id
        db.session.add(entry)
    db.session.commit()
    return example.unique_iden


def return_date(adate):
    if '-' in adate:
        return parse_date(adate, '-')

    if '/' in adate:
        return parse_date(adate, '/')

    return False


def parse_date(adate, symbol):
    adate = adate.split(symbol)
    adate[2] = "20" + adate[2][-2:]
    try:
        year, month, day = int(adate[2]), int(adate[0]), 1
        return date(year, month, day)
    except:
        return False


def parse_ee_count(ee_count):
    try:
        return(int(ee_count))
    except:
        return False


def parse_currency(currency):
    try:
        amount = currency.replace('$', '')
        amount = amount.replace(',', '')
        return abs(float(amount))
    except:
        try:
            return abs(float(currency))
        except:
            return False


def get_month_number(month):
    months = {'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6,
              'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12}

    return months[month.lower()]