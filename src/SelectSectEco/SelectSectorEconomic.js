import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectSectEco({ onSectEcoChange, attribute, defaultParam, onOtherValueChange }) {
    const [data, setData] = useState([]);
    const [selectAtiveEco, setSselectAtiveEco] = useState(defaultParam);
    const [borderColor, setBorderColor] = useState(attribute);


    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/cliente_info/lista_sector_eco`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );
                setData(response.data.data);
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
        const AtiveEco = e.target.value;
        setSselectAtiveEco(AtiveEco);
        onSectEcoChange(AtiveEco);
        setBorderColor('');
    };

    return (
        <div style={{ margin: '0 auto' }}>
            {data.length > 0 ? (
                <div>
                    <label htmlFor="AtiveEco" style={{ display: 'block', marginBottom: '10px' }}>Sector económico:</label>
                    <select
                        id="AtiveEco"
                        value={selectAtiveEco}
                        onChange={handleActiveEco}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '20px',
                            borderColor: borderColor // Aplicar el color del borde
                        }}
                    >
                        <option value="">Seleccionar Sector económico</option>
                        {data.map((sec) => (
                            <option key={sec.id} value={sec.id}>{sec.nombre_sector_eco}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
};

export default SelectSectEco;
