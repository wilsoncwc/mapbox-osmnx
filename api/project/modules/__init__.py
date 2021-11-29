from flask_restx import Api
from geoprocessing import ns as geoprocessing_api

api = Api(title="Geoprocessing API",
          version="1.0")

def init_app(app, **kwargs):
    api.add_namespace(geoprocessing_api, path="/api/v1/geoprocessing")
    api.init_app(app)