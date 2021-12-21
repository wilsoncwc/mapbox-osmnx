from flask import jsonify
from flask_restx import Namespace, Resource, abort
import osmnx as ox
import networkx as nx
import json

ns = Namespace('Geoprocessing',
                description='Geoprocessing related operations')

@ns.route('/isochrone/<mode>/<float(signed=True):srcLng>,<float(signed=True):srcLat>')
@ns.param('mode', 'One of "bike", "drive", or "walk"')
@ns.param('srcLng', 'Longitude of the coordinate to center the isochrone')
@ns.param('srcLat', 'Latitude of the coordinate to center the isochrone')
class Isochrone(Resource):
    def get(self, mode, srcLng, srcLat):
        center_point = (srcLat, srcLng) # osmnx expects (lng,lat)
        network_type = mode
        travel_speed = 0
        useRoadSpeed = False
        if network_type == 'drive':
            useRoadSpeed = True
        elif network_type == 'bike':
            travel_speed = 15
        elif network_type == 'walk':
            travel_speed = 5
        else:
            abort(400)
        trip_times = [5, 10, 15, 20, 25] # minutes

        G = None
        # download the street network
        try:
            G = ox.graph_from_point(center_point, network_type=network_type)
        except:
            abort(400, 'Error retrieving network graph using given parameters')

        # find the centermost node and then project the graph to UTM
        gdf_nodes = ox.graph_to_gdfs(G, edges=False)
        x, y = gdf_nodes['geometry'].unary_union.centroid.xy
        center_node = ox.get_nearest_node(G, (y[0], x[0]))
        G = ox.project_graph(G)

        # add an edge attribute for travel time in minutes required to traverse each edge
        if useRoadSpeed:
            G = ox.add_edge_speeds(G)
        else:
            # set constant travel speed for all edges
            nx.set_edge_attributes(G, travel_speed, 'speed_kph')
        G = ox.add_edge_travel_times(G) # computes travel time in seconds
        travel_times = nx.get_edge_attributes(G, "travel_time")
        for u, v, k, data in G.edges(data=True, keys=True):
            data['time'] = travel_times[(u, v, k)] / 60 # convert to min

        # get one color for each isochrone
        iso_colors = ox.plot.get_colors(n=len(trip_times), cmap='plasma', start=0, return_hex=True)

        # color the edges based on subgraph
        edge_colors = {}
        for trip_time, color in zip(sorted(trip_times, reverse=True), iso_colors):
            subgraph = nx.ego_graph(G, center_node, radius=trip_time, distance='time')
            for edge in subgraph.edges:
                edge_colors[edge] = color
        nx.set_edge_attributes(G, edge_colors, 'color')

        # project graph back to the standard crs
        G = ox.project_graph(G, 'WGS84')
        # extract graph edges as GeoJSON and return
        gdf_edges = ox.graph_to_gdfs(G, nodes=False)
        gdf_edges = ox.io._stringify_nonnumeric_cols(gdf_edges)
        geojson_str = gdf_edges.to_json()
        return jsonify(json.loads(geojson_str))

    def post(self):
        pass