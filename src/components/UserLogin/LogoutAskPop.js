import React from "react";

const LogoutAskPop = ({ onCancel, onConfirm }) => {
  return (
    <div className=" fixed inset-0 bg-black/20 flex justify-center  items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Are you sure you want to logout?
        </h2>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-orange-500 text-orange-500 font-medium hover:bg-orange-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutAskPop;
