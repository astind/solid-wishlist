import { useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Show, type Setter } from "solid-js";

type CheckListFormProps = {
  formAction: any;
  listId: string;
  formOpenSetter: Setter<boolean>;
  itemId?: string | number;
  itemName?: string;
  newItemSetter?: Setter<string>;
  wrapperClass?: string;
}

export default function ChecklistForm(props: CheckListFormProps) {
  const formSubmission = useSubmission(props.formAction);
  const [nameInput, setNameInput] = createSignal(props.itemName || "");
  
  function closeForm() {
    props.formOpenSetter(false)
  }
  
  createEffect(() => {
    if (formSubmission.result) {
      console.log(formSubmission.result);
      if (props.itemName && props.newItemSetter) {
        props.newItemSetter(nameInput());
        closeForm();
      } else {
        setNameInput("");
      }
    }
  });

  return (
    <div class={props.wrapperClass ? props.wrapperClass : ""}>
      <form class="w-full"
        action={props.formAction}
        method="post"
      >
        <fieldset class="flex flex-col mx-auto fieldset bg-base-200 border-base-300 rounded-box max-w-md border p-4">
          <legend class="fieldset-legend">New Task</legend>
          <input type="hidden" name="listId" value={props.listId}/>
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
              value={nameInput()}
              onInput={(e) => setNameInput(e.currentTarget.value)}
              required
            />
            <p>Enter to submit</p>
            <div class="flex justify-end mt-2 space-x-4">
              <button class="btn btn-info" type="submit">Save</button>
              <button class="btn btn-error" type="button" onClick={closeForm}>Cancel</button>
            </div>
            <Show when={formSubmission.error}>
              <p class="mt-4 text-error">
                {formSubmission.error}
              </p>
            </Show>
        </fieldset>
      </form>
    </div>
  )
}