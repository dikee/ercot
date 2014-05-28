from myapp import db


class LoadEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entry_date = db.Column(db.Date, nullable=False)
    hour = db.Column(db.Integer, nullable=False)
    zone_id = db.Column(db.Integer, db.ForeignKey('zone.id'), nullable=False)
    load = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<LoadEntry-%r>' % self.date + ' ' + self.hour

    def day_of_week(self):
        days = {0:'Monday', 1:'Tuesday', 2:'Wednesday', 3:'Thursday',
                4:'Friday', 5:'Saturday', 6:'Sunday'}

        return days[self.entry_date.weekday()]


class Zone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    zone_name = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return '<Zone-%r>' % self.zone_name

# Tables for UW Claims


MED_TREND = 0.07
RX_TREND = 0.065

class UwExample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    proj_start_date = db.Column(db.Date, nullable=False)
    proj_end_date = db.Column(db.Date, nullable=False)
    example_name = db.Column(db.String(20))
    unique_iden = db.Column(db.String(12), nullable=False)
    proj_annual_enroll = db.Column(db.Integer, nullable=False)
    lag_med = db.Column(db.Integer, nullable=False)
    lag_rx = db.Column(db.Integer, nullable=False)
    med_trend = db.Column(db.Float, nullable=False)
    rx_trend = db.Column(db.Float, nullable=False)
    med_margin_perc = db.Column(db.Float, nullable=False)
    rx_margin_perc = db.Column(db.Float, nullable=False)
    uw_user_id = db.Column(db.Integer, db.ForeignKey('uw_user.id'))
    entries = db.relationship('Entry', backref='example', lazy='dynamic', order_by="desc(Entry.date)")
    fixed_costs = db.relationship('FixedCost', backref='example', lazy='dynamic')
    adjustments = db.relationship('Adjustment', backref='example', lazy='dynamic')


class UwUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(22), nullable=False)
    password = db.Column(db.String(), nullable=False)
    examples = db.relationship('UwExample', backref='user', lazy='dynamic')


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    ee_count = db.Column(db.Integer, nullable=False)
    med_cost = db.Column(db.Float, nullable=False)
    rx_cost = db.Column(db.Float, nullable=False)
    sl_reim = db.Column(db.Float, nullable=False)
    uw_example_id = db.Column(db.Integer, db.ForeignKey('uw_example.id'), nullable=False)

COST_TYPE = ['pepm', 'pepy', 'annual', 'perc_claims', 'perc_med_claims', 'perc_rx_claims']
APPLIES_TO = ['med', 'rx', 'both']

class FixedCost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    cost_type = db.Column(db.String(25), nullable=False)
    current_cost = db.Column(db.Float, nullable=False)
    upcoming_cost = db.Column(db.Float, nullable=False)
    applies_to = db.Column(db.String(20), nullable=False)
    uw_example_id = db.Column(db.Integer, db.ForeignKey('uw_example.id'), nullable=False)


class Adjustment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prior = db.Column(db.Boolean, nullable=True)
    percentage_amount = db.Column(db.Float, nullable=False) # between 0 and 1
    uw_example_id = db.Column(db.Integer, db.ForeignKey('uw_example.id'), nullable=False)
