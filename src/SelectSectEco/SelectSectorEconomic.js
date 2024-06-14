import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectSectEco({ onSectEcoChange }) {
    const [data, setData] = useState([]);
    const [selectAtiveEco, setSselectAtiveEco] = useState('');
    const [showInput, setShowInput] = useState(false); // Estado para controlar la visibilidad del input de "Otro"
    const [otherValue, setOtherValue] = useState(''); // Estado para almacenar el valor del input "Otro"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cliente_info/lista_sector_eco');
                setData(response.data.data); // Acceder a response.data.data para obtener la lista de tipos de documento
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleActiveEco = (e) => {
        const SectorEconomico = e.target.value;
        setSselectAtiveEco(SectorEconomico);
        onSectEcoChange(SectorEconomico);
        console.log(SectorEconomico)
        if (SectorEconomico === '14') {
            setShowInput(true);
        } else {
            setShowInput(false);
        }
    };

    const handleOtherValueChange = (e) => {
        setOtherValue(e.target.value);
        onSectEcoChange(e.target.value);
    };

    return (
        <div style={{ margin: '0 auto' }}>
            {data.length > 0 ? (
                <div>
                    <label htmlFor="SectorEconomico" style={{ display: 'block', marginBottom: '10px' }}>Sector económico:</label>
                    <select
                        id="SectorEconomico"
                        value={selectAtiveEco}
                        onChange={handleActiveEco}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
                    >
                        <option value="">Seleccionar Sector económico</option>
                        {data.map((sec) => (
                            <option key={sec.id} value={sec.id}>{sec.nombre_sector_eco}</option>
                        ))}
                    </select>
                    {showInput && (
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="otroInput" style={{ display: 'block', marginBottom: '10px' }}>Especificar otro sector económico:</label>
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

export default SelectSectEco;
