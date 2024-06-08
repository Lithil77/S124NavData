import React, { useEffect, useState, createContext } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';

export const OlMapPreviewContext = createContext(undefined);

const OlMapPreviewProvider = ({ children }) => {
    const [map, setMap] = useState();

    useEffect(() => {
        const olMapPreview = new Map({
            controls: []
        });
        setMap(olMapPreview);
    }, []);

    return (
        <>
            <OlMapPreviewContext.Provider value={map}>
                {children}
            </OlMapPreviewContext.Provider>
        </>
    )
};

export default OlMapPreviewProvider;
