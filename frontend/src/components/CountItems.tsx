import React from "react";

interface CountItemsProps {
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const CountItems: React.FC<CountItemsProps> = ({ pagination }) => {
  const { total, page, limit } = pagination;

  return (
    <span className="mb-4 block w-full text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto">
      Mostrando{" "}
      <span className="font-semibold text-gray-900 dark:text-white">
        {pagination && page && limit && total
          ? `${(page - 1) * limit + 1}-${Math.min(page * limit, total)}`
          : "0-0"}
      </span>{" "}
      de{" "}
      <span className="font-semibold text-gray-900 dark:text-white">
        {pagination ? total : "0"}
      </span>
    </span>
  );
};

export default CountItems;
