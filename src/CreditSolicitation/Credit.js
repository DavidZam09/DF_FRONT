import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectCreditValue from '../SelectValueCredit/ValueCredit';
import '../CreditQuote/CreditQuote.css';
import SelectBank from '../Banks/Banks';
import { toast } from 'react-toastify';
import useApiRequest from '../Request/Request';



const SolicitedCredit = ({ onClose }) => {
    const [id, setId] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const initialFormState = {
        id: '',
        id_credito_estado: '1',
        id_banco: '',
        id_cliente: '',
        id_credito_cotizacion: '',
        tipo_cobro: '',
        num_cuenta: '',
        tipo_cuenta: '',
        num_cuotas: '',
        nota_cliente: '',
    };
    const { apiRequest, isLoading } = useApiRequest();
    const [formulario, setFormulario] = useState(initialFormState);
    const handleSelectedChange = (field, value) => {
        setFormulario(prevFormulario => ({
            ...prevFormulario,
            [field]: value,
        }));
    };

    useEffect(() => {
        const clientId = localStorage.getItem('id');
        if (clientId) {
            setFormulario(prevFormulario => ({
                ...prevFormulario,
                id_cliente: parseInt(clientId, 10)
            }));
        }
    }, []);

    const validateFields = (requiredFields) => {
        for (let field of requiredFields) {
            if (!formulario[field]) {
                alert(`Por favor, diligencie el campo ${field.replace('_', ' ')}.`);
                return false;
            }
        }
        return true;
    };

    const handleFormContinue = (event, requiredFields) => {
        event.preventDefault();
        if (validateFields(requiredFields)) {
            handleConfirm();
        }
    };

    const handleConfirm = () => {
        const url = 'http://192.168.20.23:3000/creditos/input_credito';
        const method = 'POST';
        const body = formulario;
        const successMessage = 'Hola! Tu credito ha sido solicitado';

        apiRequest(url, method, body, successMessage, '', 4000)
            .then(() => {
                setFormulario(initialFormState);
            });
    };



    const handleInputChange = (e) => {
        const { name, value, type, checked, id } = e.target;

        if (id === 'number') {
            if (validateFields2(name, value, id)) {
                setFormulario({
                    ...formulario,
                    [name]: value,
                });
            }
        } else if(validateFields2(name, value, id)){
            setFormulario({
                ...formulario,
                [name]: value,
            });

        }
    };
    const validateFields2 = (name, value, id) => {
        if (value) {
            if (id !== 'number') {
                if (/\d/.test(value)) {
                    toast.info(`El campo "${name.replace('_', ' ')}" no puede contener números.`);
                    return false;
                }
            } else {
                if (!/^\d+$/.test(value)) {
                    toast.info(`El campo "${name.replace('_', ' ')}" solo puede contener números.`);
                    return false;
                }
            }
        }
        return true;
    };
    return (
        <div className='client-form-overlay'>
            <div className='client-form-container'>

                <form onSubmit={(e) => handleFormContinue(e, ['id_banco', 'id_credito_cotizacion', 'tipo_cobro', 'num_cuenta', 'num_cuenta', 'tipo_cuenta', 'num_cuotas',])} className='form-content'>
                    <div>

                        <SelectBank onValueChange={(value) => handleSelectedChange('id_banco', value)} />

                    </div>
                    <div>
                        <SelectCreditValue onValueChange={(value) => handleSelectedChange('id_credito_cotizacion', value)} />
                    </div>

                    <div>
                        <label htmlFor="tipo_cobro" className="input-label">Tipo de cobro:
                            <input
                                type="text"
                                name="tipo_cobro"
                                value={formulario.tipo_cobro}
                                onChange={handleInputChange}
                            /></label>
                    </div>
                    <div>
                        <label htmlFor="num_cuenta" className="input-label">Número de cuenta:
                            <input
                                type="text"
                                id="number"
                                name="num_cuenta"
                                value={formulario.num_cuenta}
                                onChange={handleInputChange}
                            /></label>

                    </div>
                    <div>
                        <label htmlFor="tipo_cuenta" className="input-label">Tipo de cuenta:
                            <input
                                type="text"
                                name="tipo_cuenta"
                                value={formulario.tipo_cuenta}
                                onChange={handleInputChange}
                            /></label>

                    </div>
                    <div>
                        <label htmlFor="num_cuotas" className="input-label">Número de Cuotas:
                            <input
                                type="text"
                                id="number"
                                name="num_cuotas"
                                value={formulario.num_cuotas}
                                onChange={handleInputChange}
                            /></label>

                    </div>
                    <div>
                        <label htmlFor="nota_cliente" className="input-label">Comentarios:</label>
                        <textarea
                            name="nota_cliente"
                            value={formulario.nota_cliente}
                            onChange={handleInputChange}
                            rows="4"
                            cols="50"
                        />

                    </div>

                    <div className='button-container'>
                        <button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</button>

                        <button type="button" onClick={onClose}>Cerrar</button>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default SolicitedCredit;
