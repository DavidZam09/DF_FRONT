import React, { useState } from 'react';
import logo from '../logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import './Login.css';
import useApiRequest from '../Request/Request';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { apiRequest, isLoading } = useApiRequest();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleConfirm = async (event) => {
        event.preventDefault();
        const url = 'http://localhost:3000/clientes/login_cliente';
        const method = 'POST';
        const body = { email, password };
        const successMessage = 'Hola! Bienvenido';

        const result = await apiRequest(url, method, body, successMessage, '', 4000);
        if (result && result.successful) {
            const { token, cliente } = result;
            localStorage.setItem('id', cliente.id.toString());
            localStorage.setItem('id_cliente_tipo', cliente.id_cliente_tipo.toString());
            localStorage.setItem('cod_personal', cliente.cod_personal.toString());
            localStorage.setItem('nombre_tipo_cliente', cliente.nombre_tipo_cliente.toString());
            localStorage.setItem('token', token);
            setToken(token);
            setUser(cliente);
            console.log(cliente);
            setPassword('');
            setEmail('');
            navigate('/');
        }
    };

    return (
        <div style={styles.container} className='container'>
            <form style={styles.form} onSubmit={handleConfirm}>
                <div style={styles.logoContainer}>
                    <img src={logo} className="App-logo" style={styles.logo} alt="logo" />
                </div>
                <h2>Iniciar sesión</h2>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        name="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="password"
                        name="password"
                        placeholder='Contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div className='passreset'>
                    <NavLink to="/resetPassword"><a>¿Olvidaste tu Contraseña?</a></NavLink>
                </div>
                <p>Si no tienes una cuenta, regístrate gratis <NavLink to="/register"><a>aquí</a></NavLink></p>
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
};

export default Login;

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
        width: '100px', // Adjust the width of the logo
        height: 'auto', // Maintain aspect ratio
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
};
