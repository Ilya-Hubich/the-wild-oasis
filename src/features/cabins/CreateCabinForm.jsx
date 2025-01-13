import { useForm } from "react-hook-form";

import CabinForm from "./CabinForm";

import { useCreateCabin } from "./useCreateCabin";

function CreateCabinForm({ onCloseModal }) {
  const form = useForm();
  const { isCreating, createCabin } = useCreateCabin();

  function onSubmit(data) {
    createCabin(
      { ...data, image: data.image[0] },
      {
        onSuccess: () => {
          form.reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <CabinForm
      onSubmit={onSubmit}
      isLoading={isCreating}
      {...form}
      onCloseModal={onCloseModal}
    />
  );
}

export default CreateCabinForm;
