import { createEffect, createSignal, Setter, Show } from "solid-js";
import { type WishlistItem } from "~/api/models/wishlist-item.model";
import WishlistForm from "./wishlist-form";

type WishlistItemProps = {
  item: WishlistItem
  index: number;
  itemId: number;
  listId: string;
  editIndex: number;
  deleteIndex: number
  editAction: any;
  deleteAction: any;
  openEditSetter: Setter<number>;
  openDeleteSetter: Setter<number>;
}

export default function WishlistItem(props: WishlistItemProps) {
  const [item, setItem] = createSignal(props.item);
  const [isEditClosed, setIsEditClosed] = createSignal(true);

  createEffect(() => {
    if (!isEditClosed()) {
      closeDropDown();
      setIsEditClosed(true);
    }
  })

  function closeDropDown() {
    props.openEditSetter(-1);
    props.openDeleteSetter(-1);
  }

  function openDropDown(edit: boolean = true) {
    if (edit) {
      props.openDeleteSetter(-1);
      props.openEditSetter(props.index);
    } else {
      props.openEditSetter(-1);
      props.openDeleteSetter(props.index);
    }
  }

  return (
    <li class="grid grid-cols-10 py-5 first:pt-0 last:pb-0 last:border-b-0 border-b border-base-200">
      <Show when={item().iconLink}>
        <div class="col-span-2 md:col-span-1 flex items-center">
          <img src={item().iconLink} alt="list item" />
        </div>
      </Show>
      <div class={item().iconLink ? 'col-span-6 md:col-span-7 flex flex-col justify-center' : 'col-span-8 flex flex-col justify-center'}>
        <div class="flex justify-between text-xl">
          <div class="font-semibold">
            {item().name}
          </div>
        </div>
        <Show when={item().url}>
          <div class="text-sm truncate text-ellipsis mt-1">
            <a rel="external" class="link" href={item().url} target="_blank">{item().url}</a>
          </div>
        </Show>
        <Show when={item().description}>
          <div class="mt-1">
            {item().description}
          </div>
        </Show>
      </div>
      <div class="col-span-2 flex justify-end items-start">
        <div class="flex md:space-x-2 items-center justify-end">
          <Show when={item().price}>
            <div class="text-xl mr-1">
              ${item().price}
            </div>
          </Show>
          <button aria-label="Edit Item" onclick={() => openDropDown(true)} class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>
          <button aria-label="Delete Item" onclick={() => openDropDown(false)} class="hidden md:flex btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="col-span-10">
        <Show when={props.deleteIndex === props.index}>
          <form class="mt-2 flex flex-col md:flex-row items-center" action={props.deleteAction} method="post">
            <div>
              <input type="hidden" name="itemId" value={props.itemId} />
              <input type="hidden" name="listId" value={props.listId} />
              Are you sure you want to delete this item?
            </div>
            <div class="md:ml-4 mt-4 md:mt-0 flex justify-end space-x-2">
              <button type="button" class="btn btn-info" onClick={closeDropDown}>Cancel</button>
              <button type="submit" class="btn btn-error">Delete</button>
            </div>
          </form>
        </Show>
        <Show when={props.editIndex === props.index}>
          <div class="md:hidden flex justify-end mt-2">
            <button type="button" class="btn btn-square btn-ghost" aria-label="Delete item" onClick={() => openDropDown(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
          <WishlistForm
            listId={props.listId}
            itemId={props.itemId}
            existingItem={item()}
            formAction={props.editAction}
            formOpenSetter={setIsEditClosed}
            newValueSetter={setItem}
          ></WishlistForm>
        </Show>
      </div>
    </li>
  )
}