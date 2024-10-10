import  { useState, useEffect } from "react";
import { api } from "../utilities";
import { useNavigate } from "react-router-dom";

export default function Tenant() {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    username: "",
    role: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("user/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        if (response.data.role !== "tenant") {
          navigate("/");
        }
        setUserInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        navigate("/login/");
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleEdit = () => {
    setEditMode(true);
    setError("");
  };

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const updatedInfo = {
      ...userInfo,
      username: userInfo.email,
      ...(newPassword && { password: newPassword }),
    };

    try {
      const response = await api.put("user/", updatedInfo, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      setEditMode(false);
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">
            Welcome to inHome, {userInfo.first_name}!
          </h2>
          <p className="text-sm text-base-content/70 mb-6">
            Manage your tenant account details below
          </p>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(userInfo).map(([key, value]) => {
              if (key === "password" || key === "role" || key === "username") return null;
              return (
                <div key={key} className="form-control">
                  <label className="label">
                    <span className="label-text">{key.replace("_", " ").toUpperCase()}</span>
                  </label>
                  {editMode ? (
                    <input
                      type={key === "email" ? "email" : "text"}
                      id={key}
                      value={value}
                      onChange={handleChange}
                      className="input input-bordered"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      className="input input-bordered"
                      disabled
                    />
                  )}
                </div>
              );
            })}
          </div>

          {editMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">NEW PASSWORD</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered"
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">CONFIRM NEW PASSWORD</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="input input-bordered"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          <div className="card-actions justify-end mt-6">
            {editMode ? (
              <>
                <button onClick={() => setEditMode(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={handleEdit} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}