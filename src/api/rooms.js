import axios from "axios";
import { API_URL } from "@/services/constants"
// const API_URL = "http://localhost:5001";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

// ✅ GET ROOMS
export const get_rooms_by_listing = async (listingId) => {
  try {
    const res = await axios.get(
      `${API_URL}/rooms/get-rooms-by-listing/${listingId}`,
    );
    return res.data;
  } catch (err) {
    console.log("error fetching rooms", err);
    return err?.response?.data ?? err;
  }
};

// ✅ CREATE ROOM (🔥 FIXED)
export const create_room = async (payload) => {
  try {
    const isFormData = payload instanceof FormData;

    const res = await axios.post(`${API_URL}/rooms/create-room`, payload, {
      headers: {
        ...authHeader(),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });

    return res.data;
  } catch (err) {
    console.log("error creating room", err);
    return err?.response?.data ?? err;
  }
};

// ✅ UPDATE ROOM (🔥 FIXED)
export const update_room = async (roomId, payload) => {
  try {
    const isFormData = payload instanceof FormData;

    const res = await axios.put(
      `${API_URL}/rooms/update-room/${roomId}`,
      payload,
      {
        headers: {
          ...authHeader(),
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
      },
    );

    return res.data;
  } catch (err) {
    console.log("error updating room", err);
    return err?.response?.data ?? err;
  }
};

// ✅ DELETE ROOM
export const delete_room = async (roomId) => {
  try {
    const res = await axios.delete(`${API_URL}/rooms/delete-room/${roomId}`, {
      headers: authHeader(),
    });
    return res.data;
  } catch (err) {
    console.log("error deleting room", err);
    return err?.response?.data ?? err;
  }
};

// ✅ TOGGLE STATUS
export const toggle_room_status = async (roomId) => {
  try {
    const res = await axios.patch(
      `${API_URL}/rooms/toggle-room/${roomId}`,
      {},
      { headers: authHeader() },
    );
    return res.data;
  } catch (err) {
    console.log("error toggling room", err);
    return err?.response?.data ?? err;
  }
};
