export type List = {
  name: string;
  id: string;
  description?: string;
  listType: "wishlist" | "checklist";
  private: boolean;
  isOwner?: boolean;
}

export type ListSortOptions = "price-up" | "price-down" | "rank" | "name" | "date"

