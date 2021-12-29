import osmnx as ox
import networkx as nx

def gdf_to_nx(gdf_network):
    # generate graph from GeoDataFrame of LineStrings
    net = nx.Graph()
    net.graph['crs'] = gdf_network.crs
    fields = list(gdf_network.columns)

    for _, row in gdf_network.iterrows():
        first = row.geometry.coords[0]
        last = row.geometry.coords[-1]

        data = [row[f] for f in fields]
        attributes = dict(zip(fields, data))
        net.add_edge(first, last, **attributes)

    return net

def add_traveltime_colors(G, center_node, mode):
    travel_speed = 0
    useRoadSpeed = False
    if mode == 'drive':
        useRoadSpeed = True
    elif mode == 'bike':
        travel_speed = 15
    elif mode == 'walk':
        travel_speed = 5
    else:
        return (None, 'Invalid mode. Try one of "bike", "drive", or "walk".')
    trip_times = [5, 10, 15, 20, 25] # minutes

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
    return (G, '')