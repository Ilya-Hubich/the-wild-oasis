import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./useDeleteBooking";
import { useMoveBack } from "../../hooks/useMoveBack";

function DeleteBooking({ bookingId, children }) {
  const { isDeleting, deleteBooking } = useDeleteBooking();
  const moveBack = useMoveBack();

  return (
    <Modal>
      <Modal.Open opens="delete-booking">{children}</Modal.Open>

      <Modal.Window name="delete-booking">
        <ConfirmDelete
          resourceName="booking"
          onConfirm={() => {
            deleteBooking(bookingId);
            moveBack();
          }}
          disabled={isDeleting}
        />
      </Modal.Window>
    </Modal>
  );
}

export default DeleteBooking;
