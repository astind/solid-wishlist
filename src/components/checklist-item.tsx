import { useAction, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Setter, Show } from "solid-js";
import ChecklistForm from "./checklist-form";

type CheckListItemProps = {
  name: string;
  index: number;
  itemId: number;
  listId: string;
  checked: boolean;
  editIndex: number;
  deleteIndex: number
  toggleAction: any;
  editAction: any;
  deleteAction: any;
  openEditSetter: Setter<number>;
  openDeleteSetter: Setter<number>;
  checkedSetter: Setter<number>;
}

export default function ChecklistItem(props: CheckListItemProps) {
  const [itemName, setItemName] = createSignal(props.name)
  const [itemChecked, setItemChecked] = createSignal(props.checked);
  const [isEditClosed, setIsEditClosed] = createSignal(true);
  
  const toggleAction = useAction(props.toggleAction)

  function toggleChecked() {
    setItemChecked(!itemChecked());
    if (itemChecked()) {
      props.checkedSetter((prev) => prev + 1);
    } else {
      props.checkedSetter((prev) => prev - 1);
    }
    toggleAction(props.itemId);
  }

  createEffect(() => {
    if (!isEditClosed()) {
      props.openEditSetter(-1);
      setIsEditClosed(true);
    }
  })

  return (
    <li class="grid grid-cols-10 py-5 first:pt-0 last:pb-0 last:border-b-0 border-b border-base-200">
      <div class="col-span-2 md:col-span-1 flex items-center">
        <input type="checkbox" class="checkbox checkbox-xl checkbox-success" checked={itemChecked()} onChange={toggleChecked} />
      </div>
      <div class="col-span-6 md:col-span-7 flex flex-col justify-center">
        <div class="flex justify-between text-xl">
          <div class="font-semibold">
            {itemName()}
          </div>
        </div>
      </div>
      <div class="col-span-2 flex justify-end items-center md:items-start">
        <div class="flex md:space-x-2 items-center justify-end">
          <button aria-label="Edit Item" onclick={() => props.openEditSetter(props.index)} class="btn btn-square btn-ghost">
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
          <button aria-label="Delete Item" onclick={() => props.openDeleteSetter(props.index)} class="hidden md:flex btn btn-square btn-ghost">
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
              <button type="button" class="btn btn-info" onClick={() => props.openDeleteSetter(-1)}>Cancel</button>
              <button type="submit" class="btn btn-error">Delete</button>
            </div>
          </form>
        </Show>
        <Show when={props.editIndex === props.index}>
          <div class="md:hidden flex justify-end mt-2">
            <button type="button" class="btn btn-square btn-ghost" aria-label="Delete item" onClick={() => props.openDeleteSetter(props.index)}>
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
          <ChecklistForm
            formAction={props.editAction}
            listId={props.listId}
            itemId={props.itemId}
            itemName={itemName()}
            newItemSetter={setItemName}
            formOpenSetter={setIsEditClosed}
            >
          </ChecklistForm>
        </Show>
      </div>
    </li>
  )
}