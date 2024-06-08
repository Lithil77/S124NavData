import React, { useContext, useEffect, useState } from 'react';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Contexts/OlMapContext';
import { fromLonLat } from "ol/proj.js";
import View from "ol/View";
import './Home.css';
import { useUtility } from '../../../../Contexts/UtilityContext';

function Home() {

    const [title] = useState('Home');
    const [center] = useState([0, 0]);
    const { olMap, updatePreviousExtend } = useContext(OLMapContext);
    const { toggleComponent } = useUtility();

    useEffect(() => {
        var homeButtonList = document.getElementById('homeButtonList');
        const homeContainer = document.getElementById('homeContainer');
        if (homeButtonList && olMap && homeContainer) {
            if (!homeButtonList.contains(homeContainer)) {
                homeButtonList.append(homeContainer);
            }
        }

    }, [olMap]);

    const handleHome = () => {

        if (olMap) {
            toggleComponent(title, olMap);
            var view = new View({
                center: fromLonLat(center),
                zoom: 2,
            });

            olMap.setView(view);
            updatePreviousExtend();
        }
    }

    return (
        <div id='homeContainer' style={{ position: "relative" }}>
            <StyledMapControlButton
                title="Zoom Extent" id={title}
                className='p-1 mb-1'
                onClick={handleHome}
            >
                <i className="bi bi-arrows-fullscreen" />
            </StyledMapControlButton>
        </div>
    )
}

export default Home;