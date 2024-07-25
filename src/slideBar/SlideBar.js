import React, { useState, useEffect } from 'react';
import Sidebar from 'react-sidebar';
import { useNavigate } from 'react-router-dom';
import AlertMsg from '../Alert/Alert';
import { FaMoneyCheckDollar } from "react-icons/fa6";
import './SideBar.css';
import { FaBars, FaHome, FaHistory } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import ClientForm from '../DataFormClient/ClientForm';
import logo from '../logo.svg';
import axios from 'axios';
import CreditQuote from '../CreditQuote/CreditQuote';
import SolicitedCredit from '../CreditSolicitation/Credit';
import { MdRequestQuote } from "react-icons/md";
import CreditHistory from '../CreditHistory/CHistory';
import { CgProfile } from "react-icons/cg";
import Profile from '../Profile/Profile';
import LoadingComponent from '../progresComponent/loading';
import { toast } from 'react-toastify';
const SidebarMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [clientExists, setClientExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [nameStatus, setNameStatus] = useState('');
    const [validateStatus, setValidatestatus] = useState(false);
    const [toastShown, setToastShown] = useState(false);
    const navigate = useNavigate();

    const isUserAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };
    useEffect(() => {
        const statusClient = localStorage.getItem('id_cliente_tipo');

        const nameStatusClient = localStorage.getItem('nombre_tipo_cliente');
        if (statusClient) setStatus(statusClient);
        if (nameStatusClient) setNameStatus(nameStatusClient);


    }, []);

    useEffect(() => {
        if (status === '4' && !toastShown) {
            setValidatestatus(true);
            setToastShown(true);
            toast.warn('Tus datos no han sido aprobados, por favor valida la nota del administrador y corrige los datos correspondientes');
        }
    }, [status, toastShown]);

    useEffect(() => {
        if (isUserAuthenticated) {
            const handleBeforeUnload = (event) => {
                event.preventDefault();
                localStorage.clear();
                event.returnValue = '';
                return '';
            };
            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
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

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleButtonClick = (label) => {
        setActiveTab(label);
        setIsOpen(false);
    };

    useEffect(() => {
        const checkClientExists = async () => {
            setLoading(true);
            try {
                const clientId = localStorage.getItem('id');
                const getToken = localStorage.getItem('token');
                console.log("ID Y TOKEN " + clientId + " " + getToken);
                if (clientId) {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/cliente_info/lista_cliente_infoxcliente?id=${clientId}`, {
                        headers: {
                            'Authorization': `Bearer ${getToken}`,
                        },
                    });

                    // Verifica si la respuesta tiene la propiedad successful
                    if (response.data && response.data.successful !== undefined) {
                        setClientExists(response.data.successful);
                    } else {
                        setClientExists(false);
                    }
                }
            } catch (error) {
                console.error('Error al verificar la existencia del cliente:', error);
                alert('Error al verificar la existencia del cliente');
                setClientExists(false); // Manejar el estado de clientExists en caso de error
            } finally {
                setLoading(false);
            }
        };
        checkClientExists();
    }, []);



    const getContent = () => {
        switch (activeTab) {
            case 'Inicio':
                return '';
            case 'Datos Para credito':
                return <CreditHistory onClose={() => setActiveTab('')} />;
            case 'Solicitation':
                return <SolicitedCredit />;
            case 'Credit':
                return <CreditQuote onClose={() => setActiveTab('')} />;
            case 'Perfil':
                return <Profile onClose={() => setActiveTab('')} />;
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'Inicio':
                return 'Inicio';
            case 'Datos Para credito':
                return 'Historial de Creditos';
            case 'Solicitation':
                return 'Solicitar Credito';
            case 'Credit':
                return 'Cotizar Credito';
            case 'Perfil':
                return '';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p><LoadingComponent /></p>
            </div>
        );
    }

    if (!clientExists && status) {
        return (
            <div className='content'>
                <ClientForm />
            </div>
        );
    }



    return (
        <div className='app-container'>
            <header className='App-header'>
                {isUserAuthenticated() ? (
                    <Sidebar
                        sidebar={
                            <div className="sidebar-content">
                                <div className='logoContainer'>
                                    <img src={logo} className="logo" alt="logo" />
                                </div>
                                <div className="menu">
                                    <SidebarButton icon={<FaHome color="#03bb2b" />} label="Inicio" onClick={() => handleButtonClick('Inicio')} />
                                    <SidebarButton icon={<FaMoneyCheckDollar color="#03bb2b" />} label="Solicitar credito" onClick={() => handleButtonClick('Solicitation')} />
                                    <SidebarButton icon={<MdRequestQuote color="#03bb2b" />} label="Cotizar credito" onClick={() => handleButtonClick('Credit')} />
                                    <SidebarButton icon={<FaHistory color="#03bb2b" />} label="Historial de Creditos" onClick={() => handleButtonClick('Datos Para credito')} />
                                    <SidebarButton icon={<CgProfile color="#03bb2b" />} label="Perfil" onClick={() => handleButtonClick('Perfil')} />
                                    <SidebarButton icon={<IoIosLogOut color="#03bb2b" />} label="Cerrar sesión" onClick={handleLogout} />
                                </div>
                            </div>
                        }
                        open={isOpen}
                        onSetOpen={toggleSidebar}
                        styles={{ sidebar: { background: '#FFFFFF', width: '250px' } }}
                    >
                        <div className="menu-toggle" onClick={toggleSidebar}>
                            <FaBars size={30} color="#FFFFFF" />
                        </div>
                    </Sidebar>
                ) : (
                    <AlertMsg
                        message="Hola! No tienes una sesión activa. Serás redirigido a la página de inicio de sesión en unos segundos."
                        redirectUrl="/login"
                        delay={5000}
                    />
                )}
            </header>
            <main className='main'>
                {activeTab && <h1 className="page-title">{getTitle()}</h1>}
                {getContent()}
            </main>
        </div>
    );
};

const SidebarButton = ({ icon, label, onClick }) => {
    return (
        <div className="sidebar-button" onClick={onClick}>
            <div className="button-icon">{icon}</div>
            <div className="button-label">{label}</div>
        </div>
    );
};

export default SidebarMenu;
