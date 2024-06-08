import React, { useEffect, useState, createContext } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import { defaults as defaultInteractions, Pointer as PointerInteraction } from 'ol/interaction';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import ImageWMS from "ol/source/ImageWMS.js";
import ImageLayer from "ol/layer/Image.js";
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Image as ImageSource } from 'ol/source';
import Draw from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON.js';
import { useColor } from './ColorContext';

var parser = new GeoJSON();

export const OLMapContext = createContext(undefined);

export const OLMapProvider = ({ children }) => {

    const { fillColor, strokeColor } = useColor();

    const [olMap, setOlMap] = useState(null);

    const [mapHeight, setMapHeight] = useState();

    const [hamburgerMenuOpen, setHumburgerMenuOpen] = useState(false);

    const [previousExtend, setPreviousExtend] = useState([]);
    const [nextExtend, setNextExtend] = useState([]);

    const [islayerAdded, setLayerAdded] = useState(false);

    const updateIsLayerAdded = (value) => {
        setLayerAdded(value);
    }

    useEffect(() => {
        const olMap = new Map({
            controls: [],
            interactions: defaultInteractions({ doubleClickZoom: false }).extend([
                new PointerInteraction({
                    handleDoubleClickEvent: (event) => {
                        event.preventDefault();
                    },
                }),
            ]),
        });
        setOlMap(olMap);
    }, []);

    const updatePreviousExtend = () => {
        if (olMap) {
            const extent = olMap.getView().calculateExtent(olMap.getSize());
            setPreviousExtend((prevExtent) => [
                ...prevExtent,
                extent,
            ]);
        }
    }

    const updateNextExtend = () => {
        if (olMap) {
            const extent = olMap.getView().calculateExtent(olMap.getSize())
            setNextExtend((prevExtent) => [
                ...prevExtent,
                extent,
            ]);
        }
    }

    const toggleHumburgerMenu = (value) => {
        setHumburgerMenuOpen(value)
    }

    const updateMapHeight = (value) => {
        setMapHeight(value);
    }

    const stopDrawAction = () => {
        if (olMap) {
            const interactions = olMap.getInteractions();
            interactions.forEach(interaction => {
                if (interaction instanceof Draw) {
                    if (interaction.getActive()) {
                        interaction.finishDrawing();
                        interaction.setActive(false);
                        olMap.removeInteraction(interaction);
                    }
                }
            });
        }
    };

    const clearVectorSource = () => {

        if (olMap) {
            var layers = olMap.getLayers().getArray();

            for (let index = 0; index < 2; index++) {
                layers.map((lyr) => {
                    if (lyr instanceof VectorLayer && lyr.getSource() instanceof VectorSource) {
                        if (lyr.get('title') == 'Highlight-selected-Features') {
                            lyr.getSource().clear();
                            olMap.removeLayer(lyr);
                            olMap.render();
                        } else {
                            lyr.getSource().clear();
                            olMap.removeLayer(lyr);
                            olMap.render();
                        }
                    }
                })
            }
        }
    }

    const clearImageSource = (olMap) => {

        if (olMap) {
            var layers = olMap.getLayers().getArray();
            layers.map((lyr) => {
                if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageSource) {
                    olMap.removeLayer(lyr);
                    olMap.render();
                }
            })
        }
    }

    const renderHighlightedFeatures = (data) => {
        const vectorLayer = createStylingVectorLayerWithStyles();
        if (data) {
            const features = parser.readFeatures(data);
            vectorLayer.getSource().addFeatures(features);
        }
        return vectorLayer;
    };


    const hexToRgba = (hex, alpha) => {
        const hexColor = hex.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const featureInformationStyles = new Style({
        fill: new Fill({
            color: hexToRgba(fillColor, 0.5),
        }),
        stroke: new Stroke({
            color: hexToRgba(strokeColor, 0.7),
            width: 3,
        }),
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: hexToRgba(strokeColor, 0.7),
            }),
            fill: new Fill({
                color: hexToRgba(fillColor, 0.5),
            }),
        }),
    });

    const createStylingVectorLayerWithStyles = () => {
        const vectorLayer = new VectorLayer({
            source: new VectorSource(),
            title: "Highlight-selected-Features",
            style: featureInformationStyles,
        });
        return vectorLayer;
    };

    const ConfigWMSLayerToMap = (olMap, wmsUrl, workspace, layerName) => {
        const wmsSource = new ImageWMS({
            url: wmsUrl,
            params: {
                LAYERS: `${workspace}:${layerName}`,
                TILED: false,
            },
            serverType: "geoserver",
        });

        const wmsLayer = new ImageLayer({
            title: layerName,
            visible: true,
            source: wmsSource,
        });

        olMap.addLayer(wmsLayer);
    };

    const hightLightSelectedFeature = (olMap, _data) => {

        if (_data && olMap) {
            const vectorLayer = new VectorLayer({
                title: 'Highlight-Vector-Layer',
                source: new VectorSource(),
                style: featureInformationStyles,
            });
            var features = parser.readFeatures(_data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            vectorLayer.getSource().addFeatures(features);
            var extent = vectorLayer.getSource().getExtent();
            olMap.getView().fit(extent, {
                padding: [250, 250, 350, 250], minResolution: 10,
                duration: 1000
            });
            olMap.addLayer(vectorLayer);
        }
    }

    const getAllVisibleLayers = () => {
        if (olMap) {
            const allLayers = olMap.getLayers().getArray();
            const visibleLayerTitles = [];
            for (let i = 0; i < allLayers.length; i++) {
                const layer = allLayers[i];
                if (layer instanceof ImageLayer && layer.getSource() instanceof ImageWMS) {
                    if (layer.getVisible() === true) {
                        visibleLayerTitles.push(layer.get('title'));
                    }
                }
            }
            return visibleLayerTitles;
        }
    };

    const getTargetLayer = (selectedLayer) => {
        const layersList = olMap.getLayers().getArray();
        const targetLayer = layersList.find((lyr) =>
            lyr instanceof ImageLayer &&
            lyr.getSource() instanceof ImageWMS &&
            selectedLayer === lyr.get('title') &&
            lyr.getVisible()
        );
        return targetLayer;
    }

    return (
        <>
            <OLMapContext.Provider value={{
                olMap, updateMapHeight, mapHeight,
                hamburgerMenuOpen, toggleHumburgerMenu,
                updatePreviousExtend, updateNextExtend, previousExtend, nextExtend,
                hightLightSelectedFeature, clearImageSource, clearVectorSource,
                renderHighlightedFeatures, stopDrawAction, ConfigWMSLayerToMap,
                updateIsLayerAdded, islayerAdded, getAllVisibleLayers, getTargetLayer,
            }}>
                {children}
            </OLMapContext.Provider>
        </>
    )
};

