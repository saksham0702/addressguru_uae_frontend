
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="bg-white w-[420px] rounded-xl shadow-xl border border-gray-200 p-6"
                    >
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-100 mb-4">
                            <Trash2 className="text-red-600" size={22} />
                        </div>

                        {/* Title */}
                        <h3 className="text-center text-lg font-semibold text-gray-80   0">
                            {title}
                        </h3>

                        {/* Description */}
                        <p className="text-center text-sm text-gray-500 mt-2">
                            {description}
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}