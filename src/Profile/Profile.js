import React, { useState, useEffect } from 'react';
import './profile.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApiRequest from '../Request/Request';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import CameraCapture from '../CameraCapture/cameraCapture'; // Assume you have this component
import axios from 'axios';

const Profile = ({ onClose }) => {
  const { useFetchData, useFetchPhoto, apiRequest } = useApiRequest();
  const [id, setId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);
  const [documentType, setDocumentType] = useState(null);
  const [step, setStep] = useState(1);
  const [editingField, setEditingField] = useState(null);
  const [codPersonal, setCodPersonal] = useState('');
  const [status, setStatus] = useState('');
  const [enable, setEnable] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalClientData, setOriginalClientData] = useState(null);

  useEffect(() => {
    const clientId = localStorage.getItem('id');
    const codClient = localStorage.getItem('cod_personal');
    const statusClient = localStorage.getItem('id_cliente_tipo');
    if (clientId) setId(clientId);
    if (codClient) setCodPersonal(codClient);
    if (statusClient) setStatus(statusClient);
    console.log(statusClient);
  }, []);

  const { data: client, loading: clientLoading, error: clientError } = useFetchData(
    id ? `${process.env.REACT_APP_BACKEND_SERVER}/cliente_info/lista_cliente_infoxcliente?id=${id}` : null
  );
  const photoUrl = `${process.env.REACT_APP_BACKEND_SERVER}/documento/get_doc?doc=${client?.[0]?.foto_cliente}`;
  const { photoData, loading: photoLoading, error: photoError } = useFetchPhoto(photoUrl);
  const handleCapture = (field, blob) => {
    setClientData((prevData) => ({
      ...prevData,
      [field]: blob,
    }));
    console.log(blob);

  };
  useEffect(() => {
    if (JSON.stringify(clientData) !== JSON.stringify(originalClientData)) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [clientData, originalClientData]);

  useEffect(() => {
    if (client && client.length > 0) {
      setClientData(client[0]);
      setOriginalClientData(client[0]);

    }

  }, [client]);

  useEffect(() => {
    if (status === '4') {
      setEnable(true);

    }
    console.log(status)
  }, [status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    try {
      const data = new FormData();
      Object.keys(clientData).forEach((key) => {
        data.append(key, clientData[key]);
      });

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/cliente_info/input_cliente_info`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = response.data;

      if (responseData.successful) {
        console.log('Respuesta del servicio:', responseData.data);
        toast.success('Formulario enviado correctamente');
        setOriginalClientData(clientData);
      } else {
        console.error('Error en el envío del formulario:', responseData.errors);
        toast.error('Ocurrió un error al enviar el formulario: ' + responseData.errors.join(', '));
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast.error('Ocurrió un error al enviar el formulario');
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  if (clientLoading) {
    return <p>Cargando datos...</p>;
  }

  if (clientError) {
    toast.error('Hubo un problema al obtener los datos del cliente.');
    return null;
  }

  if (!clientData) {
    return <p>No se encontraron datos del cliente.</p>;
  }
  const handleEditDocuments = (documentType) => {
    setIsEditingDocuments(true);
    setDocumentType(step);
  };
  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handPictureOptions = (field, name) => {
    if (field === 'subir') {
      return (
        <div className="field-container">
          <input
            type="text"
            name={name}
            onChange={handleInputChange}
          />
        </div>
      );
    } else {
      return (
        <div className="field-container">
          <input
            type="text"
            name={name}
            onChange={handleInputChange}
          />
        </div>
      );
    }
  };
  const handleNextStep = () => setStep(step + 1);
  const handleBackStep = () => setStep(step - 1);
  const renderField = (fieldName, fieldValue) => {
    if (editingField === fieldName) {
      return (
        <div className="field-container">
          <input
            type="text"
            name={fieldName}
            value={fieldValue}
            onChange={handleInputChange}
          />
        </div>
      );
    } else {
      return (
        <div className="field-container">
          {fieldValue}
          {enable && (
            <button className="edit-button" onClick={() => handleEditField(fieldName)}>
              &#9998;
            </button>
          )}
        </div>
      );
    }
  };

  const renderDocumentCapture = (documentType) => {
    switch (documentType) {
      case 1:
        return (
          <div>
            <h2 className="step-title">Foto del cliente</h2>
            <CameraCapture onCapture={(blob) => handleCapture('foto_cliente', blob)} onNext={handleNextStep} />
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="step-title">Foto frontal documento de identidad</h2>
            <CameraCapture onCapture={(blob) => handleCapture('foto_doc_frontal', blob)} onNext={handleNextStep} />
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="step-title">Foto trasera documento de identidad</h2>
            <CameraCapture onCapture={(blob) => handleCapture('foto_doc_trasera', blob)} onNext={handleNextStep} />
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="step-title">Foto Documento recibo público</h2>
            <CameraCapture onCapture={(blob) => handleCapture('foto_recivo_publico', blob)} onNext={handleNextStep} />
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="step-title">Foto soporte pago de nómina</h2>
            <CameraCapture onCapture={(blob) => handleCapture('foto_pago_nomina', blob)} onNext={handleNextStep} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="profile-container">
        <h2>Perfil</h2>
        <div className="photo-section">
          {photoData && !photoLoading && (
            <img src={photoData} alt="Foto del cliente" className="client-photo" />
          )}

        </div>
        <div className="profile-details">

          <div className="profile-section">
            <p >

              <strong>Codigo Personal:</strong>
              {codPersonal}
            </p>
            <p >
              <strong>Nombres:</strong>
              {renderField('nombres_cliente', `${clientData.nombres_cliente}`)}
            </p>
            <p >
              <strong>Apellidos:</strong>
              {renderField('apellidos_cliente', `${clientData.apellidos_cliente}`)}
            </p>
            <p>
              <strong>Documento:</strong>
              {renderField('num_documento', clientData.num_documento)}
            </p>
            <p>
              <strong>Fecha de Nacimiento:</strong>
              {renderField('fecha_nac', formatDate(clientData.fecha_nac))}
            </p>
            <p>
              <strong>Correo Electrónico:</strong>
              {renderField('email', clientData.email)}
            </p>
            <p>
              <strong>Teléfono:</strong>
              {renderField('num_celular', clientData.num_celular)}
            </p>
          </div>
          <div className="profile-section">
            <h3>Información de Dirección</h3>
            <p>
              <strong>Departamento:</strong>
              {renderField('dpto', clientData.dpto)}
            </p>
            <p>
              <strong>Ciudad:</strong>
              {renderField('ciudad', clientData.ciudad)}
            </p>
            <p>
              <strong>Dirección:</strong>
              {renderField('direccion', clientData.direccion)}
            </p>
          </div>
          <div className="profile-section">
            <h3>Información Económica</h3>
            <p>
              <strong>Ingreso Mensual:</strong>
              {renderField('ingreso_mesual', formatCurrency(clientData.ingreso_mesual))}
            </p>
            <p>
              <strong>Gasto Mensual:</strong>
              {renderField('gasto_mensual', formatCurrency(clientData.gasto_mensual))}
            </p>
            <p>
              <strong>Actividad Económica:</strong>
              {renderField('nombre_actividad_eco', clientData.nombre_actividad_eco)}
            </p>
            <p>
              <strong>Sector Económico:</strong>
              {renderField('nombre_sector_eco', clientData.nombre_sector_eco)}
            </p>
          </div>
          <div className="profile-section">
            <h3>Referencias</h3>
            <p>
              <strong>Referencia 1:</strong>
              {renderField('rf1_nombre_completo', `${clientData.rf1_nombre_completo}`)}
            </p>
            <p>
              {renderField('rf1_num_celular', ` ${clientData.rf1_num_celular}`)}
            </p>
            <p>
              {renderField('rf1_direccion', `${clientData.rf1_direccion}`)}
            </p>
            <p>
              <strong>Referencia 2:</strong>
              {renderField('rf2_nombre_completo', `${clientData.rf2_nombre_completo}`)}
            </p>
            <p>
              {renderField('rf2_num_celular', ` ${clientData.rf2_num_celular}`)}
            </p>
            <p>
              {renderField('rf2_direccion', ` ${clientData.rf2_direccion}`)}
            </p>
          </div>
        </div>
        <div className="profile-section">
          <div className="button-container">
            {hasChanges && (<button type="button" onClick={handleConfirm}>Guardar</button>)}
            <button type="button" onClick={onClose}>Cerrar</button>
            {enable && (
              <button type="button" onClick={handleEditDocuments}>Editar Documentos</button>
            )}
          </div>
        </div>
      </div>
      {isEditingDocuments && (
        <div className="modal-overlay2">
          <div className="modal">
            <h2>Editar Documentos</h2>
            {renderDocumentCapture(step)}
            <button onClick={() => setIsEditingDocuments(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
