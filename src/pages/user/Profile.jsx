import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    status: "",
    joiningDate: "",
  });
const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const date = new Date(storedUser.createdAt);
      const options = { day: "numeric", month: "long", year: "numeric" };
      const formattedDate = date.toLocaleDateString("en-GB", options);

      setProfile({
        firstName: storedUser.firstname || "",
        lastName: storedUser.lastname || "",
        email: storedUser.email || "",
        phoneNumber: storedUser.phoneNumber || "",
        status: storedUser.status || "",
        joiningDate: formattedDate,
      });
    }
  }, []);

  const handleChange = (e, field) =>
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));

  const handleToggleEdit = async () => {
    if (isEditing) {
      try {
        const response = await axios.post(
          `${BASE_URL}/website/auth/edit-profile`,
          {
            email: profile.email,
            firstname: profile.firstName,
            lastname: profile.lastName,
            phoneNumber: profile.phoneNumber,
          }
        );

        if (response.data.status === 1) {
          const updatedData = response.data.data;

          setProfile((prev) => ({
            ...prev,
            firstName: updatedData.firstname || "",
            lastName: updatedData.lastname || "",
            phoneNumber: updatedData.phoneNumber || "",
          }));

          const storedUser = JSON.parse(localStorage.getItem("user")) || {};
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...storedUser,
              firstname: updatedData.firstname || "",
              lastname: updatedData.lastname || "",
              phoneNumber: updatedData.phoneNumber || "",
            })
          );

          alert("Profile updated successfully");
        } else {
          alert(response.data.message || "Failed to update profile");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Profile not updated.");
      }
    }

    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              My Profile
            </h2>
            <button
              onClick={handleToggleEdit}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto ${
                isEditing
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
              <span className="font-semibold text-gray-700 mb-2 sm:mb-0 text-sm sm:text-base">Name:</span>
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange(e, "firstName")}
                    placeholder="First Name"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-400 outline-none transition-shadow shadow-sm focus:shadow-md"
                  />
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange(e, "lastName")}
                    placeholder="Last Name"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-400 outline-none transition-shadow shadow-sm focus:shadow-md"
                  />
                </div>
              ) : (
                <span className="text-gray-800 font-medium text-sm sm:text-base">
                  {`${profile.firstName} ${profile.lastName}`}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
              <span className="font-semibold text-gray-700 mb-2 sm:mb-0 text-sm sm:text-base">Email:</span>
              <span className="text-gray-800 break-all text-sm sm:text-base">{profile.email}</span>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
              <span className="font-semibold text-gray-700 mb-2 sm:mb-0 text-sm sm:text-base">Phone Number:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.phoneNumber}
                  onChange={(e) => handleChange(e, "phoneNumber")}
                  placeholder="Phone Number"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-400 outline-none transition-shadow shadow-sm focus:shadow-md"
                />
              ) : (
                <span className="text-gray-800 text-sm sm:text-base">{profile.phoneNumber}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-4">
              <span className="font-semibold text-gray-700 mb-2 sm:mb-0 text-sm sm:text-base">Status:</span>
              <span className="text-gray-800 capitalize text-sm sm:text-base">{profile.status}</span>
            </div>

            {/* Joining Date */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="font-semibold text-gray-700 mb-2 sm:mb-0 text-sm sm:text-base">Date of Joining:</span>
              <span className="text-gray-800 text-sm sm:text-base">{profile.joiningDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
