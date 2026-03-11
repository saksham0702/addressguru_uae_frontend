"use client";
import Modal from "react-modal";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  category,
  type = "category",
}) {
  const handleDelete = async () => {
    try {
      await onConfirm(category);
      // toast.success('Category deleted!');
      onClose();
    } catch (err) {
      toast.error("Failed to delete!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Confirmation"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      className="relative w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col items-center">
        <Trash2 className="mb-3 h-10 w-10 text-red-500" />
        <h2 className="mb-2 text-lg font-semibold">Delete Category?</h2>
        <p className="mb-5 text-sm text-gray-500">
          This action cannot be undone. The{" "}
          {type === "category" ? type : "subcategory"} will be permanently
          removed.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
