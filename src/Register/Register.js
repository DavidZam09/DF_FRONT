import React, { useState } from 'react';
import logo from '../logo.svg';
import { NavLink } from 'react-router-dom';
import useApiRequest from '../Request/Request';
import AlertMsg from '../Alert/Alert';
const Register = () => {
    const [formData, setFormData] = useState({
        cod_referido: '',
        email: '',
        password: '',
        num_celular: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const { apiRequest, isLoading } = useApiRequest();
    const [showAlert, setShowAlert] = useState(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setFieldErrors({
            ...fieldErrors,
            [name]: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const queryString = `cod_referido=${formData.cod_referido}&email=${formData.email}&password=${formData.password}&num_celular=${formData.num_celular}`;

        try {
            const response = await fetch(`http://localhost:3000/clientes/registrar_cliente?${queryString}`);
            const responseData = await response.json();

            if (responseData.successful) {
                console.log('Cliente registrado correctamente');
                setFieldErrors({});
                setFormData({
                    cod_referido: '',
                    email: '',
                    password: '',
                    num_celular: ''
                });
                setShowAlert(true);
            } else {
                if (responseData.errors && responseData.errors.length > 0) {
                    const errors = {};
                    responseData.errors.forEach(error => {
                        errors[error.path] = error.msg;
                    });
                    setFieldErrors(errors);
                }
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            setFieldErrors({ general: 'Error al enviar la solicitud.' });
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.logoContainer}>
                    <img src={logo} className="App-logo" style={styles.logo} alt="logo" />
                </div>
                <h2>Registrarse</h2>
                {fieldErrors.general && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorMessage}>{fieldErrors.general}</p>
                    </div>
                )}
                <div style={styles.formGroup}>
                    <label htmlFor="cod_referido">No. Referido</label>
                    <input
                        type="number"
                        id="cod_referido"
                        name="cod_referido"
                        value={formData.cod_referido}
                        placeholder="Numero de referido"
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                    {fieldErrors.cod_referido && (
                        <div style={styles.errorTooltip}>{fieldErrors.cod_referido}</div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        style={styles.input}
                        onChange={handleInputChange}
                        required
                    />
                    {fieldErrors.email && (
                        <div style={styles.errorTooltip}>{fieldErrors.email}</div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="num_celular">Número de Teléfono</label>
                    <input
                        type="tel"
                        id="num_celular"
                        name="num_celular"
                        placeholder="Número de Teléfono"
                        style={styles.input}
                        value={formData.num_celular}
                        onChange={handleInputChange}
                        className=''
                        required
                    />
                    {fieldErrors.num_celular && (
                        <div style={styles.errorTooltip}>{fieldErrors.num_celular}</div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                        style={styles.input}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    {fieldErrors.password && (
                        <div style={styles.errorTooltip}>{fieldErrors.password}</div>
                    )}
                </div>
                <p>Si tienes una cuenta, inicia sesión <NavLink to="/login">aquí</NavLink></p>
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            {showAlert && <AlertMsg
                message="Hola! Te has registrado correctamente, seras redirigido a la pestaña de inicio de sesion"
                redirectUrl="/login"
                delay={500}
            />}
        </div>

    );
};

export default Register;

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '0 20px',
    },
    form: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box',
    },
    formGroup: {
        position: 'relative',
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px',
        backgroundColor: '#03bb2b',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        margin: '0 auto',
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
    },
    logo: {
        width: '100px',
        height: 'auto',
    },
    errorContainer: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
    },
    errorMessage: {
        margin: '0',
    },
    errorTooltip: {
        position: 'absolute',
        top: '100%',
        left: '0',
        transform: 'translateY(5px)',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '5px',
        borderRadius: '4px',
        fontSize: '0.9rem',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        whiteSpace: 'nowrap',
        zIndex: '1000',
    },
};
