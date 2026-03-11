import React from "react";

const Cloud = ({ data }) => {
  return (
    <div className=" flex flex-col items-center relative">
      {data.svg}

      <p className=" text-center font-semibold capitalize my-2">
        {data.text}
      </p>


    </div>
  );
};

export default Cloud;
