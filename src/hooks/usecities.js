
import { useEffect, useState } from "react";
import {
    getCities,
    createCity as createCityAPI,
    updateCity as updateCityAPI,
    deleteCity as deleteCityAPI,
} from "@/api/uaeadminCities";

export const useCities = () => {

    const [cities, setCities] = useState([]);

    const fetchCities = async () => {
        const data = await getCities();
        console.log(data);

        setCities(data.cities || []);
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const createCity = async (payload) => {
        await createCityAPI(payload);
        fetchCities();
    };

    const updateCity = async (id, payload) => {
        await updateCityAPI(id, payload);
        fetchCities();
    };

    const deleteCity = async (id) => {
        await deleteCityAPI(id);
        fetchCities();
    };

    return {
        cities,
        createCity,
        updateCity,
        deleteCity,
    };
};