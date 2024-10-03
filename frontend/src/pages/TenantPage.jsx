import { useState, useEffect } from "react";
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

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
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
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <>
      <div className='flex-1'>
        <div className='p-10'>
          <div>
            <div className='w-max px-4 sm:px-0'>
              <h3 className='text-base font-semibold '>
                Welcome to inHome, {userInfo.first_name}!
              </h3>
              <p className='mt-1 max-w-xl text-sm leading-6 -500'>
                Account Details
              </p>
            </div>
            <div className='mt-6 border-t border-gray-100'>
              <dl className='divide-y divide-gray-100'>
                {Object.entries(userInfo).map(([key, value]) => {
                  if (key === "password") {
                    return (
                      <div
                        key='password'
                        className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'
                      >
                        <dt className='dark:bg-red-400text-sm font-medium leading-6'>
                          PASSWORD
                        </dt>
                        <dd className='mt-1 text-sm leading-6 -700 sm:col-span-2 sm:mt-0'>
                          {editMode ? (
                            <input
                              type='password'
                              id='password'
                              value={newPassword}
                              onChange={handlePasswordChange}
                              className='w-max dark:bg-base-100 form-input rounded-md shadow-sm mt-1 block outline outline-black p-1'
                              placeholder='Enter new password'
                            />
                          ) : (
                            "••••••••"
                          )}
                        </dd>
                      </div>
                    );
                  }
                  if (key === "role" || key === "username") return null;
                  return (
                    <div
                      key={key}
                      className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'
                    >
                      <dt className='text-sm font-medium leading-6'>
                        {key.replace("_", " ").toUpperCase()}
                      </dt>
                      <dd className='mt-1 text-sm leading-6 -700 sm:col-span-2 sm:mt-0'>
                        {editMode ? (
                          <input
                            type={key === "email" ? "email" : "text"}
                            id={key}
                            value={value}
                            onChange={handleChange}
                            className='w-max dark:bg-base-100 form-input rounded-md shadow-sm mt-1 block outline outline-black p-1'
                          />
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              {editMode ? (
                <button
                  onClick={handleSave}
                  className='btn bg-green-400 hover:bg-green-300'
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className='btn bg-base-300 hover:bg-red-300'
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
