import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const useApiRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const apiRequest = async (url, method, body, successMessage, redirectUrl = '', delay = 5000) => {
        setIsLoading(true);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const responseData = await response.json();

            if (response.ok && (responseData.successful || responseData.data?.successful)) {
                toast.success(
                    <div>
                        <p>{successMessage}</p>
                        {redirectUrl && <button onClick={() => window.location.href = redirectUrl}>Ir a la Página</button>}
                    </div>,
                    {
                        position: 'top-center',
                        autoClose: delay,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );

                if (redirectUrl) {
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, delay);
                }

                return responseData;

            } else {
                const errorMessages = responseData.error || (responseData.errors && responseData.errors.map((error) => `${error.msg}`).join('\n')) || 'Ocurrió un error desconocido';
                toast.error(`${errorMessages}`, {
                    position: 'top-center',
                    autoClose: delay,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error('Ocurrió un error al enviar el formulario', {
                position: 'top-center',
                autoClose: delay,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const apiRequest2 = async (url, method, successMessage, redirectUrl = '', delay = 5000) => {
        setIsLoading(true);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await response.json();

            if (response.ok && (responseData.successful || responseData.data?.successful)) {
                toast.success(
                    <div>
                        <p>{successMessage}</p>
                        {redirectUrl && <button onClick={() => window.location.href = redirectUrl}>Ir a la Página</button>}
                    </div>,
                    {
                        position: 'top-center',
                        autoClose: delay,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );

                if (redirectUrl) {
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, delay);
                }

                return responseData;

            } else {
                const errorMessages = responseData.error || (responseData.errors && responseData.errors.map((error) => `${error.msg}`).join('\n')) || 'Ocurrió un error desconocido';
                toast.error(`${errorMessages}`, {
                    position: 'top-center',
                    autoClose: delay,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error('Ocurrió un error al enviar el formulario', {
                position: 'top-center',
                autoClose: delay,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const useFetchData = (url, initialState = null) => {
        const [data, setData] = useState(initialState);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get(url);
                    if (response.data && response.data.successful) {
                        setData(response.data.data);
                    } else {
                        setError(true);
                    }
                } catch (error) {
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };

            if (url) {
                fetchData();
            }
        }, [url]);

        return { data, loading, error };
    };
    const useFetchPhoto = (photoUrl) => {
        const [photoData, setPhotoData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchPhoto = async () => {
                try {
                    if (photoUrl) {
                        const response = await fetch(photoUrl);
                        if (!response.ok) {
                            throw new Error('Failed to fetch photo');
                        }
                        const blob = await response.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        setPhotoData(objectUrl);
                    }
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPhoto();

            return () => {
                // Clean up any resources (if necessary)
            };
        }, [photoUrl]);

        return { photoData, loading, error };
    };


    return { apiRequest, apiRequest2, useFetchData, useFetchPhoto, isLoading };

};



export default useApiRequest;
