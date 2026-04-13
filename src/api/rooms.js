import axios from "axios";

const API_URL = "https://addressguru.ae/api";
// const API_URL = "http://localhost:5001";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

/**
 * GET /rooms/get-rooms-by-listing/:listingId
 * Fetch all active rooms for a listing (public).
 * Response is shaped to match the RoomsSection frontend component.
 */
export const get_rooms_by_listing = async (listingId) => {
  try {
    const response = await axios.get(
      `${API_URL}/rooms/get-rooms-by-listing/${listingId}`
    );
    return response?.data;
  } catch (error) {
    console.log("error fetching rooms by listing", error);
    return error?.response?.data ?? error;
  }
};

/**
 * GET /rooms/get-room/:roomId
 * Fetch a single room's full detail (public).
 */
export const get_room_by_id = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/rooms/get-room/${roomId}`);
    return response?.data;
  } catch (error) {
    console.log("error fetching room by id", error);
    return error?.response?.data ?? error;
  }
};

/**
 * POST /rooms/create-room
 * Create a new room for a listing (protected — business owner only).
 *
 * payload (common):  listingId*, roomType*, price*, capacity*, images[]
 * payload (Hotel):   checkIn, checkOut
 * payload (Hostel):  checkIn, checkOut
 * payload (Yoga):    batchSize, language, daysNights, mealsIncluded
 */
export const create_room = async (payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/rooms/create-room`,
      payload,
      { headers: authHeaders() }
    );
    return response?.data;
  } catch (error) {
    console.log("error creating room", error);
    return error?.response?.data ?? error;
  }
};

/**
 * PUT /rooms/update-room/:roomId
 * Update an existing room (protected — business owner only).
 *
 * payload (common):  roomType, price, capacity, images[], isActive
 * payload (Hotel):   checkIn, checkOut
 * payload (Hostel):  checkIn, checkOut
 * payload (Yoga):    batchSize, language, daysNights, mealsIncluded
 */
export const update_room = async (roomId, payload) => {
  try {
    const response = await axios.put(
      `${API_URL}/rooms/update-room/${roomId}`,
      payload,
      { headers: authHeaders() }
    );
    return response?.data;
  } catch (error) {
    console.log("error updating room", error);
    return error?.response?.data ?? error;
  }
};

/**
 * DELETE /rooms/delete-room/:roomId
 * Soft-delete a room (protected — business owner only).
 */
export const delete_room = async (roomId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/rooms/delete-room/${roomId}`,
      { headers: authHeaders() }
    );
    return response?.data;
  } catch (error) {
    console.log("error deleting room", error);
    return error?.response?.data ?? error;
  }
};

/**
 * PATCH /rooms/toggle-room/:roomId
 * Toggle a room's active/inactive status (protected — business owner only).
 */
export const toggle_room_status = async (roomId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/rooms/toggle-room/${roomId}`,
      {},
      { headers: authHeaders() }
    );
    return response?.data;
  } catch (error) {
    console.log("error toggling room status", error);
    return error?.response?.data ?? error;
  }
};