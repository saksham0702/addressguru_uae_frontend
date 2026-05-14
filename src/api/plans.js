import axios from "axios";
import { API_URL } from "@/services/constants";

// ✅ Reusable instance (IMPORTANT for auth cookies)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// PUBLIC
export const get_plans = async () => {
  try {
    const res = await api.get("/plans");
    return res?.data;
  } catch (error) {
    console.log("get_plans error:", error);
    return error?.response?.data || error;
  }
};

// GET /plans/slug/:slug
export const get_plan_by_slug = async (slug) => {
  try {
    const res = await api.get(`/plans/slug/${slug}`);
    return res?.data;
  } catch (error) {
    console.log("get_plan_by_slug error:", error);
    return error?.response?.data || error;
  }
};

// GET /plans/:id
export const get_plan_by_id = async (id) => {
  try {
    const res = await api.get(`/plans/${id}`);
    return res?.data;
  } catch (error) {
    console.log("get_plan_by_id error:", error);
    return error?.response?.data || error;
  }
};

/* ─── ADMIN ───────────────────────────────────────── */

// POST /plans
export const create_plan = async (data) => {
  try {
    const res = await api.post("/plans", data);
    return res?.data;
  } catch (error) {
    console.log("create_plan error:", error);
    return error?.response?.data || error;
  }
};

// PUT /plans/:id
export const update_plan = async (id, data) => {
  try {
    const res = await api.put(`/plans/${id}`, data);
    return res?.data;
  } catch (error) {
    console.log("update_plan error:", error);
    return error?.response?.data || error;
  }
};

// DELETE /plans/:id
export const delete_plan = async (id) => {
  try {
    const res = await api.delete(`/plans/${id}`);
    return res?.data;
  } catch (error) {
    console.log("delete_plan error:", error);
    return error?.response?.data || error;
  }
};

// POST /plans/seed
export const seed_plans = async () => {
  try {
    const res = await api.post("/plans/seed");
    return res?.data;
  } catch (error) {
    console.log("seed_plans error:", error);
    return error?.response?.data || error;
  }
};

/* ─── USER ACTION ─────────────────────────────────── */

// POST /plans/upgrade
export const upgrade_plan = async (payload) => {
  try {
    const res = await api.post("/plans/upgrade", payload);
    return res?.data;
  } catch (error) {
    console.log("upgrade_plan error:", error);
    return error?.response?.data || error;
  }
};
