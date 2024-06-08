import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { nodeServerUrl } from '../../../../../appConfig';
import ConfirmAlert from '../../../../Reusable/ConfirmAlert';

const GeoConfig = () => {

    const [geoConfigs, setGeoConfigs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editRowId, setEditRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const fetchGeoConfigs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${nodeServerUrl}/geoConfigs`);
            if (response) {
                setGeoConfigs(response.data);
            }

        } catch (err) {
            setError(err);
            toast.error('Failed to fetch geo configurations');
        } finally {
            setIsLoading(false);
        }
    };

    const addGeoConfig = async () => {
        try {
            const newGeoConfig = { url: '' };
            await axios.post(`${nodeServerUrl}/geoConfig`, newGeoConfig, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchGeoConfigs(); // Refresh the list after adding
            toast.success('GeoConfig added successfully');
        } catch (err) {
            setError(err);
            toast.error('Failed to add GeoConfig');
        }
    };

    const updateGeoConfig = async (updatedGeoConfig) => {
        try {
            await axios.put(`${nodeServerUrl}/geoConfigs/${updatedGeoConfig.id}`, updatedGeoConfig, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchGeoConfigs(); // Refresh the list after updating
            toast.success('GeoConfig updated successfully');
        } catch (err) {
            setError(err);
            toast.error('Failed to update GeoConfig');
        }
    };

    const deleteGeoConfig = async (id) => {
        try {
            await axios.delete(`${nodeServerUrl}/geoConfigs/${id}`);
            fetchGeoConfigs();
            toast.success('GeoConfig deleted successfully');

        } catch (err) {
            setError(err);
            toast.error('Failed to delete GeoConfig');
        }
    };

    const handleEdit = (id, url) => {
        setEditRowId(id);
        setEditedData({ ...editedData, [id]: url });
    };

    const handleSave = async (id, url) => {
        await updateGeoConfig({ id, url });
        setEditRowId(null);
    };

    const handleInputChange = (event, id) => {
        const { value } = event.target;
        setEditedData({ ...editedData, [id]: value });
    };

    useEffect(() => {
        fetchGeoConfigs();
    }, []);

    return (
        <div className="table-responsive">
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (
                <Table striped bordered hover className='mt-2 text-center'>
                    <thead>
                        <tr>
                            <th>Url</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {geoConfigs.length > 0 && geoConfigs.map((record) => (
                            <tr key={record.id}>
                                <td>
                                    {editRowId === record.id ? (
                                        <Form.Control
                                            type="text"
                                            value={editedData[record.id] || record.url}
                                            onChange={(event) => handleInputChange(event, record.id)}
                                        />
                                    ) : (
                                        record.url
                                    )}
                                </td>
                                <td>
                                    {editRowId === record.id ? (
                                        <Button size='sm'
                                            variant="success" title='Save'
                                            onClick={() => handleSave(record.id, editedData[record.id] || record.url)}
                                        >
                                            <i className='bi bi-save'></i>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button size='md me-2'
                                                variant="primary" title='Edit'
                                                onClick={() => handleEdit(record.id, record.url)}
                                            >
                                                <i className='bi bi-pencil'></i>
                                            </Button>
                                            <ConfirmAlert
                                                message={`Are you sure you want to delete ${record.url} ?`}
                                                handleDelete={() => { deleteGeoConfig(record.id) }} />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <div className='mb-2 ms-2'>
                <Button className='text-center' title='add' variant="success" onClick={addGeoConfig}>
                    <i className="bi bi-plus-circle"></i>
                </Button>
            </div>
        </div>
    );
};

export default GeoConfig;
