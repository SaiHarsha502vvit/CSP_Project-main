// filepath: e:\Coding\CSP\CSP_Project-main\components\SaveAsDish.tsx
"use client";
import { useState } from "react";
import LoadingDots from "@/components/loading-dots";
import { toast } from "react-hot-toast";
// Remove useSession import if not used elsewhere in this component after changes
// import { useSession } from "next-auth/react";

export default function SaveAsDish({ selectedFood }: any) {
  const [loading, setLoading] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  // const { data: session } = useSession(); // No longer needed to send email

  const handleSaveDishClick = async () => {
    if (!dishName.trim()) {
      toast.error("Please enter a dish name.");
      return;
    }
    if (!selectedFood || selectedFood.length === 0) {
      toast.error("Please add ingredients before saving.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/dish/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // userEmail: session?.user?.email, // REMOVE THIS LINE
          name: dishName,
          description: dishDescription,
          ingredients: selectedFood,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to save dish" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // const savedDish = await response.json(); // Optional: use the response data
      toast.success("Dish saved successfully!");
      // Optionally clear the form
      setDishName("");
      setDishDescription("");
      // Consider clearing selectedFood in the parent component if needed
    } catch (error: any) {
      console.error("Save dish error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="md:w-3/4 md:mx-auto mt-4 border rounded border-slate-800/60 p-3 mx-4 bg-slate-600/60">
        <h1 className="text-xl font-bold mb-2">
          Save these ingredients as a Dish
        </h1>
        {/* Input field for custom dish name */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4 ">
            <label className="block text-sm text-left font-semibold leading-6 text-slate-300">
              Dish Name:
            </label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-stone-300 sm:max-w-md">
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                required // Add basic required validation
                placeholder="Enter dish name"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-slate-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="col-span-5 mt-4">
          <div className="flex justify-between">
            <label className=" block text-sm font-semibold leading-6 text-slate-300">
              Short Description:
            </label>
            <span
              className="text-sm leading-6 text-gray-400"
              id="description-optional"
            >
              Optional
            </span>
          </div>
          <div className="mt-1">
            <input
              type="text"
              value={dishDescription}
              onChange={(e) => setDishDescription(e.target.value)}
              placeholder="A short description (optional)"
              className="block w-full bg-transparent rounded-md border-0 py-1.5 pl-2 text-slate-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-300 sm:text-sm sm:leading-6 "
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="mt-4 w-72 border-stone-400 bg-primary text-white hover:bg-stone-300 hover:text-slate-700 h-10 items-center justify-center rounded-md border text-sm transition-all focus:outline-none disabled:opacity-50" // Add disabled style
          onClick={handleSaveDishClick}
        >
          {loading ? <LoadingDots color="#808080" /> : "Save as a Dish"}
        </button>
      </div>
      <div></div>
    </>
  );
}