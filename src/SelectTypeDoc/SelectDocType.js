import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectDocType({ onDocChange,defaultParam }) {
    const [data, setData] = useState([]);
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(defaultParam);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cliente/lista_tipo_doc');
                setData(response.data.data); // Acceder a response.data.data para obtener la lista de tipos de documento
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDoctChange = (e) => {
        const Document = e.target.value;
        setSelectedTipoDocumento(Document);
        onDocChange(Document);
        console.log(Document);
    };
    return (
        <div style={{ margin: '0 auto' }}>
            {data.length > 0 ? ( // Verificar si data tiene elementos antes de renderizar
                <div>
                    <label htmlFor="departments" style={{ display: 'block', marginBottom: '10px' }}>Tipo de documento:</label>
                    <select
                        id="departments"
                        value={selectedTipoDocumento}
                        onChange={handleDoctChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
                    >
                        <option value="">Seleccionar tipo de documento</option>
                        {data.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                                {doc.nombre_tipo_doc}
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

export default SelectDocType;
