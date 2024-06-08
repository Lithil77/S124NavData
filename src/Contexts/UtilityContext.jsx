import React, { useState, createContext, useContext, useRef } from 'react';
import { OLMapContext } from './OlMapContext';
const UtilityContext = createContext(undefined);

export const useUtility = () => {
    return useContext(UtilityContext);
};

export const UtilityProvider = ({ children }) => {

    const dragBoxRef = useRef(null);
    const typeaheadRef = useRef(null);

    const [logoFlag, setLogoFlag] = useState(false);

    const updateLogoFlagValue = (value) => {
        setLogoFlag(value);
    }

    const [productFilterBottomTablePanelVisible, setProductFilterBottomTablePanelVisible] = useState(false);

    const updateProductFilterBottomTablePanelvisible = (values) => {
        setProductFilterBottomTablePanelVisible(values)
    }

    const [attributeQueryBottomTablePanelVisible, setAttributeQueryBottomTablePanelVisible] = useState(false);

    const updateAttributeQueryBottomTablePanelVisible = (value) => {
        setAttributeQueryBottomTablePanelVisible(value)
    };

    const [collapsedQueryResultPanel, setCollapsedQueryResultPanel] = useState(false);

    const updateCollapsedQueryResultPanel = (value) => {
        setCollapsedQueryResultPanel(value)
    }

    const [selectedAttributeQueryOption, setSelectedAttributeQueryOption] = useState(null);
    const updateSelectedAttributeQueryOption = (option) => {
        setSelectedAttributeQueryOption(option)
    }

    const [searchInputloading, setSearchInputloading] = useState(false);
    const updateSearchInputloading = (value) => {
        setSearchInputloading(value);
    }

    const [featureSearchResults, setFeatureSearchResults] = useState([]);
    const updateFeatureSearchResults = (data) => {
        setFeatureSearchResults(data);
    }

    const clearFeatureSearchResults = () => {
        setFeatureSearchResults([]);
    }

    const [attributeQuerySelectedLayer, setAttributeQuerySelectedLayer] = useState('');
    const updateAttributeQuerySelectedLayer = (layerName) => {
        setAttributeQuerySelectedLayer(layerName);
    }

    const [attributeQueryPanelVisible, SetAttributeQueryPanelVisible] = useState(false);
    const updateAttributeQueryPanelVisible = (value) => {
        SetAttributeQueryPanelVisible(value);
    }

    const { olMap, stopDrawAction, clearVectorSource } = useContext(OLMapContext);

    const [isBaseMapWindowVisible, setIsBaseMapWindowVisible] = useState(false);

    const updateIsBaseMapwindowVisible = (value) => {
        setIsBaseMapWindowVisible(value);
        activeAndDeactivateButton(value, "BaseMaps");
    }

    const [isMeasureAreaWindowVisible, setIsMeasureAreaWindowVisible] = useState(false);

    const updateIsMeasureAreaWindowVisible = (value) => {
        setIsMeasureAreaWindowVisible(value);
        activeAndDeactivateButton(value, "Measure");
    }

    const [featureInfoFlag, setFeatureInfoFlag] = useState(false);

    const updateFeatureInfoFlag = (isValue) => {
        setFeatureInfoFlag(isValue);
    };

    const [clickHandlers, setClickHandlers] = useState([]);

    const [zoomWindowBtnFlag, setZoomWindowBtnFlag] = useState(true);

    const updateZoomWindowBtnFlag = (value) => {
        setZoomWindowBtnFlag(value)
    }

    const [zoomWindowButtonActive, setZoomWindowButtonActive] = useState(false);
    const updateZoomWindowButtonActive = (value) => {
        setZoomWindowButtonActive(value)
    }

    const [featureInfoSideBarPanel, setFeatureInfoSideBarPanel] = useState(false);

    const updateFeatureInfoSideBarPanel = (value) => {
        setFeatureInfoSideBarPanel(value);
    }

    const [layerSwitcherSideBarPanel, setLayerSwitcherSideBarPanel] = useState(false);

    const updateLayerSwitcherSideBarPanel = (value) => {
        setLayerSwitcherSideBarPanel(value);
    }

    const [productFilterSideBarPanel, setProductFilterSideBarPanel] = useState(false);

    const updateProductFilterSideBarPanel = (value) => {
        setProductFilterSideBarPanel(value);
    }
    const [s124NavWarningsSideBarPanel, sets124NavWarningsSideBarPanel] = useState(false);

    const updates124NavWarningsSideBarPanel = (value) => {
        sets124NavWarningsSideBarPanel(value);
    }
    const removeZoomWindowFunctionality = (olMap) => {
        if (dragBoxRef.current) {
            olMap.removeInteraction(dragBoxRef.current);
        }
    }

    const activeAndDeactivateButton = (isValue, component) => {

        const baseMapsActive = document.getElementById(component);
        if (isValue === false) {
            if (baseMapsActive !== null) {
                baseMapsActive.classList.remove('active');
            }
        }
        else {
            if (baseMapsActive !== null) {
                baseMapsActive.classList.add('active');
            }
        }
    }

    const registerFeatureInfoClickHandler = (type, handler, olMap) => {
        setClickHandlers((prevHandlers) => [...prevHandlers, { type, handler }]);
        olMap.on(type, handler);
    };

    const unregisterFeatureInfoClickHandlers = (type, olMap) => {

        if (olMap) {
            olMap.getTargetElement().style.cursor = 'default';
            clickHandlers.forEach(({ type, handler }) => {
                olMap.un(type, handler);
            });

            setClickHandlers([]);
        }

        const validTypes = ['productFilter', 'attributeQuery', 'FeatureInfo',
            'BaseMaps', 'Measure', 'ZoomWindow', 'Home', "other"];

        if (validTypes.includes(type)) {

            for (let i = 0; i < 5; i++) {
                clearVectorSource();
            }
            const tooltipStatic = document.querySelectorAll(".ol-tooltip-static");

            if (tooltipStatic) {
                tooltipStatic.forEach(tooltip => {
                    tooltip.style.display = "none";
                });
            }
        }

        let featureInfoBtn = document.getElementById("featureInfoBtn");

        if (featureInfoBtn != null) {
            featureInfoBtn.classList.remove('active');
        }

        var buttons = document.querySelectorAll('.ZoomextentBtn');
        buttons.forEach(function (button) {
            button.classList.remove('active');
        });

        let mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.style.cursor = 'default';
        }
    };

    const toggleComponent = (component, olMap) => {
        const componentActions = {
            "ZoomIn": () => {
                unregisterFeatureInfoClickHandlers("ZoomIn", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
            },
            "ZoomOut": () => {
                unregisterFeatureInfoClickHandlers("ZoomOut", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
            },
            "Home": () => {
                unregisterFeatureInfoClickHandlers("Home", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();

            },
            "previousExtend": () => {
                unregisterFeatureInfoClickHandlers("previousExtend", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();
                bottomTablePanelDisabled();

            },
            "NextExtend": () => {
                unregisterFeatureInfoClickHandlers("NextExtend", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();
                bottomTablePanelDisabled();

            },
            "ZoomWindow": () => {
                unregisterFeatureInfoClickHandlers("ZoomWindow", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();
                bottomTablePanelDisabled();
                updateProductFilterSideBarPanel(false);

            },
            "BaseMaps": () => {
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                unregisterFeatureInfoClickHandlers("BaseMaps", olMap);
                stopDrawAction();
                setTimeout(() => {
                    updateIsBaseMapwindowVisible(true);
                }, 200);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateZoomWindowBtnFlag(false);
                updateZoomWindowButtonActive(false);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();
                bottomTablePanelDisabled();
                updateProductFilterSideBarPanel(false);
            },
            "FeatureInfo": () => {
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                removeZoomWindowFunctionality(olMap);
                stopDrawAction();
                updateLayerSwitcherSideBarPanel(false);
                updateFeatureInfoSideBarPanel(true);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();

                updateCollapsedQueryResultPanel(true);
                updateAttributeQueryBottomTablePanelVisible(false);
                updateProductFilterBottomTablePanelvisible(false);
                updateProductFilterSideBarPanel(false);

            },
            "layerSwitcher": () => {
                updateLayerSwitcherSideBarPanel(true);
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                unregisterFeatureInfoClickHandlers("layerSwitcher", olMap);
                stopDrawAction();
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                /*
                updateFeatureInfoSideBarPanel(false);
               */
                updateProductFilterSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
            },
            "S124NavigationalWarnings": () => {
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                removeZoomWindowFunctionality(olMap);
                unregisterFeatureInfoClickHandlers("S124NavigationalWarnings", olMap);
                stopDrawAction();
                updateLayerSwitcherSideBarPanel(false);
                updateFeatureInfoSideBarPanel(false);
                updates124NavWarningsSideBarPanel(true);
            },
            "productFilter": () => {
                unregisterFeatureInfoClickHandlers("productFilter", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                clearAttributeQueryValues();
                updateProductFilterSideBarPanel(true);
                updateAttributeQueryBottomTablePanelVisible(false);
                updates124NavWarningsSideBarPanel(false);
            },
            "attributeQuery": () => {
                unregisterFeatureInfoClickHandlers("attributeQuery", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
                updateAttributeQueryPanelVisible(true);
                updateProductFilterBottomTablePanelvisible(false);
                updateProductFilterSideBarPanel(false);
            },
            "Measure": () => {
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                unregisterFeatureInfoClickHandlers("Measure", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                setTimeout(() => {
                    updateIsMeasureAreaWindowVisible(true);
                }, 200);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();
                bottomTablePanelDisabled();
                updateProductFilterSideBarPanel(false);
                updateAttributeQueryBottomTablePanelVisible(false);
                updateProductFilterBottomTablePanelvisible(false);
            },
            "Cart": () => {
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                unregisterFeatureInfoClickHandlers("Cart", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                clearAttributeQueryValues();
            },

            "default": () => {
                unregisterFeatureInfoClickHandlers("other", olMap);
                stopDrawAction();
                updateIsBaseMapwindowVisible(false);
                updateIsMeasureAreaWindowVisible(false);
                updateFeatureInfoFlag(false);
                removeZoomWindowFunctionality(olMap);
                updateFeatureInfoSideBarPanel(false);
                updateLayerSwitcherSideBarPanel(false);
                updates124NavWarningsSideBarPanel(false);
                clearAttributeQueryValues();
                bottomTablePanelDisabled();
                updateProductFilterSideBarPanel(false);
                updateAttributeQueryBottomTablePanelVisible(false);
                updateProductFilterBottomTablePanelvisible(false);
            }
        };

        (componentActions[component] || componentActions["default"])();
    };

    const clearAttributeQueryValues = () => {
        updateAttributeQueryPanelVisible(false);
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
        clearFeatureSearchResults();
        updateAttributeQuerySelectedLayer('')
    }

    const bottomTablePanelDisabled = () => {
        updateCollapsedQueryResultPanel(false);
        updateAttributeQueryBottomTablePanelVisible(false);
        updateProductFilterBottomTablePanelvisible(false);
    }

    return (
        <>
            <UtilityContext.Provider value={{
                isBaseMapWindowVisible, updateIsBaseMapwindowVisible,
                isMeasureAreaWindowVisible, updateIsMeasureAreaWindowVisible, dragBoxRef,
                registerFeatureInfoClickHandler, unregisterFeatureInfoClickHandlers,
                featureInfoFlag, updateFeatureInfoFlag, toggleComponent, zoomWindowBtnFlag,
                zoomWindowButtonActive, updateZoomWindowBtnFlag, updateZoomWindowButtonActive,
                removeZoomWindowFunctionality, featureInfoSideBarPanel, updateFeatureInfoSideBarPanel,
                layerSwitcherSideBarPanel, updateLayerSwitcherSideBarPanel,
                attributeQueryPanelVisible, updateAttributeQueryPanelVisible,
                attributeQuerySelectedLayer, updateAttributeQuerySelectedLayer,
                featureSearchResults, updateFeatureSearchResults, clearFeatureSearchResults,
                searchInputloading, updateSearchInputloading, typeaheadRef, updateSelectedAttributeQueryOption,
                selectedAttributeQueryOption, collapsedQueryResultPanel, updateCollapsedQueryResultPanel,
                attributeQueryBottomTablePanelVisible, updateAttributeQueryBottomTablePanelVisible,
                productFilterBottomTablePanelVisible, updateProductFilterBottomTablePanelvisible, logoFlag, updateLogoFlagValue,
                productFilterSideBarPanel, updateProductFilterSideBarPanel, updates124NavWarningsSideBarPanel, s124NavWarningsSideBarPanel,
            }}>
                {children}
            </UtilityContext.Provider>
        </>
    )
};

