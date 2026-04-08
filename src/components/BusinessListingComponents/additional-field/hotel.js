export function getStarRating(additionalFields = []) {
  const field = additionalFields?.find(
    (f) => f.field_label?.toLowerCase() === "hotel type",
  );
  return field?.value || null;
}

const StarRatingBadge = ({ value }) => {
  if (!value) return null;

  return (
    <span className=" text-[14px] font-medium text-gray-700 align-middle">
      ({value} Hotel)
    </span>
  );
};

export default StarRatingBadge;
