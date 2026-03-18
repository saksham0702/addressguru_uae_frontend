import { get_sub_category } from "@/api/Categories";
import { getCategorybyType } from "@/api/uaeAdminCategories";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PropertiesCategory = () => {
  const [rent, setRent] = useState(false);
  const type = rent ? "rent" : "sale";

  const [category, setCategory] = useState(null);
  const getCategoryMarketplace = async () => {
    const res = await getCategorybyType("property");
    if (res) setCategory(res?.data);
  };

  useEffect(() => {
    getCategoryMarketplace();
  }, []);

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Choose Your Category
      </h3>
      <div className=" w-full flex capitalize justify-center text-base font-medium items-center">
        <span
          onClick={() => setRent(!rent)}
          className={` ${
            rent ? " bg-orange-600 text-white" : " bg-white"
          }  px-4 py-1.5 rounded-l-full cursor-pointer`}
        >
          for rent
        </span>

        <span
          onClick={() => setRent(!rent)}
          className={` ${
            rent ? " bg-white " : " bg-orange-600 text-white"
          }  px-4 py-1.5 rounded-r-full cursor-pointer `}
        >
          for sale
        </span>
      </div>
      {/* all categories */}

      <section className="w-full h-auto flex flex-wrap gap-10 my-10 ">
        {category?.map((item, index) => (
          <Link
            href={`/dashboard/properties-listing?id=${item?._id}&type=${type}&category=${item?.slug}`}
            key={index}
            className="bg-white w-66 text-sm font-semibold text-center py-2 px-3 h-10 rounded-md"
          >
            {item?.name}
          </Link>
        ))}
      </section>
    </>
  );
};

export default PropertiesCategory;
