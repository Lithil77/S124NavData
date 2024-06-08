import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Card, Table, Button } from 'react-bootstrap';
import ImageWMS from "ol/source/ImageWMS.js";
import ImageLayer from "ol/layer/Image.js";
import TreeView from 'react-treeview';
import { StyledLoaderInner, StyledLoaderWraper, StyledTreeView, StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Contexts/OlMapContext';
import { useParams } from "react-router-dom";
import './LayerConfig.css';
import CustomModal from '../../../Reusable/CustomModal';
import { nodeServerUrl } from '../../../../appConfig';
import { toast } from 'react-toastify';
import MapPreview from './MapPreview/MapPreview';
import { OlMapPreviewContext } from './MapPreview/MapPreviewContext';
import { createLayer, deleteLayer } from '../../../../api/layerApi';
import { getLayers } from '../../../../Builder/GeoServer/Layers';
import { getWorkSpacesFromGeoServer } from '../../../../Builder/GeoServer/WorkSpaces';
import { getLayerMetaData } from '../../../../Builder/GeoServer/LayerMetaData';
import Accordion from 'react-bootstrap/Accordion';
import GeoConfig from './GeoConfig/GeoConfig';
import axios from 'axios';

function LayerConfig() {

    const [title] = useState('LayerConfig');
    const { olMap, ConfigWMSLayerToMap, updateIsLayerAdded } = useContext(OLMapContext);
    const olPreviewMap = useContext(OlMapPreviewContext);
    const { projectId } = useParams();
    const [dataGeoConfigs, setDataGeoConfigs] = useState([]);

    const [activeKey, setActiveKey] = useState(null);

    const handleAccordionChange = (key) => {
        setActiveKey(activeKey === key ? null : key);
    };

    const [showLayerConfigModel, setShowLayerConfigModel] = useState(false);
    const [workSpaceList, setWorkSpaceList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [layersList, setLayersList] = useState([]);

    const [selectedLayerOption, setSelectedLayerOption] = useState(null);
    const [layerMetaDataDetails, setLayerMetaDataDetails] = useState([]);

    const [inputValues, setInputValues] = useState({
        workspace: null,
        lyrName: null,
        url: null
    });

    const setInputValue = (name, value) => {
        setInputValues((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    useEffect(() => {
        var layerConfigButtonList = document.getElementById('layerConfigButtonList');
        const layerConfigContainer = document.getElementById('layerConfigContainer');
        if (layerConfigButtonList && layerConfigContainer != null) {
            if (!layerConfigButtonList.contains(layerConfigContainer)) {
                layerConfigButtonList.append(layerConfigContainer);
            }
        }
    }, [olMap]);

    const fetchGeoConfigs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${nodeServerUrl}/geoConfigs`);
            if (response) {
                const urls = response.data.map(config => config.url);
                setDataGeoConfigs(urls);
            }

        } catch (err) {
            toast.warn('Error fetching geo config from server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGeoConfigs();
    }, []);

    const handleRefresh = () => {
        fetchGeoConfigs();
    }

    const handleSelectWorkspace = (workSpace, workSpaceGeoserverUrl) => {
        setSelectedWorkspace(workSpace);
        setLayersList([]);
        setInputValue('workspace', workSpace);

        const myTimeOut = setTimeout(async () => {
            try {
                setLoading(true);
                setInputValue("url", workSpaceGeoserverUrl);
                const layers = await getLayers(workSpaceGeoserverUrl);
                setLayersList(layers);
                clearTimeout(myTimeOut);
                setLoading(false);
            } catch (error) {
                toast.error('error fetching layers data:', error);
            }
        }, 1000);
    };

    const handleSelectLayer = (layerName, e) => {
        setInputValue('lyrName', layerName);
        addLayer(e.target.value, layerName);
    };

    function isLayerAdded(layerName) {
        var layers = olMap.getLayers().getArray();
        for (let lyr of layers) {
            if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageWMS) {
                if (lyr.get('title') === layerName) {
                    return true;
                }
            }
        }
        return false;
    }

    const handleRemoveLayer = async (layerurl, layerworkspace, layername) => {
        if (layerurl && layerworkspace && layername) {
            setTimeout(() => {
                deleteLayer(projectId, layername);
            }, 1000);
        }
    }

    const handleLayerConfig = () => {
        if (olMap) {
            handleShowLayerConfigModel();
            getWorkSpaces();
        }
    }

    const getWorkSpaces = () => {
        const myTimeOut = setTimeout(async () => {
            try {
                if (dataGeoConfigs) {
                    setLoading(true);
                    const workSpaces = await getWorkSpacesFromGeoServer(dataGeoConfigs);
                    if (workSpaces.length > 0) {
                        setWorkSpaceList(workSpaces);
                        setLoading(false);
                    }
                }
            } catch (error) {
                toast.warn('Error fetching workspaces')
            } finally {
                clearTimeout(myTimeOut);
            }
            setLoading(false);
        }, 1500);
    }

    const handleLayerOptionClick = (layerName, e) => {

        const layerOptions = document.querySelectorAll('.layer-option');
        if (layerOptions.length > 0) {
            layerOptions.forEach(option => (option.style.color = 'black'));
        }

        addPreviewLayer(layerName);
        setSelectedLayerOption(layerName);
    };

    async function addPreviewLayer(layerName) {
        var layers1 = olPreviewMap.getLayers().getArray();
        const isLayerPreviewExist = layers1.some((lyr) => lyr.get('title') === layerName);
        if (!isLayerPreviewExist) {
            removeNonPreviewLayers(olPreviewMap);
            setLoading(true);
            const metaData = await getLayerMetaData(inputValues.url, inputValues.workspace, layerName);
            setLoading(false);
            setLayerMetaDataDetails(metaData);
            const mytimeOut = setTimeout(() => {
                ConfigWMSLayerToMap(olPreviewMap, inputValues.url, inputValues.workspace, layerName);
                clearTimeout(mytimeOut);
            }, 500);
        }
        setLoading(false);
    }

    function addLayer(btnValue, layerName) {

        if (btnValue === "+") {

            setTimeout(async () => {
                var layers = olMap.getLayers().getArray();

                const isLayerExist = layers.some((lyr) => lyr.get('title') === layerName);

                if (!isLayerExist) {

                    ConfigWMSLayerToMap(olMap, inputValues.url, inputValues.workspace, layerName);

                    const layerData = {
                        workspace: inputValues.workspace,
                        layer: layerName,
                        url: inputValues.url,
                        index: 1,
                        projectId: parseInt(projectId)
                    };

                    const newLayer = await createLayer(JSON.stringify(layerData));
                    toast.success(`${layerName} is added to the map.`);
                    updateIsLayerAdded(true);
                }
                else {
                    toast.warn(`${layerName} is already added to the map.`);
                    return;
                }
            }, 100);
        }
        else {
            var layers = olMap.getLayers().getArray();
            layers.map((lyr) => {
                if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageWMS) {
                    if (lyr.get('title') === layerName) {
                        olMap.removeLayer(lyr);
                    }
                }
            })
            const updatedLayersList = layersList.filter(layer => layer !== layerName);
            setLayersList(updatedLayersList);

            setTimeout(async () => {
                try {
                    const response = await axios.delete(`${nodeServerUrl}/layer/${projectId}/${layerName}`);
                    setMessage(response.data.message);
                    fetchGeoConfigs();
                } catch (error) {
                    setError('Internal server error');
                    toast.error('Internal server error for deleting layer:', error);
                }
            }, 100);
        }
    }

    function removeNonPreviewLayers(map) {
        const layers = map.getLayers();
        layers.forEach((layer) => {
            if (layer instanceof ImageLayer && layer.getSource() instanceof ImageWMS) {
                map.removeLayer(layer);
            }
        });
    }

    const handleShowLayerConfigModel = () => {
        setShowLayerConfigModel(true);
    };

    const handleHideLayerConfigModel = () => {
        setShowLayerConfigModel(false);
    };

    return (
        <div id='layerConfigContainer' style={{ position: "relative" }}>
            <StyledMapControlButton title={title} id={title} className='p-1 mb-1'
                onClick={handleLayerConfig}
            >
                <i className="bi bi-layers" />
            </StyledMapControlButton>

            <CustomModal title='Layer config' show={showLayerConfigModel}
                onHide={handleHideLayerConfigModel} size="lg" buttonValue="Close" onSubmit={handleHideLayerConfigModel}>
                <div>
                    <Accordion activeKey={activeKey} onSelect={handleAccordionChange}>
                        <Accordion.Item eventKey="0" onClick={handleRefresh}>
                            <Accordion.Header>Link GeoServer</Accordion.Header>
                            <Accordion.Body>
                                <GeoConfig></GeoConfig>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Row className='mx-0 mt-2'>
                        <Col sm={6} className='ps-0'>
                            <Card style={{ maxHeight: '445px', minHeight: '100px', height: '445px', display: 'block', overflow: 'auto' }}>
                                {loading && (
                                    <StyledLoaderWraper>
                                        <StyledLoaderInner />
                                    </StyledLoaderWraper>
                                )}
                                {workSpaceList &&
                                    workSpaceList.map((workspaceOption) => (
                                        <TreeView defaultCollapsed={true} nodeLabel={workspaceOption.workSpace} key={workspaceOption.workSpace}
                                            onClick={() => handleSelectWorkspace(workspaceOption.workSpace, workspaceOption.workSpaceUrl)}>

                                            {selectedWorkspace === workspaceOption.workSpace && (
                                                <div>
                                                    {layersList &&
                                                        layersList.map((layerOption) => (
                                                            <StyledTreeView className='pe-2 py-2 ms-3'>
                                                                <div key={layerOption} className="d-flex justify-content-between align-items-center" style={{ wordBreak: 'break-all' }}>
                                                                    <div
                                                                        key={layerOption}
                                                                        title={layerOption}
                                                                        className={`layer-option ${layerOption === selectedLayerOption ? 'selected' : ''}`}
                                                                        onClick={(e) => handleLayerOptionClick(layerOption, e)}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            whiteSpace: 'nowrap',
                                                                            width: '80%',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-arrow-right me-2" style={{ color: "white", position: 'relative', left: '-1px' }}></i>
                                                                        {layerOption}
                                                                    </div>
                                                                    {!isLayerAdded(layerOption) && (
                                                                        <input
                                                                            type="button"
                                                                            name={layerOption}
                                                                            className={`ms-2 d-flex justify-content-center align-items-center align-content-center btn 
                                                                        ${isLayerAdded(layerOption) ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                                                                            value={isLayerAdded(layerOption) ? '-' : '+'}
                                                                            onClick={(e) => handleSelectLayer(layerOption, e)}
                                                                            style={{ width: '40px', height: '40px', verticalAlign: 'middle', fontSize: '26px', lineHeight: '0' }}
                                                                        />
                                                                    )}
                                                                    {isLayerAdded(layerOption) ? (
                                                                        <input type="button"
                                                                            value={isLayerAdded(layerOption) ? '-' : '+'}
                                                                            className="ms-2 p-2 btn btn-outline-danger d-flex justify-content-center align-items-center align-content-center"
                                                                            style={{ width: '40px', height: '40px', verticalAlign: 'middle', fontSize: '26px', lineHeight: '0' }}
                                                                            onClick={() => handleRemoveLayer(inputValues.url, inputValues.workspace, layerOption)} />
                                                                    ) : null}
                                                                </div>
                                                            </StyledTreeView>
                                                        ))}
                                                </div>
                                            )}
                                        </TreeView>
                                    ))}
                            </Card>
                        </Col>
                        <Col sm={6} className='px-0'>
                            <Card>
                                <MapPreview />
                                {layerMetaDataDetails && (<div>
                                    <h6 className='mb-0 p-2'>Metadata</h6>
                                    <div style={{ maxHeight: '158px', minHeight: '158px', overflow: 'auto', height: 'auto', fontSize: '12px' }}>
                                        {layerMetaDataDetails && (
                                            <Table responsive striped bordered className='text-start mb-0'>
                                                <tbody>
                                                    {layerMetaDataDetails.length > 0 && Object.entries(layerMetaDataDetails[0]).map(([key, value]) => (
                                                        <tr key={key}>
                                                            <th>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</th>
                                                            <td>{value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </div>)}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </CustomModal>
        </div>
    )
}

export default LayerConfig;