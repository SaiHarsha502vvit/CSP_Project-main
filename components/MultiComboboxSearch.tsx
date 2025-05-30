"use client";
import React, { useState, ChangeEvent, useMemo } from "react";
import { Combobox } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import ingredients from "../app/data/ingredients";
import { Ingredient } from "../types";

const foods = ingredients;

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

// Debounce hook
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function MultiComboBox({
  selectedFood,
  setSelectedFood,
}: {
  selectedFood: Ingredient[];
  setSelectedFood: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}) {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebouncedValue(query, 250);

  const filteredfoods = useMemo(
    () =>
      debouncedQuery === ""
        ? foods
        : foods.filter((food) =>
            food.ingredient.toLowerCase().includes(debouncedQuery.toLowerCase())
          ),
    [debouncedQuery]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <>
      <Combobox
        as="div"
        value={selectedFood}
        onChange={setSelectedFood}
        //@ts-ignore
        multiple
        aria-label="Select ingredients"
        role="listbox"
      >
        <Combobox.Label className="block text-sm font-medium leading-6 text-stone-300">
          Ingredients
        </Combobox.Label>
        <div className="relative mt-2 w-72 mx-auto">
          <Combobox.Input
            className="w-72 rounded-md border-0 bg-stone-300 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={handleInputChange}
            displayValue={(food: Ingredient) => food?.ingredient}
            aria-label="Ingredient search input"
            role="searchbox"
          />
          <Combobox.Button
            className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
            aria-label="Show ingredient options"
          >
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredfoods.length > 0 && (
            <Combobox.Options
              className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm text-left"
              role="listbox"
            >
              {filteredfoods.map((food) => (
                <Combobox.Option
                  key={`${food.ingredient}-${food.ingredientId}`}
                  value={food}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    )
                  }
                  aria-selected={selectedFood.some(
                    (f) => f.ingredientId === food.ingredientId
                  )}
                  role="option"
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          "block truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {food.ingredient}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}
                        >
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </>
  );
}
