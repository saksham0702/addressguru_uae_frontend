/** Standard orange check icon used for lists */
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#FFE9D9" />
      <path
        d="M17.15 5.32c-.46-.43-1.21-.43-1.68 0L7.9 12.34 4.53 9.22c-.47-.43-1.22-.43-1.69 0-.46.43-.46 1.13 0 1.56L7.06 14.7c.23.21.53.33.84.33s.61-.12.84-.33l8.42-7.8c.47-.43.47-1.13 0-1.56z"
        fill="#FF6E04"
      />
    </svg>
  );
}


const InfoSection = ({
  title,
  description,
  items = [],
  iconKey = "iconSvg",
  nameKey = "name",
  useGrid = true,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="max-w-5xl mt-5 md:pl-2 px-1">
      {/* Header */}
      <span className="flex gap-3 items-center">
        <h2 className="font-semibold uppercase md:text-xl whitespace-nowrap">
          {title}
        </h2>
        <span className="h-[1px] w-full bg-gray-200" />
      </span>

      {/* Description */}
      {description && (
        <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
          {description}
        </p>
      )}

      {/* Items */}
      <div
        className={
          useGrid
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : "flex flex-col gap-4"
        }
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {item?.[iconKey] ? (
              <div
                className="icon-wrapper"
                dangerouslySetInnerHTML={{ __html: item[iconKey] }}
              />
            ) : (
              <CheckIcon />
            )}
            <span className="text-[16px] font-medium">
              {item?.[nameKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;