import { FunctionalComponent } from "preact";

export const Lable_texto: FunctionalComponent<
  { label: string; texto: string }
> = (
  { label, texto },
) => {
  return (
    <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
      <div class="font-bold">{label}</div>
      <div>{texto}</div>
    </div>
  );
};
