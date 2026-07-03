import { FunctionalComponent } from "preact";

export const Lable_texto_col: FunctionalComponent<
  { label: string; texto: string }
> = (
  { label, texto },
) => {
  return (
    <div class="flex flex-col justify-start p-2  text-black ">
      <div class="font-bold ">{label}</div>
      <div class=" overflow-hidden">{texto}</div>
    </div>
  );
};
