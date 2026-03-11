"use client";

export default function FeatureAssignSection({ items, selected, onToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((feature) => {
        const isSelected = selected.includes(feature._id);

        return (
          <div
            key={feature._id}
            onClick={() => onToggle(feature._id)}
            className={`cursor-pointer border rounded-xl px-4 py-3 flex items-center gap-2 transition
              ${
                isSelected
                  ? "bg-blue-50 border-blue-500"
                  : "bg-white border-gray-200"
              }`}
          >
            {feature.iconSvg && (
              <div
                className="w-4 h-4 text-indigo-600 [&>svg]:w-4 [&>svg]:h-4"
                dangerouslySetInnerHTML={{
                  __html: feature.iconSvg,
                }}
              />
            )}

            <span className="text-sm font-medium">{feature.name}</span>
          </div>
        );
      })}
    </div>
  );
}
