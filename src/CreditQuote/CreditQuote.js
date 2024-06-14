import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectCreditValue from '../SelectValueCredit/ValueCredit';
import './CreditQuote.css';
import AlertMsg from '../Alert/Alert';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CreditQuote = ({ onClose }) => {
    const [formulario, setFormulario] = useState({
        id: '',
        numCuotas: '',
        fecDesembolso: '',

    })
    const [creditData, setCreditData] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [viewQuote, setviewQuote] = useState(true);

    const handleSelectedChange = (value) => {
        setFormulario({
            ...formulario,
            id: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const queryString = `id=${formulario.id}&num_cuotas=${formulario.numCuotas}&fec_desembolso=${formulario.fecDesembolso}`;

        try {
            const response = await axios.get(`http://localhost:3000/creditos/cotizacion_credito?${queryString}`);
            if (response.data && response.data.successful) {
                setCreditData(response.data.data);
                setShowAlert(false);
                setviewQuote(false);
            } else {
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error fetching credit data:', error);
            setShowAlert(true);
        }
    };
    const handleopenview = () => {
        setviewQuote(true);
    }
    function formatCurrency(value) {
        // Formatea el valor con el signo de pesos y separadores de miles
        return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const handleInputChange = (e) => {
        const { name, value, id } = e.target;
        let cleanValue = value.replace(/[$,.]/g, ""); // Eliminar el signo $ y las comas
        if (id === 'number') {
            if (validateFields2(name, cleanValue, id)) {
                setFormulario({
                    ...formulario,
                    [name]: cleanValue,
                });
            }
        } else {
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
                    toast.info(`El campo "${name.replace('numCuotas', 'Número de Cuotas')}" no puede contener números.`, {
                        progressClassName: 'toast-info-custom' // Agrega una clase personalizada
                    });
                    return false;
                }
            } else {
                if (!/^\d+$/.test(value)) {
                    toast.info(`El campo "${name.replace('numCuotas', 'Número de Cuotas')}" solo puede contener números.`);
                    return false;
                }
            }
        }
        return true;
    };

    if (viewQuote) {
        return (
            <div className='client-form-overlay'>
                <div className='client-form-container'>

                    <h2>Cotización de credito</h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="numCuotas" className="input-label">Número de Cuotas:
                                <input
                                    type="text"
                                    id="number"
                                    name="numCuotas"
                                    value={formulario.numCuotas}
                                    onChange={handleInputChange}
                                /></label>

                        </div>
                        <div>
                            <label htmlFor="fecDesembolso" className="input-label">Fecha de Desembolso:
                                <input
                                    type="date"
                                    id="fecDesembolso"
                                    name="fecDesembolso"
                                    value={formulario.fecDesembolso}
                                    onChange={handleInputChange}
                                /></label>

                        </div>
                        <div>
                            <SelectCreditValue onValueChange={handleSelectedChange} defaultParam={formulario.id}/>
                        </div>
                        <div className='button-container'>
                            <button type="submit">Enviar</button>
                            <button type="button" onClick={onClose}>Cerrar</button>
                        </div>
                    </form>

                </div>
            </div>
        );
    }
    return (<div className='data-window'>
        {showAlert && <AlertMsg message="Hubo un problema al obtener los datos del crédito." />}
        {creditData && (
            <div >
                <h2>Cotizacion de Crédito</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Valor del Préstamo</th>
                            <td>{formatCurrency(creditData.valor_prestamo)}</td>
                        </tr>
                        <tr>
                            <th>Interés</th>
                            <td>{formatCurrency(creditData.interes)}</td>
                        </tr>
                        <tr>
                            <th>Interés por Mora</th>
                            <td>{formatCurrency(creditData.interes_mora)}</td>
                        </tr>
                        <tr>
                            <th>Total Pagado</th>
                            <td>{formatCurrency(creditData.total_pagado)}</td>
                        </tr>
                        <tr>
                            <th>Número de Cuotas</th>
                            <td>{creditData.num_cuotas}</td>
                        </tr>
                        <tr>
                            <th>Fecha de Desembolso</th>
                            <td>{new Date(creditData.fecha_desembolso).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <th>Frecuencia de Cobro</th>
                            <td>{creditData.frecuencia_cobro}</td>
                        </tr>
                    </tbody>
                </table>
                <h3>Cuotas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Monto</th>
                            <th>Interés</th>
                            <th>Subtotal</th>
                            <th>Fecha de Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditData.cuotas.map((cuota, index) => (
                            <tr key={index}>
                                <td>{cuota.n_cuota}</td>
                                <td>{formatCurrency(cuota.cuota)}</td>
                                <td>{formatCurrency(cuota.interes)}</td>
                                <td>{formatCurrency(cuota.subtotal)}</td>
                                <td>{new Date(cuota.fecha_pago_cuota).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='button-container'>
                    <button type="button" onClick={handleopenview}>Atrás</button>
                </div>
            </div>

        )}
    </div>);

};

export default CreditQuote;
