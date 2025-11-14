export type WishlistItem = {
  name: string, 
  description?: string, 
  url?: string, 
  price?: string, 
  iconLink?: string
  done: boolean,
  doneBy?: string
  favorite: boolean,
}