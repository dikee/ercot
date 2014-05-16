from myapp import app
from werkzeug.contrib.fixers import ProxyFix


app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.run(debug=True, port=8000)

