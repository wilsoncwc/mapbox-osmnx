"""
Factory for main flask application
"""
import os

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

def create_app(flask_config_name=None, **kwargs):
    """
    Entry point to the Flask RESTful Server application.
    """
    env_flask_config_name = os.getenv('APP_SETTINGS')

    app = Flask(__name__, **kwargs)
    app.wsgi_app = ProxyFix(app.wsgi_app)

    app.config.from_object(env_flask_config_name)

    from . import modules
    modules.init_app(app)

    return app