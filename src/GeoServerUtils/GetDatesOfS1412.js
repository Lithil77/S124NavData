import axios from "axios";
import { toast } from 'react-toastify';
import { nodeServerUrl } from "../appConfig";

export const getDatesOFS1412 = async (olMap, geoServerUrl, lyrName, attributeValue) => {
    var data = [];

    if (!olMap) {
        return;
    }

    const baseUrl = `${geoServerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${lyrName}&outputFormat=application/json`;

    const queryParams = { param: baseUrl };

    try {
        const res = await axios.get(`${nodeServerUrl}/getProducerCodes`, { params: queryParams });
        const features = res.data.features;
        if (features) {
            features.forEach((feature) => {
                const _attributeValue = feature.properties[attributeValue];
                if (_attributeValue !== undefined && !data.includes(_attributeValue) && _attributeValue !== null) {
                    feature.properties.layername = lyrName;
                    if (attributeValue === 'time') {
                        const dateString = _attributeValue;
                        const dateObject = new Date(dateString);
                        if (!data.some((date) => date.getTime() === dateObject.getTime())) {
                            data.push(dateObject);
                        }
                    } else {
                        data.push(_attributeValue);
                    }
                }
            });
        }
    } catch (error) {
        toast.warn('Error fetching data from GeoServer');
    }
    return data;
};