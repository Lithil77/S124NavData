import axios from 'axios';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { transformExtent } from 'ol/proj';
import { toast } from 'react-toastify';
import { nodeServerUrl } from '../appConfig';

export const getLayerExtent = async (geoserverUrl, title, olMap) => {
    try {
        const endIndex = geoserverUrl.indexOf('/geoserver') + '/geoserver'.length;
        const updatedUrl = geoserverUrl.slice(0, endIndex);

        const url = `${updatedUrl}/ows?service=WMS&version=1.3.0&request=GetCapabilities`;
        const queryParams = { param: url };

        const response = await axios.get(`${nodeServerUrl}/getLayerExtent`, { params: queryParams });

        const parser = new WMSCapabilities();
        const result = parser.read(response.data);

        if (result && result.Capability && result.Capability.Layer) {
            const layers = result.Capability.Layer.Layer;
            const desiredLayerName = title;

            const selectedLayer = layers.find(layer => layer.Name === desiredLayerName);

            console.log(selectedLayer);

            if (selectedLayer) {
                var extent = selectedLayer.EX_GeographicBoundingBox || selectedLayer.BoundingBox[0].extent;
                var layerExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
                olMap.getView().fit(layerExtent, { padding: [10, 10, 10, 0] });
            }
        } else {
            toast.warn('Error parsing GetCapabilities response');
        }
    } catch (error) {
        toast.warn('Error parsing GetCapabilities response');
    }
};

