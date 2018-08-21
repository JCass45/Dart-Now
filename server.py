from flask import Flask, request, jsonify
import requests
import xml.etree.ElementTree as ET
from pprint import pprint

app = Flask(__name__, static_url_path='')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/times')
def times():
    station = request.args.get('station', '')
    r = requests.get(
        'http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML',
        {'StationDesc': station}
    )

    root = ET.fromstring(r.text)
    southbound = []
    northbound = []
    for child in root:
        trainData = {
            'Dest': child.find('{http://api.irishrail.ie/realtime/}Destination').text,
            'DueIn': child.find('{http://api.irishrail.ie/realtime/}Duein').text,
            'LateBy': child.find('{http://api.irishrail.ie/realtime/}Late').text
        }

        if child.find('{http://api.irishrail.ie/realtime/}Direction').text == 'Southbound':
            southbound.append(trainData)
        else:
            northbound.append(trainData)

    return jsonify(northbound=northbound, southbound=southbound)
