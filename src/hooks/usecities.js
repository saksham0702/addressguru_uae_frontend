import { useEffect, useState } from "react";
import {
  getCities,
  createCity as createCityAPI,
  updateCity as updateCityAPI,
  deleteCity as deleteCityAPI,
  getCityLocalities,
} from "@/api/uaeadminCities";

export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [selectedCityLocalities, setSelectedCityLocalities] = useState([]);
  const [localitiesLoading, setLocalitiesLoading] = useState(false);

  const fetchCities = async () => {
    const data = await getCities();
    setCities(data.data || []);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ── City CRUD ──────────────────────────────────────────────
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

  // ── Locality CRUD ──────────────────────────────────────────
  // Fetch localities for a given city and update local state
  const fetchLocalities = async (cityId) => {
    setLocalitiesLoading(true);
    try {
      const data = await getCityLocalities(cityId);
      setSelectedCityLocalities(data || []);
    } finally {
      setLocalitiesLoading(false);
    }
  };

  // Create a locality under a parent city
  const createLocality = async (parentCityId, name) => {
    await createCityAPI({
      name,
      type: "locality",
      parent: parentCityId,
    });
    // Refresh locality list for the open city
    await fetchLocalities(parentCityId);
  };

  // Update a locality's name (slug auto-updates via controller)
  const updateLocality = async (localityId, name, parentCityId) => {
    await updateCityAPI(localityId, { name });
    await fetchLocalities(parentCityId);
  };

  // Soft-delete a locality
  const deleteLocality = async (localityId, parentCityId) => {
    await deleteCityAPI(localityId);
    await fetchLocalities(parentCityId);
  };

  return {
    cities,
    createCity,
    updateCity,
    deleteCity,
    // localities
    fetchLocalities,
    selectedCityLocalities,
    localitiesLoading,
    createLocality,
    updateLocality,
    deleteLocality,
  };
};
