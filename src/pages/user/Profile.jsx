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
          "http://localhost:8000/website/auth/edit-profile",
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
    <div className="max-w-2xl mx-auto mt-10 p-6 md:p-10 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          My Profile
        </h2>
        <button
          onClick={handleToggleEdit}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
            isEditing
              ? "bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md"
              : "bg-transparent border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold"
          }`}
        >
          {isEditing ? "Save" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Fields */}
      <div className="space-y-6">
        {/* Name */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-3">
          <span className="font-medium text-gray-700 mb-1 md:mb-0">Name:</span>
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleChange(e, "firstName")}
                placeholder="First Name"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-44 focus:ring-2 focus:ring-blue-400 outline-none transition-shadow shadow-sm focus:shadow-md"
              />
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleChange(e, "lastName")}
                placeholder="Last Name"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-44 focus:ring-2 focus:ring-blue-400 outline-none transition-shadow shadow-sm focus:shadow-md"
              />
            </div>
          ) : (
            <span className="text-gray-800 font-medium">
              {`${profile.firstName} ${profile.lastName}`}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-3">
          <span className="font-medium text-gray-700">Email:</span>
          <span className="text-gray-800 break-all">{profile.email}</span>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-3">
          <span className="font-medium text-gray-700">Phone Number:</span>
          {isEditing ? (
            <input
              type="text"
              value={profile.phoneNumber}
              onChange={(e) => handleChange(e, "phoneNumber")}
              placeholder="Phone Number"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-44 focus:ring-2 focus:ring-blue-400 outline-none transition-shadow shadow-sm focus:shadow-md"
            />
          ) : (
            <span className="text-gray-800">{profile.phoneNumber}</span>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-3">
          <span className="font-medium text-gray-700">Status:</span>
          <span className="text-gray-800 capitalize">{profile.status}</span>
        </div>

        {/* Joining Date */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-3">
          <span className="font-medium text-gray-700">Date of Joining:</span>
          <span className="text-gray-800">{profile.joiningDate}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
