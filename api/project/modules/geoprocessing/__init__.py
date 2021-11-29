from flask_restx import Namespace, Resource, fields
import osmnx as ox

ns = Namespace("Geoprocessing",
                description="Geoprocessing related operations")

@ns.route('/hello')
class Isochrone(Resource):
    def get():
        return {'hello': 'world'}
        # G = ox.create_graph(loc= "Stockholm, Sweden", 
        #          dist= 5000, 
        #          transport_mode= "walk", 
        #          )

        # # Create nodes geodataframe from Graph network (G)
        # gdf_nodes = ox.graph_to_gdfs(G, edges=False)

        # # Specify where you want to start and get nearest nodes. 
        # point_of_interest = ox.get_nearest_node(G, point=(59.325273, 18.070998))

        # # Project a graph from lat-long to the UTM zone appropriate for its geographic location.
        # G = ox.project_graph(G)