import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center transition-colors duration-200'>
      <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl max-w-lg w-full transition-all'>
        <h1 className='text-3xl font-extrabold text-slate-900 dark:text-white text-center tracking-tight mb-6'>
          User Profile
        </h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          
          {/* Avatar with Ring */}
          <div className='flex flex-col items-center mb-2'>
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt='profile'
              className='rounded-full h-24 w-24 object-cover cursor-pointer ring-4 ring-blue-500/20 hover:ring-blue-500 transition-all'
            />
            <p className='text-xs mt-2'>
              {fileUploadError ? (
                <span className='text-red-600 font-semibold'>
                  Error Image upload (image must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-slate-600 dark:text-slate-400 font-semibold'>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className='text-emerald-600 font-semibold'>Image successfully uploaded!</span>
              ) : (
                <span className='text-slate-400 dark:text-slate-500 text-[11px]'>Click image to change avatar</span>
              )}
            </p>
          </div>

          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5'>
              Username
            </label>
            <input
              type='text'
              placeholder='username'
              defaultValue={currentUser.username}
              id='username'
              className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5'>
              Email Address
            </label>
            <input
              type='email'
              placeholder='email'
              id='email'
              defaultValue={currentUser.email}
              className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5'>
              New Password
            </label>
            <input
              type='password'
              placeholder='••••••••'
              onChange={handleChange}
              id='password'
              className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <button
            disabled={loading}
            className='bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl p-3.5 font-bold uppercase text-xs tracking-wider shadow-md transition-all disabled:opacity-70 cursor-pointer mt-1'
          >
            {loading ? 'Updating...' : 'Update Account'}
          </button>

          <Link
            className='bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl uppercase text-center font-bold text-xs tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer'
            to={'/create-listing'}
          >
            + Create New Listing
          </Link>
        </form>

        <div className='flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm'>
          <span
            onClick={handleDeleteUser}
            className='text-red-500 hover:text-red-600 font-semibold cursor-pointer transition-colors'
          >
            Delete account
          </span>
          <span
            onClick={handleSignOut}
            className='text-red-500 hover:text-red-600 font-semibold cursor-pointer transition-colors'
          >
            Sign out
          </span>
        </div>

        {error && <p className='text-red-500 mt-4 text-xs font-semibold text-center'>{error}</p>}
        {updateSuccess && (
          <p className='text-emerald-600 mt-4 text-xs font-semibold text-center'>
            Profile updated successfully!
          </p>
        )}

        <button
          onClick={handleShowListings}
          className='text-blue-600 dark:text-blue-400 font-bold hover:underline w-full text-center mt-6 text-sm cursor-pointer'
        >
          Show My Listings
        </button>
        {showListingsError && (
          <p className='text-red-500 mt-3 text-xs text-center font-semibold'>
            Error showing listings
          </p>
        )}

        {/* User Listings List */}
        {userListings && userListings.length > 0 && (
          <div className='flex flex-col gap-4 mt-6'>
            <h2 className='text-center font-bold text-lg text-slate-800 dark:text-white'>
              Your Listings
            </h2>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 flex justify-between items-center gap-4 transition-all'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-cover rounded-lg'
                  />
                </Link>
                <Link
                  className='text-slate-700 dark:text-slate-200 font-semibold hover:text-blue-600 dark:hover:text-blue-400 flex-1 truncate text-sm'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors'
                    title='Delete'
                  >
                    <FaTrash className='text-xs' />
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button 
                      className='text-emerald-500 hover:text-emerald-600 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors'
                      title='Edit'
                    >
                      <FaEdit className='text-xs' />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}