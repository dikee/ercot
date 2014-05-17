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
