// useCategoryStore.ts
import { create } from "zustand";
import axios from "axios";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null | undefined;
  img: string;
  parent_id?: number | null;
}

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  fetchCategories: async () => {
    try {
      const response = await axios.get("https://parazone.tn/api/category");
      set({ categories: response.data.data });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },
}));
