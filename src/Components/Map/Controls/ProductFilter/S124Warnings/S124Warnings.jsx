import React, { useContext, useState, useRef } from 'react';
import ImageWMS from "ol/source/ImageWMS.js";
import ImageLayer from "ol/layer/Image.js";
import { Col, FloatingLabel, Form, Overlay, Popover, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useColor } from '../../../../../Contexts/ColorContext';
import 'react-datepicker/dist/react-datepicker.css';
import { StyledButton } from '../../../../Reusable/StyledComponent';
import { useProductFilter } from '../../../../../Contexts/ProductFilterContext';
import { OLMapContext } from '../../../../../Contexts/OlMapContext';

function S124Warnings() {

    const { olMap } = useContext(OLMapContext);
    const { selectedMapLayer } = useProductFilter();
    const [selectedNavigationWarningType, setSelectedNavigationWarningType] = useState('select');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const { backgroundColor, textColor, borderColor } = useColor();

    const [startdateCalenderBtnVisible, setStartdateCalenderBtnVisible] = useState(false);
    const [endDateCalenderBtnVisible, setEndDateCalenderBtnVisible] = useState(false);

    const [showStartDateCalendarDialog, setShowStartDateCalendarDialog] = useState(false);
    const [showEndDateCalendarDialog, setShowEndDateCalendarDialog] = useState(false);

    const startDateTarget = useRef(null);
    const endDateTarget = useRef(null);

    const navigationWarningTypes = [
        'Local Navigational Warning',
        'Coastal Navigational Warning',
        'Sub-Area Navigational Warning',
        'NAVAREA Navigational Warning',
        'NAVAREA No Warning',
        'Sub-Area No Warning',
        'Coastal No Warning',
        'Local No Warning',
        'NAVAREA In-Force Bulletin',
        'Sub-Area In-Force Bulletin',
        'Coastal In-Force Bulletin',
        'Local In-Force Bulletin',
    ];

    const handleInputChange = (event) => {
        if (event.target.value === 'select') {
            Toast.warn('Please select a warning type');
        } else {
            setSelectedNavigationWarningType(event.target.value);
            setStartdateCalenderBtnVisible(true);
            setEndDateCalenderBtnVisible(true);
        }
    };

    const handleCalenderStartDateChange = (selectedDate) => {
        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
            setSelectedStartDate(selectedDate);
            setShowStartDateCalendarDialog(false); // Close the calendar after selecting a date
        }
    };

    const handleCalenderEndDateChange = (selectedDate) => {
        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
            setSelectedEndDate(selectedDate);
            setShowEndDateCalendarDialog(false); // Close the calendar after selecting a date
        }
    };

    const handleOpenStartDateCalendar = (event) => {
        event.preventDefault();
        startDateTarget.current = event.target;
        setShowStartDateCalendarDialog(true);
        setShowEndDateCalendarDialog(false);
    };

    const handleOpenEndDateCalendar = (event) => {
        event.preventDefault();
        endDateTarget.current = event.target;
        setShowEndDateCalendarDialog(true);
        setShowStartDateCalendarDialog(false);
    };

    const handleSubmit = () => {
        if (olMap) {
            const allLayers = olMap.getLayers().getArray();
            const finalFilterString = `warningtype=${selectedNavigationWarningType}`;

            let foundFeature = false;

            allLayers.forEach(lyr => {
                if (lyr instanceof ImageLayer && lyr.getSource() instanceof ImageWMS) {
                    if (selectedMapLayer === lyr.get('title')) {
                        lyr.setVisible(true);
                        const params = lyr.getSource().getParams();
                        params.CQL_FILTER = finalFilterString;
                        lyr.getSource().updateParams(params);
                        foundFeature = true;
                    }
                }
            });

            if (!foundFeature) {
                alert('No features found for the selected warning type.');
            }
        }
    };




    return (
        <div>
            <FloatingLabel label="Warning Type" className='mb-2 mt-2'>
                <Form.Select
                    id="warningType"
                    onChange={handleInputChange}
                    value={selectedNavigationWarningType}
                >
                    <option value='select'>Select a Navigational Warning</option>
                    {navigationWarningTypes.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
            </FloatingLabel>
            <Row>
                <Col sm={6}>
                    <label className='me-2'>Start: {selectedStartDate.toLocaleDateString()}</label>
                    <StyledButton
                        title='Calendar'
                        className={`${startdateCalenderBtnVisible ? '' : 'disabled'}`}
                        id="btn-Calender"
                        onClick={handleOpenStartDateCalendar}
                        ref={startDateTarget}
                        style={{ backgroundColor, color: textColor, borderColor }}
                    >
                        <i className='bi bi-calendar'></i>
                    </StyledButton>
                    <Overlay show={showStartDateCalendarDialog} target={startDateTarget.current} placement='bottom'>
                        <Popover id='popover-contained'>
                            <Popover.Body className='p-0'>
                                <DatePicker
                                    selected={selectedStartDate}
                                    onChange={handleCalenderStartDateChange}
                                    inline
                                    dateFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"
                                    style={{
                                        backgroundColor,
                                        color: textColor,
                                        borderColor,
                                    }}
                                />
                            </Popover.Body>
                        </Popover>
                    </Overlay>
                </Col>
                <Col sm={6}>
                    <label className='me-2'>End: {selectedEndDate.toLocaleDateString()}</label>
                    <StyledButton
                        title='Calendar'
                        className={`${endDateCalenderBtnVisible ? '' : 'disabled'}`}
                        id="btn-Calender"
                        onClick={handleOpenEndDateCalendar}
                        ref={endDateTarget}
                        style={{ backgroundColor, color: textColor, borderColor }}
                    >
                        <i className='bi bi-calendar'></i>
                    </StyledButton>
                    <Overlay show={showEndDateCalendarDialog} target={endDateTarget.current} placement='bottom'>
                        <Popover id='popover-contained'>
                            <Popover.Body className='p-0'>
                                <DatePicker
                                    selected={selectedEndDate}
                                    onChange={handleCalenderEndDateChange}
                                    inline
                                    dateFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"
                                    style={{
                                        backgroundColor,
                                        color: textColor,
                                        borderColor,
                                    }}
                                />
                            </Popover.Body>
                        </Popover>
                    </Overlay>
                </Col>
            </Row>
            <StyledButton className='mt-4' onClick={handleSubmit}>Submit</StyledButton>
        </div>
    );
}

export default S124Warnings;
