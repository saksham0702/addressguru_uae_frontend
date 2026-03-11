
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CityModal({ isOpen, onClose, onSubmit, initialData }) {

    const [name, setName] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        } else {
            setName("");
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!name.trim()) return;

        onSubmit({ name });
    };

    return (
        <AnimatePresence>

            {isOpen && (

                <motion.div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >

                    <motion.div
                        className="bg-white rounded-xl p-6 w-[400px] shadow-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >

                        <h3 className="text-lg font-semibold mb-4">
                            {initialData ? "Edit City" : "Add City"}
                        </h3>

                        <input
                            type="text"
                            placeholder="City Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm border rounded-lg border-gray-200 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                            >
                                Save
                            </button>

                        </div>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>
    );
}