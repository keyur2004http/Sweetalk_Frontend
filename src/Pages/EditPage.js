import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProfile } from '../Service/api';
import ImageUploader from '../Componets/ImageUploader';
import { CameraFill, ArrowLeft } from 'react-bootstrap-icons';
import { useEffect } from 'react';
function EditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  const [name, setName] = useState(profile?.name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [firstname, setFirstname] = useState(profile?.firstname || '');
  const [lastname, setLastname] = useState(profile?.lastname || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isPublic, setIsPublic] = useState(true);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(`${profile?.profilePic}`);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
  if (profile) {
    const publicStatus = 
      profile.public === true || 
      profile.isPublic === true || 
      profile.public === 1 || 
      profile.isPublic === 1;

    setIsPublic(publicStatus);
  }
}, [profile]);
  const handleCroppedImage = (croppedBlob) => {
    const file = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
    setProfilePicFile(file);
    setPreviewImage(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("bio", bio);
    formData.append("isPublic", isPublic);
    if (profilePicFile) {
      formData.append("profilePic", profilePicFile);
    }
    try {
      await updateProfile(profile.userId, formData);
      navigate(`/profile/${username}`);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft /> <span className="text-sm font-semibold">Back to Profile</span>
        </button>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative group">
                {/* Profile Image */}
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-200 group-hover:brightness-75"
                />
                {/* Overlay */}
                <label
                  htmlFor="profileImageInput"
                  className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <div className="bg-black/60 p-3 rounded-full text-white flex items-center justify-center">
                    <CameraFill size={22} />
                  </div>
                </label>
                {/* Hidden Input */}
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const imageUrl = URL.createObjectURL(file);
                    setShowCropper({ file, imageUrl });
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("profileImageInput")?.click()}
                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Change profile photo
              </button>
            </div>
            {showCropper && (
              <ImageUploader
                file={showCropper.file}
                imageUrl={showCropper.imageUrl}
                onComplete={handleCroppedImage}
                onCancel={() => setShowCropper(false)}
              />
            )}
            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">First Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">Last Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">Username</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">Bio</label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {isPublic ? "Public Account" : "Private Account"}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    {isPublic
                      ? "Anyone can see your posts."
                      : "Only approved followers can see your posts."}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:border after:rounded-full after:h-5 after:w-5
      after:transition-all peer-checked:after:translate-x-full">
                  </div>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default EditPage;