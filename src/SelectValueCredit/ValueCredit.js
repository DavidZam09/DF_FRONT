import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectCreditValue({ onValueChange, defaultParam }) {
    const [data, setData] = useState([]);
    const [selectedData, setselectedData] = useState(defaultParam);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/creditos/lista_credito_cotizacion');
                setData(response.data.data); // Acceder a response.data.data para obtener la lista de tipos de documento
            } catch (error) {
                console.error('Error fetching data:', error);
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
    function formatCurrency(value) {
        // Formatea el valor con el signo de pesos y separadores de miles
        return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (
        <div style={{ margin: '0 auto' }}>
            {data.length > 0 ? ( // Verificar si data tiene elementos antes de renderizar
                <div>
                    <label htmlFor="departments" style={{ display: 'block', marginBottom: '10px' }}>Valor del credito y la frecuencia de pago:</label>
                    <select
                        id="departments"
                        value={selectedData}
                        onChange={handleDoctChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
                    >
                        <option value="">Seleccione el valor del credito y la frecuencia de pago</option>
                        {data.map((res) => (
                            <option key={res.id} value={res.id}>
                                {formatCurrency(res.valor_prestamo)} - {res.frecuencia_cobro}
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

export default SelectCreditValue;
