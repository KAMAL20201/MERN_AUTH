import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStarts,
  deleteUserSuccess,
  signOutSuccess,
  updateUserFailure,
  updateUserStarts,
  updateUserSuccess,
} from "../redux/user/userSlice";
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },

      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        });
      }
    );
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    dispatch(updateUserStarts());
    const userId = currentUser?._id;
    try {
      const response = await fetch(
        `http://localhost:5173/api/user/update/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const deleteUser = async () => {
    try {
      dispatch(deleteUserStarts());
      const res = await fetch(
        `http://localhost:5173/api/user/delete/${currentUser?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const signOutHandler = async () => {
    try {
      await fetch("http://localhost:5173/api/auth/signout");
      dispatch(signOutSuccess());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleUpdateProfile}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="h-24 w-24 rounded-full selef-center object-cover cursor-pointer"
          src={formData?.profilePicture || currentUser?.profilePicture}
          alt="profile"
          onClick={() => inputRef?.current.click()}
        />
        <p>
          {" "}
          {imageError ? (
            <span className="text-red-700">Error Uploading Image</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span>Uploading Image {imagePercent}%</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully</span>
          ) : null}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3 w-full"
          defaultValue={currentUser?.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3 w-full"
          defaultValue={currentUser?.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3 w-full"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button className="w-full bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-85 ">
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={deleteUser}>
          Delete Account
        </span>
        <span
          className="text-black-700 cursor-pointer"
          onClick={signOutHandler}
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong"}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "Profile Updated"}
      </p>
    </div>
  );
}
