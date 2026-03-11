// utils/sessionStorage.js
const STORAGE_KEY = "listing_form_data";

export const saveToSession = (key, value) => {
  try {
    const existingData = getFromSession();
    const updatedData = {
      ...existingData,
      [key]: value,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error saving to session storage:", error);
  }
};

export const getFromSession = (key = null) => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    const parsedData = data ? JSON.parse(data) : {};
    return key ? parsedData[key] : parsedData;
  } catch (error) {
    console.error("Error reading from session storage:", error);
    return key ? null : {};
  }
};

export const clearSession = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing session storage:", error);
  }
};

export const removeFromSession = (key) => {
  try {
    const existingData = getFromSession();
    delete existingData[key];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error("Error removing from session storage:", error);
  }
};
