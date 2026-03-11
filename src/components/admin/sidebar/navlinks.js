"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ROUTES } from "@/services/constants";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

export default function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(null);

  const toggleAccordion = (sectionName) => {
    setOpen(open === sectionName ? null : sectionName);
  };

  return (
    <div className="flex w-full flex-col">
      {NAV_ROUTES?.map((section) => {
        const Icon = section?.icon;

        // 📄 Regular single link
        if (!section?.children) {
          return (
            <Link
              key={section?.name}
              href={section?.href}
              className={clsx(
                "mb-1 flex h-[48px] items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 transition hover:bg-orange-100 hover:text-orange-600",
                {
                  "bg-orange-100 text-orange-600": pathname === section?.href,
                },
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{section?.name}</span>
            </Link>
          );
        }

        // 📂 Accordion with children
        return (
          <div key={section?.name} className="w-full">
            <button
              onClick={() => toggleAccordion(section?.name)}
              className={clsx(
                "mb-1 flex h-[48px] w-full items-center justify-between gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 transition hover:bg-orange-100 hover:text-orange-600",
                { "bg-orange-100 text-orange-600": open === section?.name },
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <span>{section?.name}</span>
              </div>
              {open === section?.name ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>

            {/* 👇 Smooth Animated Submenu */}
            <AnimatePresence>
              {open === section?.name && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="ml-8 mt-1 flex flex-col gap-1 overflow-hidden"
                >
                  {section?.children?.map((child) => (
                    <Link
                      key={child?.name}
                      href={child?.href}
                      className={clsx(
                        "block rounded-md p-2 mb-1 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600",
                        {
                          "font-medium text-orange-600":
                            pathname === child?.href,
                        },
                      )}
                    >
                      {child?.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
