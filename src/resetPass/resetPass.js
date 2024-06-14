import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useApiRequest from '../Request/Request';
import logo from '../logo.svg';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_repeat: '',
        code: ''
    });
    const [verificationMessage, setVerificationMessage] = useState('');
    const { apiRequest, apiRequest2, isLoading } = useApiRequest();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const handleEmailVerification = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/clientes/val_correo_cliente?email=${email}`;
        const method = 'GET';
        const successMessage = "Se ha generado y enviado el codigo al correo del cliente"

        const result = await apiRequest2(url, method, successMessage);
        if (result && result.successful) {
            setVerificationMessage(result.data);
            setIsEmailVerified(true);
            setFormData({
                ...formData,
                email: email
            });
        } else {
            setIsEmailVerified(false);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        // Verificar si las contraseñas coinciden
        if (formData.password !== formData.password_repeat) {
            setFieldErrors({ password_repeat: 'Las contraseñas no coinciden' });
            console.log("'Las contraseñas no coinciden'")
            toast.error('Las contraseñas no coinciden');
            return;
        }

        const url = 'http://localhost:3000/clientes/cambio_pass';
        const method = 'POST';
        const body = formData;
        const successMessage = "Se cambio la contraseña para el usuario"

        try {
            const result = await apiRequest(url, method, body, successMessage);
            if (result && result.successful) {
                setFormData({
                    cod_referido: '',
                    email: '',
                    password: '',
                    num_celular: ''
                });
                setShowAlert(true);
                setFieldErrors({});
            } else {
                if (result && result.errors && result.errors.length > 0) {
                    const errors = {};
                    result.errors.forEach(error => {
                        errors[error.path] = error.msg;
                    });
                    setFieldErrors(errors);
                } else {
                    setFieldErrors({ general: 'Error al cambiar la contraseña' });
                }
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);

            setFieldErrors({ general: 'Ocurrió un error al procesar la solicitud.' });
        }
    };

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
    return (
        <div style={styles.container} className='container'>
            <form style={styles.form} onSubmit={isEmailVerified ? handleChangePassword : handleEmailVerification}>
                <div style={styles.logoContainer}>
                    <img src={logo} className="App-logo" style={styles.logo} alt="logo" />
                </div>
                <h2>Cambiar Contraseña</h2>
                {!isEmailVerified && (
                    <div style={styles.formGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder='Correo Electrónico'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                )}
                {isEmailVerified && (
                    <>
                        <div style={styles.formGroup}>
                            <p>Correo electrónico: {email}</p>
                            {fieldErrors.general && (
                                <div style={styles.errorContainer}>
                                    <p style={styles.errorMessage}>{fieldErrors.general}</p>
                                </div>
                            )}
                            <input
                                type="text"
                                name="email"
                                placeholder='Código de Verificación'
                                value={email}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                                hidden
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <input
                                type="text"
                                name="code"
                                placeholder='Código de Verificación'
                                value={formData.code}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        {fieldErrors.code && (
                            <div style={styles.errorTooltip}>{fieldErrors.code}</div>
                        )}
                        <div style={styles.formGroup}>
                            <input
                                type="password"
                                name="password"
                                placeholder='Contraseña Nueva'
                                value={formData.password}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        {fieldErrors.password && (
                            <div style={styles.errorTooltip}>{fieldErrors.codpassworde}</div>
                        )}
                        <div style={styles.formGroup}>
                            <input
                                type="password"
                                name="password_repeat"
                                placeholder='Confirmar Contraseña'
                                value={formData.password_repeat}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                            {fieldErrors.password_repeat && (
                                <div style={styles.errorTooltip}>{fieldErrors.password_repeat}</div>
                            )}
                        </div>
                    </>
                )}
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
                <div className='passreset'>
                    <NavLink to="/login"><a>Volver al inicio de sesión</a></NavLink>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;

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
        height: 'auto'
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
