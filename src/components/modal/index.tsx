function Modal({ child }: { child: JSX.Element }) {
  return (
    <dialog id="generic-modal" className="modal modal-bottom md:modal-middle">
      <div className="modal-box">{child}</div>
      <form method="dialog" className="modal-backdrop">
        <button />
      </form>
    </dialog>
  );
}

export default Modal;
