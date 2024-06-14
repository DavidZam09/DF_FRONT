import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectBank({ onValueChange }) {
    const [data, setData] = useState([]);
    const [selectedData, setselectedData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/creditos/lista_bancos');
                setData(response.data.data); // Acceder a response.data.data para obtener la lista de tipos de documento
            } catch (error) {
                console.error('Error obteniendo la data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDoctChange = (e) => {
        const selected = e.target.value;
        setselectedData(selected);
        onValueChange(selected);
        console.log(selected);
    };
    return (
        <div style={{ margin: '0 auto' }}>
            {data.length > 0 ? ( // Verificar si data tiene elementos antes de renderizar
                <div>
                    <label htmlFor="label" style={{ display: 'block', marginBottom: '10px' }}>Bancos:</label>
                    <select
                        id="label"
                        value={selectedData}
                        onChange={handleDoctChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
                    >
                        <option value="">Seleccione el banco</option>
                        {data.map((res) => (
                            <option key={res.id} value={res.id}>
                                {res.nombre_credito_bancos}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
};

export default SelectBank;
