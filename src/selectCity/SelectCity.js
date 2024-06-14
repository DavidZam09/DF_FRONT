import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectDpartmetAndCity({ onDepartmentChange, onCityChange, defaultDepartment, defaultCity }) {
    const [data, setData] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(defaultDepartment);
    const [selectedCity, setSelectedCity] = useState(defaultCity);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cliente_info/dptxciudades');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDepartmentChange = (e) => {
        const department = e.target.value;
        setSelectedDepartment(department);
        setSelectedCity('');
        onDepartmentChange(department);
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);
        onCityChange(city);
    };

    return (
        <div style={{ margin: '0 auto' }}>
            {data ? (
                <div>
                    <label htmlFor="departments" style={{ display: 'block', marginBottom: '10px' }}>Departamento:</label>
                    <select
                        id="departments"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
                    >
                        <option value="">Seleccionar departamento</option>
                        {data.map((depto) => (
                            <option key={depto.id} value={depto.departamento}>{depto.departamento}</option>
                        ))}
                    </select>

                    {selectedDepartment && (
                        <div>
                            <label htmlFor="cities" style={{ display: 'block', marginBottom: '10px' }}>Ciudad:</label>
                            <select
                                id="cities"
                                value={selectedCity}
                                onChange={handleCityChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
                            >
                                <option value="">Seleccionar ciudad</option>
                                {data.find((depto) => depto.departamento === selectedDepartment)?.ciudades.map((ciudad, index) => (
                                    <option key={index} value={ciudad}>{ciudad}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
}

export default SelectDpartmetAndCity;
