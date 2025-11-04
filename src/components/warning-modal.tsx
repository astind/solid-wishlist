import { type Setter } from "solid-js";

type WarningModalProps = {
  title: string;
  text: string;
  confirmText?: string,
  cancelText?: string
  responseSetter: Setter<"close" | "confirm" | "open">
}


export default function WarningModal(props: WarningModalProps) {

  return (
    <div class="modal-box">
      <h3 class="text-lg font-bold">{props.title}</h3>
      <p class="py-4">{props.text}</p>
      <div class="modal-action">
        <button class="btn btn-info" onClick={() => props.responseSetter("confirm")}>{props.confirmText || "Confirm"}</button>
        <button class="btn btn-error" onClick={() => props.responseSetter("close")}>{props.cancelText || "Cancel"}</button>
      </div>
    </div>
  )
}