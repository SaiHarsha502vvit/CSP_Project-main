"use client";
import MultiComboBox from "@/components/MultiCombobox";
import MultiNutrientListing from "@/components/MultiNutrientListing";
import { useState } from "react";
import { Ingredient, ApiResponse, Nutrient } from "../../types";
import SelectedIngredientListing from "@/components/selectedIngredientListing";
import SaveAsDish from "@/components/SaveAsDish";

export default function SearchIndex() {
  const [selectedFood, setSelectedFood] = useState<Ingredient[]>([]);
  const [apiResult, setApiResult] = useState<Nutrient[] | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const handleApiResult = (result: Nutrient[], fetchedImages: string[]) => {
    setApiResult(result);
    setImages(fetchedImages);
  };
  console.log("page level selectedFood", selectedFood);
  return (
    <div className=" pt-14 min-h-full mt-14">
      <div className="w-screen flex flex-col justify-center items-center">
        <svg
          className="w-20 lg:w-40 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 512 640"
          x="0px"
          y="0px"
        >
          <path d="M38,484.5H271.77c13,12.76,27,19.51,40.94,19.51a93.92,93.92,0,0,0,34.5-6.51,8.06,8.06,0,0,1,5.88,0A93.86,93.86,0,0,0,387.58,504c24.38,0,48.59-20.48,68.19-57.66C471.46,416.57,482,379.23,482,353.44a94.46,94.46,0,0,0-119.47-91.05c4.47-36,30-54.09,31.13-54.9a8,8,0,1,0-9-13.21c-.87.59-12.25,8.58-22.46,24.07a61.92,61.92,0,0,0-6-10V66.12a8,8,0,0,0-8-8H264.77V46.44a8,8,0,0,0-8-8H230.6a36.11,36.11,0,0,0-71.32,0H129.35a8,8,0,0,0-8,8V58.12H38a8,8,0,0,0-8,8V476.5A8,8,0,0,0,38,484.5Zm318.22-203a7.64,7.64,0,0,0,.8-.29,78.46,78.46,0,0,1,109,72.24c0,23.43-9.8,57.77-24.39,85.45-16.45,31.21-36.14,49.12-54,49.12a78.08,78.08,0,0,1-28.65-5.4,23.94,23.94,0,0,0-17.57,0,78.08,78.08,0,0,1-28.65,5.4c-17.88,0-37.58-17.91-54-49.12-14.58-27.68-24.38-62-24.38-85.45a78.45,78.45,0,0,1,109-72.22A17.58,17.58,0,0,0,356.22,281.49ZM342,216.26a45.79,45.79,0,0,1,8.94,18,45.77,45.77,0,0,1-63.35-30.79,45.81,45.81,0,0,1,54.31,12.69ZM137.35,54.44h29a8,8,0,0,0,8-7.61,8,8,0,0,0,.49-2.73,20.11,20.11,0,1,1,40.21,0,8,8,0,0,0,.49,2.73,8,8,0,0,0,8,7.61h25.26V77.79H137.35ZM46,74.12h75.35V85.79a8,8,0,0,0,8,8H256.77a8,8,0,0,0,8-8V74.12h75.36V193.33a61.89,61.89,0,0,0-65.57-1.06,8,8,0,0,0-3.81,7.85A61.71,61.71,0,0,0,348,252.25a101.61,101.61,0,0,0-1.83,12.88A94.46,94.46,0,0,0,218.3,353.44c0,25.79,10.54,63.13,26.23,92.91a186.21,186.21,0,0,0,13.61,22.15H46Z" />
          <path d="M189.77,123,170.1,135.89V125.46a8,8,0,0,0-8-8H98a8,8,0,0,0-8,8v65.91a8,8,0,0,0,8,8H162.1a8,8,0,0,0,8-8V155l28.43-18.61A8,8,0,0,0,189.77,123ZM154.1,146.36l-15.46,10.12-8.85-9.81a8,8,0,0,0-11.88,10.73l13.44,14.88a8,8,0,0,0,10.32,1.33l12.43-8.13v17.89H106V133.46H154.1Z" />
          <path d="M189.77,240,170.1,252.83V242.4a8,8,0,0,0-8-8H98a8,8,0,0,0-8,8v65.92a8,8,0,0,0,8,8H162.1a8,8,0,0,0,8-8V272l28.43-18.6A8,8,0,0,0,189.77,240ZM154.1,263.3l-15.46,10.12-8.85-9.8a8,8,0,0,0-11.88,10.72l13.44,14.89a8,8,0,0,0,10.32,1.33l12.43-8.13v17.89H106V250.4H154.1Z" />
          <path d="M162.1,351.35H98a8,8,0,0,0-8,8v65.92a8,8,0,0,0,8,8H162.1a8,8,0,0,0,8-8V359.35A8,8,0,0,0,162.1,351.35Zm-8,65.92H106V367.35H154.1Z" />
        </svg>

        <div className="text-center max-w-screen-lg mb-10">
          <h1 className="font-bold text-2xl">Nutritional Content Search</h1>
          <p className="text-white m-5">
            Search for multiple ingredients and get a combined list of the
            nutrients they contain.
          </p>
          {selectedFood.length > 0 && (
            <SelectedIngredientListing selectedFood={selectedFood} />
          )}
          <MultiComboBox
            selectedFood={selectedFood}
            setSelectedFood={setSelectedFood}
            handleApiResult={handleApiResult}
            setApiResult={setApiResult} // Pass setApiResult function
          />
          {apiResult && (
            <MultiNutrientListing nutrients={apiResult} images={images} />
          )}
          {apiResult && <SaveAsDish selectedFood={selectedFood} />}
        </div>
      </div>
    </div>
  );
}
