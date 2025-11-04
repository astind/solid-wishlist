export type List = {
  name: string;
  id: string;
  description?: string;
  listType: "wishlist" | "checklist";
  private: boolean;
}