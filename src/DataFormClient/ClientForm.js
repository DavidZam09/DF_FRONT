import React, { useState, useEffect } from 'react';
import './clientForm.css';
import axios from 'axios';
import SelectDpartmetAndCity from '../selectCity/SelectCity';
import SelectDocType from '../SelectTypeDoc/SelectDocType';
import SelectActiveEco from '../AtiveEco/ActivityEcono';
import SelectSectEco from '../SelectSectEco/SelectSectorEconomic';
import CalendarForm from '../calendar/Calendar';
import CameraCapture from '../CameraCapture/cameraCapture';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ClientForm = ({ onClose }) => {
    const initialFormState = {
        id_cliente: '',
        dpto: 'Valle del Cauca',
        ciudad: 'Cali',
        id_user_tipo_doc: '',
        id_cliente_actividad_eco: '',
        id_cliente_sector_eco: '',
        nombres_cliente: '',
        apellidos_cliente: '',
        fecha_nac: '',
        direccion: '',
        num_documento: '',
        otro_sector_y_actividad: '',
        nombre_empresa_labora: '',
        ingreso_mesual: '',
        gasto_mensual: '',
        tratamiento_datos: 'SI',
        terminos_y_condiciones: 'NO',
        rf1_nombre_completo: '',
        rf1_num_celular: '',
        rf1_direccion: '',
        rf2_nombre_completo: '',
        rf2_num_celular: '',
        rf2_direccion: '',
        foto_cliente: null,
        foto_doc_frontal: null,
        foto_doc_trasera: null,
        foto_recivo_publico: null,
        foto_pago_nomina: null,
        id: '',
    };

    const navigate = useNavigate();
    const [termsContent, setTermsContent] = useState('');
    const [step, setStep] = useState(1);
    const [formulario, setFormulario] = useState(initialFormState);
    const [activityOptions, setActivityOptions] = useState(false);
    const [sectorOptions, setSectorOptions] = useState(false);
    const [errors, setErrors] = useState({});
    const [otherValue, setOtherValue] = useState('');

    useEffect(() => {
        const clientId = localStorage.getItem('id');
        if (clientId) {
            setFormulario(prevFormulario => ({
                ...prevFormulario,
                id_cliente: parseInt(clientId, 10)
            }));
        }
    }, []);

    const handleRedirect = () => {
        localStorage.clear();
        navigate('/login');
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        handleRedirect();
    };

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await fetch('/terms.txt');
                const text = await response.text();
                setTermsContent(text);
            } catch (error) {
                console.error('Error al cargar los términos y condiciones:', error);
            }
        };
        fetchTerms();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked, id } = e.target;
        let cleanValue = value.replace(/[$,.]/g, ""); // Eliminar el signo $ y las comas
        if (id === 'number') {
            if (validateFields2(name, cleanValue, id)) {
                setFormulario({
                    ...formulario,
                    [name]: type === 'checkbox' ? (checked ? 'SI' : 'NO') : cleanValue,
                });
                setErrors({ ...errors, [name]: false });
            }
        } else {
            if (id === 'direccion') {
                setFormulario({
                    ...formulario,
                    [name]: type === 'checkbox' ? (checked ? 'SI' : 'NO') : value,
                });
                setErrors({ ...errors, [name]: false });
            }
            else if (validateFields2(name, value, id)) {
                setFormulario({
                    ...formulario,
                    [name]: type === 'checkbox' ? (checked ? 'SI' : 'NO') : value,
                });
                setErrors({ ...errors, [name]: false });
            }
            else {
                setErrors({ ...errors, [name]: true });
            }
        }

    };

    const handleSelectedChange = (field, value) => {
        let otroSectorActividad = formulario.otro_sector_y_actividad;

        if (field === 'id_cliente_actividad_eco' || field === 'id_cliente_sector_eco') {

            if (field === 'id_cliente_actividad_eco' && value === '22') {
                setActivityOptions(true);
            }
            if (field === 'id_cliente_sector_eco' && value === '14') {
                setSectorOptions(true);
            }
        }
        setFormulario(prevFormulario => ({
            ...prevFormulario,
            [field]: value,
        }));
        console.log("estos son los valores: " + field + " " + value + " " + otroSectorActividad)
        setErrors({ ...errors, [field]: false });
    };

    const handleNextStep = () => setStep(step + 1);
    const handleBackStep = () => setStep(step - 1);

    const validateFields = (requiredFields) => {
        let isValid = true;
        let newErrors = { ...errors };
        for (let field of requiredFields) {
            if (!formulario[field]) {
                newErrors[field] = true;
                isValid = false;
                toast.info(`Por favor, diligencie el campo ${field.replace('_', ' ')}.`);
            } else {
                newErrors[field] = false;
            }
        }
        setErrors(newErrors);
        return isValid;
    };


    const validateFields2 = (name, value, id) => {
        let isValid = true;
        let newErrors = { ...errors };
        if (value) {
            if (id !== 'number') {
                if (/\d/.test(value)) {
                    toast.info(`El campo "${name.replace('_', ' ')}" no puede contener números.`);
                    newErrors[name] = false;
                    isValid = false;
                }
            } else {
                if (!/^\d+$/.test(value)) {
                    toast.info(`El campo "${name.replace('_', ' ')}" solo puede contener números.`);
                    newErrors[name] = true;
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormContinue = (event, requiredFields) => {
        event.preventDefault();
        if (validateFields(requiredFields)) {
            handleNextStep();
        }
    };

    const handleConfirm = async () => {
        try {
            const data = new FormData();
            Object.keys(formulario).forEach((key) => {
                data.append(key, formulario[key]);
            });
            const token = localStorage.getItem('token');

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/cliente_info/input_cliente_info`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `bearer ${token}`,
                },
            });

            const responseData = response.data;

            if (response.successful) {
                console.log('Respuesta del servicio:', responseData.data);
                toast.success('Formulario enviado correctamente');
                setFormulario(initialFormState);
                navigate('/');
            } else {
                console.error('Error en el envío del formulario:', responseData.errors);
                toast.error('Ocurrió un error al enviar el formulario: ' + responseData.errors.join(', '));
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            toast.error('Ocurrió un error al enviar el formulario');
        }
    };
    const handleCapture = (field, blob) => {
        setFormulario((prevFormulario) => ({
            ...prevFormulario,
            [field]: blob,
        }));
        console.log(blob);
    };

    const formatCurrency = (value) => {
        return "$" + Number(value).toLocaleString('es-CO');
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <form className='form-terms'>
                        <h1 className="step-title">Términos y Condiciones</h1>
                        <p>{termsContent}</p>
                        <label className={errors.terminos_y_condiciones ? 'input-invalid' : ''}>
                            <input
                                type="checkbox"
                                name="terminos_y_condiciones"
                                checked={formulario.terminos_y_condiciones === 'SI'}
                                onChange={handleInputChange}

                            />
                            He leído y acepto los términos y condiciones
                        </label>
                        <div className="button-container">
                            <button type="button" onClick={() => formulario.terminos_y_condiciones === 'SI' ? handleNextStep() : toast.info('Por favor, acepta los términos y condiciones para continuar.')}>
                                Continuar
                            </button>
                            <button type="button" onClick={handleLogout}>
                                Cerrar 
                            </button>
                        </div>
                    </form>
                );
            case 2:
                return (
                    <form onSubmit={(e) => handleFormContinue(e, ['dpto', 'ciudad', 'nombres_cliente', 'apellidos_cliente', 'num_documento', 'fecha_nac', 'id_user_tipo_doc', 'direccion'])} className='form-content'>
                        <h2 className="step-title">Datos Personales</h2>
                        <label className="input-label">
                            Nombres:
                            <input type="text" id='nombres_cliente' name="nombres_cliente" value={formulario.nombres_cliente} onChange={handleInputChange} form-content style={{ borderColor: errors['nombres_cliente'] ? 'red' : '#ccc' }} />
                        </label>
                        <label className="input-label">
                            Apellidos:
                            <input type="text" name="apellidos_cliente" id='apellidos_cliente' value={formulario.apellidos_cliente} onChange={handleInputChange} form-content style={{ borderColor: errors['apellidos_cliente'] ? 'red' : '#ccc' }} />
                        </label>
                        <SelectDpartmetAndCity
                            onDepartmentChange={(value) => handleSelectedChange('dpto', value)}
                            onCityChange={(value) => handleSelectedChange('ciudad', value)}
                            defaultDepartment={formulario.dpto}
                            defaultCity={formulario.ciudad}
                        />
                        <label className="input-label">
                            Dirección:
                            <input type="text" name="direccion" id="direccion" value={formulario.direccion} onChange={handleInputChange} style={{ borderColor: errors['direccion'] ? 'red' : '#ccc' }} />
                        </label>
                        <SelectDocType onDocChange={(value) => handleSelectedChange('id_user_tipo_doc', value)} defaultParam={formulario.id_user_tipo_doc} attribute={errors['id_user_tipo_doc'] ? 'red' : ''} />
                        <label className="input-label">
                            No. De documento:
                            <input type="text" name="num_documento" id="number" value={formulario.num_documento} onChange={handleInputChange} form-content style={{ borderColor: errors['num_documento'] ? 'red' : '#ccc' }} />
                        </label>
                        <label className="input-label">
                            Fecha de nacimiento
                            <CalendarForm onDateChange={(value) => handleSelectedChange('fecha_nac', value)} />
                        </label>
                        <div className="button-container">
                            <button type="submit">Siguiente</button>
                        </div>
                    </form>
                );
            case 3:
                return (
                    <form onSubmit={(e) => handleFormContinue(e, ['id_cliente_actividad_eco', 'id_cliente_sector_eco', 'ingreso_mesual', 'gasto_mensual', 'nombre_empresa_labora'])} className='form-content'>
                        <h2 className="step-title">Datos laborales y financieros</h2>
                        <label className="input-label">
                            Empresa:
                            <input type="text" name="nombre_empresa_labora" value={formulario.nombre_empresa_labora} onChange={handleInputChange} style={{ borderColor: errors['nombre_empresa_labora'] ? 'red' : '' }} />
                        </label>
                        <label className="input-label">
                            <SelectActiveEco onActiveEcoChange={(value) => handleSelectedChange('id_cliente_actividad_eco', value)} defaultParam={formulario.id_cliente_actividad_eco} />
                            <SelectSectEco onSectEcoChange={(value) => handleSelectedChange('id_cliente_sector_eco', value)} attribute={errors['id_cliente_sector_eco'] ? 'red' : '#ccc'} defaultParam={formulario.id_cliente_sector_eco} />
                            {sectorOptions && <input type="text" name="otro_sector_y_actividad" value={formulario.otro_sector_y_actividad} onChange={handleInputChange} style={{ borderColor: errors['otro_sector_y_actividad'] ? 'red' : '' }} />}
                        </label>
                        <label className="input-label">
                            ingresos mensuales:
                            <input type="text" id="number" name="ingreso_mesual" value={formulario.ingreso_mesual ? formatCurrency(formulario.ingreso_mesual) : ''} onChange={handleInputChange} style={{ borderColor: errors['ingreso_mesual'] ? 'red' : '#ccc' }} />
                        </label>
                        <label className="input-label">
                            gastos mensuales:
                            <input type="text" id="number" name="gasto_mensual" value={formulario.gasto_mensual ? formatCurrency(formulario.gasto_mensual) : ''} onChange={handleInputChange} style={{ borderColor: errors['gasto_mensual'] ? 'red' : '#ccc' }} />
                        </label>
                        <div className="button-container">
                            <button type="submit">Siguiente</button>
                        </div>
                    </form>
                );
            case 4:
                return (
                    <form onSubmit={(e) => handleFormContinue(e, ['rf1_nombre_completo', 'rf1_direccion', 'rf1_num_celular'])} className='form-content'>
                        <h2 className="step-title">Datos referencia 1</h2>
                        <label className="input-label">
                            Nombre completo:
                            <input type="text" name="rf1_nombre_completo" value={formulario.rf1_nombre_completo} onChange={handleInputChange} style={{ borderColor: errors['rf1_nombre_completo'] ? 'red' : '#ccc' }} />
                        </label>
                        <label className="input-label">
                            Telefono:
                            <input type="text" id="number" name="rf1_num_celular" value={formulario.rf1_num_celular} onChange={handleInputChange} style={{ borderColor: errors['rf1_num_celular'] ? 'red' : '#ccc' }} />
                        </label>
                        <label className="input-label">
                            Direccion:
                            <input type="text" name="rf1_direccion" id="direccion" value={formulario.rf1_direccion} onChange={handleInputChange} style={{ borderColor: errors['rf1_direccion'] ? 'red' : '#ccc' }} />
                        </label>
                        <div className="button-container">
                            <button type="submit">Siguiente</button>
                        </div>
                    </form>
                );
            case 5:
                return (
                    <form onSubmit={(e) => handleFormContinue(e, ['rf2_nombre_completo', 'rf2_direccion', 'rf2_num_celular'])} className='form-content'>
                        <h2 className="step-title">Datos referencia 2</h2>
                        <label className="input-label">
                            Nombre completo:
                            <input type="text" name="rf2_nombre_completo" value={formulario.rf2_nombre_completo} onChange={handleInputChange} style={{ borderColor: errors['rf2_nombre_completo'] ? 'red' : '#ccc' }} />
                        </label>
                        <label className="input-label">
                            Telefono:
                            <input type="text" name="rf2_num_celular" id="number" value={formulario.rf2_num_celular} onChange={handleInputChange} style={{ borderColor: errors['rf2_num_celular'] ? 'red' : '#ccc' }} />
                        </label>
                        <label className="input-label">
                            Direccion:
                            <input type="text" name="rf2_direccion" id="direccion" value={formulario.rf2_direccion} onChange={handleInputChange} style={{ borderColor: errors['rf2_direccion'] ? 'red' : '#ccc' }} />
                        </label>
                        <div className="button-container">
                            <button type="submit">Siguiente</button>
                        </div>
                    </form>
                );
            case 6:
                return (
                    <div>
                        <h2 className="step-title">Foto del cliente</h2>
                        <CameraCapture onCapture={(blob) => handleCapture('foto_cliente', blob)} onNext={handleNextStep} />
                    </div>
                );
            case 7:
                return (
                    <div>
                        <h2 className="step-title">Foto frontal documento de identidad </h2>
                        <CameraCapture onCapture={(blob) => handleCapture('foto_doc_frontal', blob)} onNext={handleNextStep} />

                    </div>
                );
            case 8:
                return (
                    <div>
                        <h2 className="step-title">Foto trasera documento de identidad </h2>
                        <CameraCapture onCapture={(blob) => handleCapture('foto_doc_trasera', blob)} onNext={handleNextStep} />
                    </div>
                );

            case 9:
                return (
                    <div>
                        <h2 className="step-title">Foto Documento recibo publico</h2>
                        <CameraCapture onCapture={(blob) => handleCapture('foto_recivo_publico', blob)} onNext={handleNextStep} />

                    </div>
                );
            case 10:
                return (
                    <div>
                        <h2 className="step-title">Foto soporte pago de nomina</h2>

                        <CameraCapture onCapture={(blob) => handleCapture('foto_pago_nomina', blob)} onNext={handleNextStep} />
                    </div>
                );
            case 11:
                return (
                    <div>
                        <h2 className="step-title">Confirmar y Enviar</h2>
                        <div className="button-container">
                            <button type="button" onClick={handleConfirm}>Enviar</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Datos Adicionales Requeridos</h2>
                </div>
                {renderStepContent()}
                {step > 1 && (
                    <div className="button-container">
                        <button type="button" onClick={handleBackStep}>Atrás</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClientForm;
