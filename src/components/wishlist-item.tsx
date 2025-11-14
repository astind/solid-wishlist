import { createEffect, createSignal, Setter, Show } from "solid-js";
import { type WishlistItem } from "~/api/models/wishlist-item.model";
import WishlistForm from "./wishlist-form";
import { useAction } from "@solidjs/router";

type WishlistItemProps = {
  item: WishlistItem
  index: number;
  itemId: number;
  listId: string;
  currentUserId?: string;
  canEdit?: boolean
  editIndex?: number;
  deleteIndex?: number
  editAction?: any;
  deleteAction?: any;
  toggleAction?: any;
  warningSetter?: Setter<"close" | "confirm" | "open">;
  warningSignal?: "close" | "confirm" | "open";
  openEditSetter?: Setter<number>;
  openDeleteSetter?: Setter<number>;
}

export default function WishlistItem(props: WishlistItemProps) {
  const [item, setItem] = createSignal(props.item);
  const [isDone, setIsDone] = createSignal(props.item.done);
  const [isEditClosed, setIsEditClosed] = createSignal(true);
  const [canEdit] = createSignal(props.canEdit !== undefined ? props.canEdit : false);
  const [doneBy, setDoneBy] = createSignal(props.item.doneBy);
  const [waitingForConfirm, setWaiting] = createSignal(false)

  let toggleAction: any = undefined;
  if (props.toggleAction) {
    toggleAction = useAction(props.toggleAction);

  }
  createEffect(() => {
    if (!isEditClosed()) {
      closeDropDown();
      setIsEditClosed(true);
    }
  })

  if (props.warningSignal) {
    createEffect(() => {
      if (waitingForConfirm() && props.warningSignal === "confirm") {
        sendToggle();
        if (props.warningSetter) {
          props.warningSetter("close");
          setWaiting(false);
        }
      }
    })
  }

  function closeDropDown() {
    if (props.openEditSetter && props.openDeleteSetter) {
      props.openEditSetter(-1);
      props.openDeleteSetter(-1);
    }
  }

  function openDropDown(edit: boolean = true) {
    if (props.openEditSetter && props.openDeleteSetter) {
      if (edit) {
        props.openDeleteSetter(-1);
        props.openEditSetter(props.index);
      } else {
        props.openEditSetter(-1);
        props.openDeleteSetter(props.index);
      }
    }
  }

  function sendToggle() {
    if (toggleAction) {
      toggleAction(props.itemId);
      if (!isDone()) {
        setDoneBy(props.currentUserId);
      }
      setIsDone((prev) => !prev);

    }
  }

  function toggleDone() {
    if (props.currentUserId) {
      sendToggle();
    } else {
      // Show a warning
      if (props.warningSetter) {
        setWaiting(true);
        props.warningSetter("open");
      }
    }
  }

  return (
    <li class="flex-col py-5 first:pt-0 last:pb-0 last:border-b-0 border-b border-base-200">
      <div class="flex space-x-2 md:space-x-4">
        <div class="grow-0 flex items-top">
          <Show when={canEdit}>
            <button class="btn btn-circle" title="Toggle Favorite">
              <Show when={item().favorite} fallback={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              }>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                </svg>
              </Show>
            </button>
          </Show>
          <Show when={item().iconLink}>
            <img src={item().iconLink} alt="list item" />
          </Show>
        </div>

        <div class="grow min-w-0 flex flex-col justify-center">
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

        <div class="grow-0 flex justify-end items-start">
          <div class="flex space-x-2 md:space-x-4 items-center justify-end">
            <Show when={item().price}>
              <div class="text-xl">
                ${item().price}
              </div>
            </Show>
            <Show when={canEdit()}>
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
            </Show>
          </div>
        </div>
      </div>
      {/* bottom of row */}
      <div class="flex">
        <Show when={!canEdit()}>
          <div class="flex justify-end">
            <Show when={!isDone()} fallback={
              <div class="flex flex-col space-y-2">
                <span class="font-semibold">Item Bought!</span>
                <Show when={doneBy() && doneBy() === props.currentUserId}>
                  <button class="btn btn-accent" onClick={toggleDone}>Mark as avaliable</button>
                </Show>
              </div>
            }>
              <button class="btn btn-primary" onClick={toggleDone}>Mark as bought</button>
            </Show>
          </div>
        </Show>
        <Show when={canEdit() && props.deleteIndex === props.index}>
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
        <Show when={canEdit() && props.editIndex === props.index}>
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