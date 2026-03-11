import React from "react";

const HomeHeadingView = ({title, view}) => {
  return (
    <div className="flex justify-between w-full pr-7 md:mt-16 mb-5 px-4 max-md:px-3 max-md:text-base">
      {title}
      <button className="border border-gray-200 rounded-sm text-sm px-3 py-1 max-md:text-xs text-zinc-800">
        {view}
      </button>
    </div>
  );
};

export default HomeHeadingView;
