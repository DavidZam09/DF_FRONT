import React, { useRef, useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const CameraCapture = ({ onCapture, onNext }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const compressedBlob = await compressImage(blob);
      const namedFile = new File([compressedBlob], 'image.png', { type: 'image/png' });
      onCapture(namedFile);
      setPreviewUrl(URL.createObjectURL(namedFile));
      stopCamera();
    }, 'image/png', 0.95);
  };

  const compressImage = async (imageBlob) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      return await imageCompression(imageBlob, options);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setIsCameraOn(false);
  };

  const handleNext = () => {
    setPreviewUrl(null); // Limpiar la imagen capturada
    onNext(); // Llama a la función onNext del padre para avanzar al siguiente paso
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        stopCamera();
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Captured"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        )}
      </div>
      {!isCameraOn && <button onClick={startCamera} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '8px', background: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>Start Camera</button>}
      {isCameraOn && <button onClick={capturePhoto} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '8px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>Capture Photo</button>}
      {previewUrl && <button onClick={handleNext} style={{ marginTop: '10px', marginLeft: '40%',padding: '8px 16px', borderRadius: '8px', background: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>Siguiente</button>}
    </div>
  );
};

export default CameraCapture;
