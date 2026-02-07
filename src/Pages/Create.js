import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../FixedComponet/Sidebar';
import LocationInput from '../Componets/LocationInput';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../Helper/getCroppedImg';
import ConfirmationDialog from '../Componets/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import { uploadPost } from '../Service/api';
import { Image as ImageIcon, GeoAlt, XCircle } from 'react-bootstrap-icons';
import MobileTopbar from '../FixedComponet/MobileTopbar';

const Create = () => {
  const username = localStorage.getItem('username') || '';
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const locationInput = useRef(null);
  const navigate = useNavigate();

  // Google Autocomplete logic remains same
  useEffect(() => {
    if (!window.google || !locationInput.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(locationInput.current, {
      types: ['geocode'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setLocation(place.formatted_address || '');
    });
  }, [isLocationEnabled]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select an image first.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmAndUpload = async () => {
    setShowConfirm(false);
    setUploadStatus('Uploading...');
    try {
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
      const formData = new FormData();
      formData.append('file', croppedBlob, 'cropped.jpg');
      formData.append('username', username);
      formData.append('content', content);
      formData.append('location', location);

      await uploadPost(formData);
      navigate(`/profile/${username}`);
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  const resetForm = () => {
    setFile(null);
    setImageUrl('');
    setContent('');
    setLocation('');
    setUploadStatus('');
  };

  return (
    <>
    <div className="flex min-h-screen bg-gray-50">
      <MobileTopbar></MobileTopbar>
    <Sidebar />

    <main className="flex-1 lg:ml-64 p-4 lg:p-12 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Side: Image / Cropper Area */}
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-gray-100">
            {imageUrl ? (
              <div className="relative w-full h-full min-h-[300px]">
                <Cropper
                  image={imageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} 
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                />
                <button 
                  onClick={resetForm}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors z-10"
                >
                  <XCircle size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-12 text-gray-400 hover:text-blue-500 transition-colors">
                <ImageIcon size={64} className="mb-4" />
                <span className="font-semibold">Click to select a photo</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files[0];
                    if (selected) {
                      setFile(selected);
                      setImageUrl(URL.createObjectURL(selected));
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Right Side: Details Area */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-gray-800">{username}</span>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <textarea
                    className="w-full border-0 focus:ring-0 text-gray-700 text-lg resize-none"
                    placeholder="Write a caption..."
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <GeoAlt /> Add Location
                    </label>
                    <input
                      type="checkbox"
                      className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-blue-500 transition-all cursor-pointer relative"
                      checked={isLocationEnabled}
                      onChange={() => setIsLocationEnabled(!isLocationEnabled)}
                    />
                  </div>
                  
                  {isLocationEnabled && (
                    <div className="animate-fade-in">
                      <input
                        ref={locationInput}
                        type="text"
                        placeholder="Search location..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="mt-8 border-t pt-4">
              {uploadStatus && (
                <p className="text-xs text-blue-600 font-medium mb-3">{uploadStatus}</p>
              )}
              <button
                onClick={handleUpload}
                disabled={!file}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200"
              >
                Share Post
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
      {showConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
      <h3 className="text-xl font-bold mb-2">Share Post</h3>
      <p className="text-gray-500 mb-6">
        Your followers will see this on their feed. Ready?
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="flex-1 py-2 rounded-xl bg-gray-100 font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={confirmAndUpload}
          className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Share Now
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Create;