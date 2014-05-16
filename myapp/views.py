from myapp import app


@app.route('/')
def index():
    return 'it works'

