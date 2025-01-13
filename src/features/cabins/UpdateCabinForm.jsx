import { useForm } from "react-hook-form";

import CabinForm from "./CabinForm";
import { useUpdateCabin } from "./useUpdateCabin";

function UpdateCabinForm({ cabin, onCloseModal }) {
  const { isUpdating, updateCabin } = useUpdateCabin();

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    updateCabin({ ...data, image, id: data.id });
    onCloseModal();
  }

  const form = useForm({
    defaultValues: cabin,
  });

  return (
    <CabinForm
      cabin={cabin}
      isLoading={isUpdating}
      onSubmit={onSubmit}
      {...form}
      onCloseModal={onCloseModal}
    />
  );
}

export default UpdateCabinForm;
