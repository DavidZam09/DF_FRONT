import React, { useState } from 'react';
import logo from '../logo.svg'
import { NavLink, useNavigate } from 'react-router-dom';
const UpdatePayment = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    /*const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/clientes/login_cliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.errors && data.errors.length > 0) {
                    setErrorMessages(data.errors);
                    setModalIsOpen(true);
                } else {
                    console.log('Cliente registrado correctamente');
                    const { token, cliente } = data;
                    localStorage.setItem('id', cliente.id.toString());
                    localStorage.setItem('token', token);
                    setToken(token);
                    setUser(cliente);
                    setErrorMessages([]);
                    if (token === '') {
                        navigate('/login');
                    } else { navigate('/'); };

                }
            } else {
                throw new Error('Error al hacer la solicitud: ' + response.status)
            }
        } catch (error) {
            console.error('Error al enviar la solicitud POST:', error);
        }
    };
    const closeModal = () => {
        setModalIsOpen(false);
    };
    return (
        <div style={styles.container} className='container'>
            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.logo}>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <h2 style={styles.logo}>Iniciar sesion</h2>
                <div style={styles.formGroup}>

                    <input type="text"
                        name="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required />
                </div>
                <div style={styles.formGroup}>
                    <input type="password"
                        name="password"
                        placeholder='Contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required />
                </div>
                <div className='passreset'>
                    <NavLink to="/register"><a>¿Olvidaste tu Contraseña?</a></NavLink>
                </div>
                <p>Si no tienes una cuenta, registrate gratis  <NavLink to="/register"><a>aqui</a></NavLink></p>
                <button type="submit" style={styles.button}>Ingresar</button>
            </form>
            <Modal
                isOpen={modalIsOpen}
                onClose={closeModal}
                errors={errorMessages}
            />
        </div>
    );
};

export default UpdatePayment;

