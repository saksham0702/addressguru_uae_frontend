"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { useCities } from "@/hooks/usecities";
import CityModal from "./citymodal";
import DeleteConfirmModal from "./deletemodal";

export default function CitiesManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [viewCity, setViewCity] = useState(null);

  // Locality panel state
  const [newLocalityName, setNewLocalityName] = useState("");
  const [editingLocality, setEditingLocality] = useState(null); // { id, name }
  const [deletingLocalityId, setDeletingLocalityId] = useState(null);
  const [localityActionLoading, setLocalityActionLoading] = useState(false);

  const {
    cities,
    createCity,
    updateCity,
    deleteCity,
    fetchLocalities,
    selectedCityLocalities,
    localitiesLoading,
    createLocality,
    updateLocality,
    deleteLocality,
  } = useCities();

  const handleSubmit = async (city) => {
    if (editingCity) {
      await updateCity(editingCity._id, city);
      setEditingCity(null);
    } else {
      await createCity(city);
    }
    setIsModalOpen(false);
  };

  const cityList = useMemo(() => {
    return (cities || []).filter((c) => c.type !== "locality");
  }, [cities]);

  // ── Locality handlers ──────────────────────────────────────
  const handleAddLocality = async () => {
    if (!newLocalityName.trim() || !viewCity) return;
    setLocalityActionLoading(true);
    try {
      await createLocality(viewCity._id, newLocalityName.trim());
      setNewLocalityName("");
    } finally {
      setLocalityActionLoading(false);
    }
  };

  const handleUpdateLocality = async () => {
    if (!editingLocality?.name.trim() || !viewCity) return;
    setLocalityActionLoading(true);
    try {
      await updateLocality(
        editingLocality.id,
        editingLocality.name.trim(),
        viewCity._id,
      );
      setEditingLocality(null);
    } finally {
      setLocalityActionLoading(false);
    }
  };

  const handleDeleteLocality = async (localityId) => {
    if (!viewCity) return;
    setDeletingLocalityId(localityId);
    try {
      await deleteLocality(localityId, viewCity._id);
    } finally {
      setDeletingLocalityId(null);
    }
  };

  const openLocalityPanel = (city) => {
    setViewCity(city);
    setNewLocalityName("");
    setEditingLocality(null);
    fetchLocalities(city._id);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] p-6 ">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-widest">
            Cities
          </h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
        >
          <Plus size={13} />
          Add City
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-[1fr_auto] px-4 py-2 bg-gray-50 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          <span>City Name</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {!cityList.length ? (
          <div className="text-center text-xs text-gray-400 py-10">
            No cities found.
          </div>
        ) : (
          cityList.map((city, index) => (
            <div
              key={city._id}
              className={`grid grid-cols-[1fr_auto] items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                index !== cityList.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="font-medium text-gray-800">{city.name}</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openLocalityPanel(city)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-gray-600 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                >
                  <Eye size={12} />
                  Localities
                </button>
                <button
                  onClick={() => {
                    setEditingCity(city);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-gray-500 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                  title="Edit City"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteId(city._id)}
                  className="p-1.5 text-red-500 border border-red-100 rounded hover:bg-red-50 transition-colors"
                  title="Delete City"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* LOCALITY SIDE PANEL */}
      {viewCity && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setViewCity(null)}
          />

          <div className="fixed right-0 top-0 w-80 h-full bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
            {/* Panel Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  Localities
                </p>
                <h3 className="text-sm font-semibold text-gray-800 mt-0.5">
                  {viewCity.name}
                </h3>
              </div>
              <button
                onClick={() => setViewCity(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Add Locality Input */}
            <div className="px-4 py-3 border-b border-gray-100 bg-white">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
                Add New Locality
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLocalityName}
                  onChange={(e) => setNewLocalityName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLocality()}
                  placeholder="Locality name..."
                  className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-gray-50"
                />
                <button
                  onClick={handleAddLocality}
                  disabled={!newLocalityName.trim() || localityActionLoading}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded transition-colors flex items-center gap-1"
                >
                  {localityActionLoading ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Plus size={11} />
                  )}
                  Add
                </button>
              </div>
            </div>

            {/* Locality List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {localitiesLoading ? (
                <div className="flex justify-center mt-8">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                </div>
              ) : selectedCityLocalities.length === 0 ? (
                <p className="text-xs text-gray-400 text-center mt-8">
                  No localities yet.
                </p>
              ) : (
                selectedCityLocalities.map((loc) => (
                  <div
                    key={loc._id}
                    className="flex items-center gap-2 px-3 py-2 rounded border border-gray-100 bg-gray-50 group hover:border-gray-300 transition-colors"
                  >
                    {editingLocality?.id === loc._id ? (
                      // Edit mode
                      <>
                        <input
                          autoFocus
                          type="text"
                          value={editingLocality.name}
                          onChange={(e) =>
                            setEditingLocality({
                              ...editingLocality,
                              name: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateLocality();
                            if (e.key === "Escape") setEditingLocality(null);
                          }}
                          className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-gray-500 bg-white"
                        />
                        <button
                          onClick={handleUpdateLocality}
                          disabled={localityActionLoading}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          {localityActionLoading ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <Check size={11} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingLocality(null)}
                          className="p-1 text-gray-400 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </>
                    ) : (
                      // View mode
                      <>
                        <span className="flex-1 text-xs text-gray-700">
                          {loc.name}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setEditingLocality({
                                id: loc._id,
                                name: loc.name,
                              })
                            }
                            className="p-1 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            onClick={() => handleDeleteLocality(loc._id)}
                            disabled={deletingLocalityId === loc._id}
                            className="p-1 text-red-400 hover:bg-red-50 rounded transition-colors"
                          >
                            {deletingLocalityId === loc._id ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <Trash2 size={11} />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await deleteCity(deleteId);
          setDeleteId(null);
        }}
      />

      {/* CITY MODAL */}
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
