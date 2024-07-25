import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectActiveEco({ onActiveEcoChange, defaultParam, attribute }) {
    const [data, setData] = useState([]);
    const [selectAtiveEco, setSselectAtiveEco] = useState(defaultParam);
    const [showInput, setShowInput] = useState(false);
    const [otherValue, setOtherValue] = useState('');
    const [borderColor, setBorderColor] = useState(attribute);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/cliente_info/lista_actividad_eco`
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setData(response.data.data); // Acceder a response.data.data para obtener la lista de tipos de documento
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        setBorderColor(attribute);
    }, [attribute]);
    const handleActiveEco = (e) => {
        const ActiveEco = e.target.value;
        setSselectAtiveEco(e.target.value);
        onActiveEcoChange(ActiveEco)
        console.log("esta es la actividad economica" + ActiveEco);
        if (ActiveEco === '22') {
            setShowInput(true);
        } else {
            setShowInput(false);
        }
    };
    const handleOtherValueChange = (e) => {
        setOtherValue(e.target.value);
        onActiveEcoChange(e.target.value);
    };


    return (
        <div style={{ margin: '0 auto' }}>
            {data.length > 0 ? (
                <div>
                    <label htmlFor="ActividadEconomica" style={{ display: 'block', marginBottom: '10px' }}>Actividad economica:</label>
                    <select
                        id="ActividadEconomica"
                        value={selectAtiveEco}
                        onChange={handleActiveEco}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px', borderColor: borderColor }}
                    >
                        <option value="">Seleccionar Actividad economica</option>
                        {data.map((act) => (
                            <option key={act.id} value={act.id}>{act.nombre_actividad_eco}</option>
                        ))}
                    </select>
                    {showInput && (
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="otroInput" style={{ display: 'block', marginBottom: '10px', borderColor: borderColor }}>Especificar otro sector económico:</label>
                            <input
                                type="text"
                                id="otroInput"
                                value={otherValue}
                                onChange={handleOtherValueChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
};

export default SelectActiveEco;
