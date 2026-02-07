import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../Helper/getCroppedImg';
import { Button } from 'react-bootstrap';

const ImageUploader = ({ file, imageUrl, onComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
      onComplete(croppedBlob);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, imageUrl, onComplete]);

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center z-3">
      {/* Container for cropper and buttons side by side */}
      <div className="d-flex align-items-start">
        
        {/* Cropper Modal */}
        <div style={{ width: 400, height: 400, position: 'relative', background: '#fff', padding: 10, borderRadius: 10 }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
  
        {/* Buttons beside modal */}
        <div className="d-flex flex-column ms-4">
          <Button variant="secondary" onClick={onCancel} className="mb-2">Cancel</Button>
          <Button onClick={showCroppedImage}>Crop & Save</Button>
        </div>
      </div>
    </div>
  );
  }  

export default ImageUploader;
