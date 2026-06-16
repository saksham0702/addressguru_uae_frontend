import { get_sub_category } from "@/api/Categories";
import { getCategorybyType } from "@/api/uaeAdminCategories";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PropertiesCategory = () => {
  const [selectedType, setSelectedType] = useState("sale");
  const type = selectedType;

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
      <div className="w-full flex capitalize justify-center text-sm font-medium items-center mb-6">
        <div className="bg-gray-100 p-1 rounded-full flex gap-1">
          {["sale", "rent", "lease"].map((t) => (
            <span
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-6 py-2 rounded-full cursor-pointer transition-all ${
                selectedType === t
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              For {t}
            </span>
          ))}
        </div>
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
