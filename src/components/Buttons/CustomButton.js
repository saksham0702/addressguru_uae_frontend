import React, { useState } from "react";

const CustomButton = ({
  showToggle = false,
  defaultText = "SHOW NUMBER",
  toggledText,
  icon = null,
  toggledIcon = null,
  bgColor = "#fff",
  toggledBgColor = "#FF6E04",
  textColor = "#FF6E04",
  toggledTextColor = "#fff",
  borderColor = "#FF6E04",
  toggledBorderColor = "#FF6E04", // New prop for toggled state
  borderWidth = "1px",
  borderStyle = "solid",
  width = "auto",
  height = "30px",
  fontSize = "12px",
  padding = "8px 12px",
  fontWeight = 500,
  borderRadius = "4px",
  onClick = null,
}) => {
  const [toggled, setToggled] = useState(false);

  const handleClick = () => {
    if (showToggle) {
      // call onClick only when toggling from false -> true
      if (!toggled && onClick) {
        onClick();
      }
      setToggled(!toggled);
    } else {
      if (onClick) onClick();
    }
  };
  const isToggled = toggled && showToggle;
  return (
    <button
      className="whitespace-nowrap  max-[375px]:!w-28  max-[375px]:!h-7 max-[375px]:!text-[9px]  "
      onClick={handleClick}
      style={{
        backgroundColor: isToggled ? toggledBgColor : bgColor,
        color: isToggled ? toggledTextColor : textColor,
        border: `${borderWidth} ${borderStyle} ${
          isToggled ? toggledBorderColor : borderColor
        }`,
        width,
        height,
        padding,
        fontSize,
        fontWeight,
        borderRadius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <span className="mr-1  max-[375px]:!scale-70">
        {isToggled ? toggledIcon : icon}
      </span>
      <span className="mt-[2px]  ">
        {showToggle ? (isToggled ? toggledText : defaultText) : defaultText}
      </span>
    </button>
  );
};

export default CustomButton;
