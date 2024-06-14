import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlertMsg = ({ message, redirectUrl, delay }) => {
    useEffect(() => {
        const timer = redirectUrl ? setTimeout(() => {
            window.location.href = redirectUrl;
        }, delay) : null;

        toast.info(
            <div>
                <p>{message}</p>
                {redirectUrl && <button onClick={() => window.location.href = redirectUrl}>Ir a la Página</button>}
            </div>,
            {
                position: 'top-center',
                autoClose: delay,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            }
        );

    }, [message, redirectUrl, delay]);

    return null; // No render content directly
};

export default AlertMsg;
