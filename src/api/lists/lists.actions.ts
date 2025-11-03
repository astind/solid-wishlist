import { action, query } from "@solidjs/router";
import { deleteCheckedItems, getItems, getPublicListItems, getPublicLists, getUserLists, newChecklistItem, newList, newWishlistItem, removeList, removeListItem, toggleComplete, updateListItem } from "./lists.controller";

export const getListsQuery = query(getUserLists, "getLists");
export const newListAction = action(newList, "newList");
export const deleteListAction = action(removeList, "removeList");
export const getListItemsQuery = query(getItems, "getItems");
export const addChecklistItemAction = action(newChecklistItem, "newChecklistItem");
export const addWishlistItemAction = action(newWishlistItem, "newWishlistItem");
export const deleteCompletedAction = action(deleteCheckedItems, "deleteCheckedItems");
export const toggleCompleteAction = action(toggleComplete, "toggleComplete");
export const deleteListItemAction = action(removeListItem, "deleteItem");
export const updateListItemAction = action(updateListItem, "updateListItem");
export const getPublicListsQuery = query(getPublicLists, "getPublicLists");
export const getPublicListItemsQuery = query(getPublicListItems, "getPublicListItems");
