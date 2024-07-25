import React, { useState } from 'react';
import useApiRequest from '../Request/Request'; // Ajusta la ruta según tu estructura de archivos

function SelectBank({ onValueChange }) {
    const { useFetchDataWithToken} = useApiRequest();
    const { data, loading, error } = useFetchDataWithToken(`${process.env.REACT_APP_BACKEND_SERVER}/creditos/lista_bancos`);
    const [selectedData, setselectedData] = useState('');

    const handleDoctChange = (e) => {
        const selected = e.target.value;
        setselectedData(selected);
        onValueChange(selected);
        console.log(selected);
    };

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    if (error) {
        return <p>Error obteniendo la data.</p>;
    }

    return (
        <div style={{ margin: '0 auto' }}>
            {data && data.length > 0 ? ( // Verificar si data tiene elementos antes de renderizar
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
                <p>No se encontraron bancos.</p>
            )}
        </div>
    );
};

export default SelectBank;
