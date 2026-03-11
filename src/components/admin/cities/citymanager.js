
"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCities } from "@/hooks/usecities";
import CityModal from "./citymodal";
import DeleteConfirmModal from "./deletemodal";

export default function CitiesManager() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const { cities, createCity, updateCity, deleteCity } = useCities();

    const handleSubmit = async (city) => {
        if (editingCity) {
            await updateCity(editingCity._id, city);
            setEditingCity(null);
        } else {
            await createCity(city);
        }

        setIsModalOpen(false);
    };

    console.log(cities);

    return (
        <div className="w-full min-h-screen bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold text-gray-800">Manage Cities</h2>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow hover:opacity-90 transition"
                >
                    <Plus size={16} />
                    Add City
                </button>
            </div>

            {/* Cities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">

                {!cities ? (
                    <div className="col-span-full text-center text-gray-400 text-sm py-16">
                        No cities added yet.
                    </div>
                ) : (
                    cities?.map((city) => (
                        <motion.div
                            key={city._id}
                            layout
                            className="bg-white border border-gray-200 rounded-lg px-4 py-3 
              flex items-center justify-between shadow-sm hover:shadow-md transition"
                        >

                            <span className="text-sm font-medium text-gray-700 capitalize">
                                {city?.name}
                            </span>

                            <div className="flex items-center gap-2">

                                {/* Edit */}
                                <button
                                    onClick={() => {
                                        setEditingCity(city);
                                        setIsModalOpen(true);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 transition"
                                >
                                    <Pencil size={16} />
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => setDeleteId(city._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

                        </motion.div>
                    ))
                )}

            </div>

            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={async () => {
                    await deleteCity(deleteId);
                    setDeleteId(null);
                }}
                title="Delete City"
                description="Are you sure you want to delete this city? This action cannot be undone."
            />

            {/* Modal */}
            <CityModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCity(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingCity}
            />

        </div>
    );
}