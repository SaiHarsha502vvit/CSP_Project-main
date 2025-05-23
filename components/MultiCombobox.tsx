"use client";
import React, { useState, ChangeEvent } from "react";
import { Combobox } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import ingredients from "../app/data/ingredients";
import { Ingredient, ApiResponse, Nutrient } from "../types";
import {
  compareObjects,
  moveZerosToEnd,
  combineNutrientArrays,
} from "../utils/NutrientHandling";
import { toast } from "react-hot-toast";

let ApiKey: string | undefined = process.env.NEXT_PUBLIC_API_KEY;
const foods = ingredients;

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MultiComboBox({
  selectedFood,
  setSelectedFood,
  handleApiResult,
  setApiResult, // Receive setApiResult function
}: {
  selectedFood: Ingredient[];
  setSelectedFood: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  handleApiResult: (result: Nutrient[], fetchedImages: string[]) => void;
  setApiResult: React.Dispatch<React.SetStateAction<Nutrient[] | null>>; // Define the type for setApiResult
}) {
  const [query, setQuery] = useState<string>("");

  const handleApiCall = async () => {
    if (selectedFood && Array.isArray(selectedFood)) {
      // empty array before pushing new image data
      const fetchedImages: string[] = []; // Initialize the array
      const fetchPromises = selectedFood.map((food) => {
        const foodId = food.ingredientId;
        return fetch(
          `https://api.spoonacular.com/food/ingredients/${foodId}/information?apiKey=${ApiKey}&amount=100&unit=grams`
        )
          .then((response) => response.json())
          .then((data) => {
            fetchedImages.push(data.image); // Push the image
            data.nutrition.nutrients.sort(compareObjects);
            const sortedNutrients = moveZerosToEnd(data.nutrition.nutrients);
            return sortedNutrients;
          })
          .catch((error) => {
            console.log("api call error: ", error);
            const capitalisedIngredient = food.ingredient.replace(
              /(^\w{1})|(\s+\w{1})/g,
              (letter: string) => letter.toUpperCase()
            );
            console.log(
              "The ingredient searched for is: ",
              foodId + " " + capitalisedIngredient
            );
            toast.error(
              "Error fetching nutrients for " + capitalisedIngredient
            );
            return null;
          });
      });

      Promise.all(fetchPromises)
        .then((results) => {
          const combinedArray = combineNutrientArrays(results);
          let sortedArray = combinedArray.sort(compareObjects);
          sortedArray = moveZerosToEnd(sortedArray);
          setApiResult(sortedArray);
          handleApiResult(sortedArray, fetchedImages); // Pass fetchedImages back to parent
        })
        .catch((error) => {
          console.log("Promise all: ", error);
        });
    }
  };

  const filteredfoods =
    query === ""
      ? foods
      : foods.filter((food) => {
          return food.ingredient.toLowerCase().includes(query.toLowerCase());
        });

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
      >
        <Combobox.Label className="block text-sm font-medium leading-6 text-stone-300"></Combobox.Label>
        <div className="relative mt-2 w-72 mx-auto">
          <Combobox.Input
            className="w-72 rounded-md border-0 bg-stone-300 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={handleInputChange}
            displayValue={(food: Ingredient) => food?.ingredient}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredfoods.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm text-left">
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
      <button
        className="m-4 w-72 border-stone-400 bg-primary text-white hover:bg-stone-300 hover:text-slate-700  h-10  items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
        onClick={handleApiCall}
      >
        Show nutrients for the selected ingredients
      </button>
    </>
  );
}
