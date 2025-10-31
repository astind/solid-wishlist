import { useSubmission } from "@solidjs/router";
import { createEffect, Show, type Setter } from "solid-js";
import { createStore } from "solid-js/store";
import { type WishlistItem } from "~/api/models/wishlist-item.model";

type WishlistFormProps = {
  formAction: any;
  listId: string;
  formOpenSetter: Setter<boolean>;
  existingItem?: WishlistItem;
  wrapperClass?: string;
  itemId?: string | number;
  newValueSetter?: Setter<WishlistItem>
}

export default function WishlistForm(props: WishlistFormProps) {
  const [editItem, setEditItem] = createStore(props.existingItem || {
    name: undefined,
    description: undefined,
    url: undefined,
    price: undefined,
    iconLink: undefined
  });
  const formSubmission = useSubmission(props.formAction);
  let newForm = true;
  if (props.existingItem) {
    newForm = false;
  }

  function closeForm() {
    console.log('closing form');
    props.formOpenSetter(false);
  }

  function clearStore() {
    setEditItem('name', undefined);
    setEditItem('description', undefined);
    setEditItem('price', undefined);
    setEditItem('url', undefined);
    setEditItem('iconLink', undefined);
  }

  createEffect(() => {
    if (formSubmission.result) {
      console.log(formSubmission.result);
      closeForm();
      if (newForm) {
        clearStore();
      } else if (props.newValueSetter) {
        props.newValueSetter(editItem as WishlistItem)
      }
      formSubmission.clear();
    }
  });
  
  return (
    <div class={props.wrapperClass ? props.wrapperClass : ""}>
      <form class="w-full"
        action={props.formAction}
        method="post"
      >
        <fieldset class="flex flex-col mx-auto fieldset bg-base-200 border-base-300 rounded-box max-w-md border p-4">
          <legend class="fieldset-legend">New List Item</legend>
          <input type="hidden" name="listId" value={props.listId} />
          <Show when={props.itemId}>
            <input type="hidden" name="itemId" value={props.itemId}/>
          </Show>

          <label class="label" for="name">Name*</label>
          <input
            class="input w-full"
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={editItem.name || ""}
            onInput={(e) => setEditItem('name', e.currentTarget.value)}
            required
          />

          <label for="description" class="label">Description</label>
          <textarea
            class="textarea w-full"
            placeholder="Description"
            id="description"
            name="description"
            value={editItem.description || ""}
            onInput={(e) => setEditItem('description', e.currentTarget.value)}
          ></textarea>

          <label class="label" for="link">URL/Link</label>
          <input class="input w-full" type="text" id="link" name="link" placeholder="Link" value={editItem.url || ""} 
            onInput={(e) => setEditItem('url', e.currentTarget.value)}/>

          <label for="price" class="label">Price</label>
          <div class="input w-full">
            $
            <input type="number" class="grow" placeholder="Price" name="price" step="0.01" value={editItem.price || ""}
              onInput={(e) => setEditItem('price', e.currentTarget.value)}/>
          </div>

          {/* <label class="label mt-2">
            <input type="checkbox" class="checkbox" name="autoDelete" />
            Auto-delete item if bought
          </label> */}

          <div class="flex justify-end space-x-4 mt-2">
            <button class="btn btn-info" type="submit">Save</button>
            <button class="btn btn-error" type="button" onClick={closeForm}>Cancel</button>
          </div>

          <Show when={formSubmission.error}>
<           p class="mt-4 text-error">
              {formSubmission.error}
            </p>
          </Show>
          
        </fieldset>
      </form>
    </div>
  )
}