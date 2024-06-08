import React, { useContext, useEffect, useState } from 'react';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Contexts/OlMapContext';
import './ZoomIn.css';
import { useUtility } from '../../../../Contexts/UtilityContext';

function ZoomIn() {

    const [title] = useState('ZoomIn');
    const { olMap, updatePreviousExtend } = useContext(OLMapContext);
    const { toggleComponent } = useUtility();

    useEffect(() => {
        var zoomInButtonList = document.getElementById('zoomInButtonList');
        const zoomInContainer = document.getElementById('zoomInContainer');
        if (zoomInButtonList && zoomInContainer != null) {
            if (!zoomInButtonList.contains(zoomInContainer)) {
                zoomInButtonList.appendChild(zoomInContainer);
            }
        }
    }, [olMap]);

    const handleZoomIn = () => {
        if (olMap) {
            toggleComponent(title, olMap);
            updatePreviousExtend();
            const view = olMap.getView();
            let currentZoom = view.getZoom();
            olMap.getView().setZoom(currentZoom + 0.5);
        }
    }

    return (
        <div id='zoomInContainer' style={{ position: "relative" }}>
            <StyledMapControlButton title={title} id={title} className='p-1 mb-1'
                onClick={handleZoomIn}
            >
                <i className="bi bi-zoom-in" />
            </StyledMapControlButton>
        </div>
    )
}

export default ZoomIn;