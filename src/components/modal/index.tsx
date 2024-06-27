function Modal({ child, modalId }: { child: JSX.Element; modalId: string }) {
  return (
    <dialog id={modalId} className="modal modal-bottom md:modal-middle">
      <div className="modal-box">{child}</div>
      <form method="dialog" className="modal-backdrop">
        <button />
      </form>
    </dialog>
  );
}

export default Modal;
