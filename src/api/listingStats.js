import axios from "axios";

// const API_URL = "http://localhost:5001";
const API_URL = "https://addressguru.ae/api";

export const get_listing_stats = async () => {
    try {
        const response = await axios.get(`${API_URL}/statistics/overview/`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        console.log("response of listing stats", response?.data);
        return response?.data;
    } catch (error) {   
        console.log("error getting listing stats", error);
        return error;
    }
}

export const track_event = async ( type, slug, eventType) => {
    try {
        const response = await axios.post(`${API_URL}/statistics/${type}/${slug}/track`,{
            type: eventType
        });
        return response.data;
    } catch (error) {
        console.log("error tracking event", error);
        return error;
    }
}

