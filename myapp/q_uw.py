from models import UwExample

def get_uw_example_by_unique(uw_unique):
    return UwExample.query.filter_by(unique_iden=uw_unique).first()
