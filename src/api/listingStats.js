import axios from "axios";
import { API_URL } from "@/services/constants"
// const API_URL = "http://localhost:5001";

export const get_listing_stats = async () => {
    try {
        const response = await axios.get(`${API_URL}/statistics/overview/`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
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

