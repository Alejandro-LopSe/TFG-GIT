import { FunctionalComponent } from "preact";

export const Lable_notas: FunctionalComponent<
  { label: string; texto: string }
> = (
  { label, texto },
) => {
  return (
    <div class="flex flex-col justify-start h-full p-2  space-x-2 text-black ">
      <div class="font-bold">{label}</div>
      <textarea
        value={texto}
        class="flex w-full h-1/2  border-gray-800 border-solid rounded-md border-2 p-2 text-black resize-none"
      />
    </div>
  );
};
