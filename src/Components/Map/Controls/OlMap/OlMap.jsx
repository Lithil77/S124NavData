import React, { useRef, useEffect, useContext, useState } from 'react';
import 'ol/ol.css';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { OLMapContext } from '../../../../Contexts/OlMapContext.jsx';
import HumburgerMenu from '../../../utils/HumburgerMenu.jsx';
import './OlMap.css';
import { nodeServerUrl } from '../../../../appConfig.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useUtility } from '../../../../Contexts/UtilityContext.jsx';
import { useParams } from "react-router-dom";
import { useColor } from '../../../../Contexts/ColorContext.jsx';
import { mapLayers } from '../../../../Utils/layersDataConfig.js';
import { id, isBuilder, olMapHeight } from '../../../../Utils/AppDetails.jsx';

function OlMap() {

    const { projectId: routeProjectId } = useParams();

    const selectedProjectId = routeProjectId === undefined ? id : routeProjectId;

    const { olMap, mapHeight, ConfigWMSLayerToMap } = useContext(OLMapContext);
    const { featureInfoSideBarPanel, layerSwitcherSideBarPanel,
        productFilterSideBarPanel, s124NavWarningsSideBarPanel } = useUtility();
    const { fetchAndCreateProperty, getPropertyBasedOnProjectId } = useColor();

    const mapRef = useRef(null);
    const [layersData, setLayersData] = useState(null);

    useEffect(() => {
        if (olMap) {
            var view = new View({
                center: [0, 0],
                zoom: 1,
            });
            var lyr = new TileLayer({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new OSM(),
            });

            olMap.setView(view);
            olMap.addLayer(lyr);
            if (mapRef.current) {
                olMap.setTarget(mapRef.current);
            }
        }

    }, [olMap]);


    useEffect(() => {

        const fetchData = async () => {
            try {
                setLayersData(null);

                if (isBuilder) {
                    const response = await axios.get(`${nodeServerUrl}/layers/${selectedProjectId}`);
                    if (response) {
                        setLayersData(response.data);
                    }
                }
                else {
                    if (mapLayers.length > 0) {
                        setLayersData(mapLayers);
                    }
                }
            } catch (error) {
                toast.warn('Error fetching layer data:', error);
            }
        };

        fetchData();
        setTimeout(async () => {
            if (isBuilder) {
                const propertices = await getPropertyBasedOnProjectId(selectedProjectId)
                if (propertices.length == 0) {
                    fetchAndCreateProperty(selectedProjectId);
                }
            }
        }, 200);

    }, [selectedProjectId]);

    useEffect(() => {
        if (layersData) {
            layersData.map((layerData) => {
                ConfigWMSLayerToMap(olMap, layerData.url, layerData.workspace, layerData.layer);
            });
        }
    }, [layersData]);

    return (
        <Container fluid className='main-content px-0'>
            <div ref={mapRef} id="map-container" style={{ height: `${mapHeight ? `${mapHeight}px` : `${olMapHeight}px`}` }} className={`map-container ${featureInfoSideBarPanel || layerSwitcherSideBarPanel || s124NavWarningsSideBarPanel || productFilterSideBarPanel ? 'active' : ''}`} >
                <HumburgerMenu></HumburgerMenu>
            </div>
            <div id='featureInfoSidebar' className={`sideBar ${featureInfoSideBarPanel ? 'active' : ''}`} style={{ display: featureInfoSideBarPanel ? 'block' : 'none' }} ></div>
            <div id='layerSwitcherInfoSidebar' className={`sideBar ${layerSwitcherSideBarPanel ? 'active' : ''}`} style={{ display: layerSwitcherSideBarPanel ? 'block' : 'none' }}></div>
            <div id='productFilterInfoSidebar' className={`sideBar ${productFilterSideBarPanel ? 'active' : ''}`} style={{ display: productFilterSideBarPanel ? 'block' : 'none' }}></div>
            <div id='s124NavWarningsInfoSidebar' className={`sideBar ${s124NavWarningsSideBarPanel ? 'active' : ''}`} style={{ display: s124NavWarningsSideBarPanel ? 'block' : 'none' }}></div>
        </Container>
    )
}

export default OlMap;