import { FunctionalComponent } from "preact";
import {
  BBDD_Cliente,
  BBDD_Contacto,
  BBDD_Direccion,
  BBDD_Empresa,
} from "../../types.ts";
import { useEffect, useState } from "preact/hooks";
import { Lable_notas } from "../../components/Generales/Lable_notas.tsx";
import { Lable_texto_col } from "../../components/Generales/Label_texto_col.tsx";

export const Anadir_Cliente: FunctionalComponent = () => {
  const [base, setbase] = useState<Partial<BBDD_Cliente>>();
  const [dir, setdir] = useState<Partial<BBDD_Direccion>>();
  const [cont, setcont] = useState<Partial<BBDD_Contacto>>();

  const [emp, setemp] = useState<Partial<BBDD_Empresa>>();
  const [es_empresa, setes_empresa] = useState<boolean>(false);
  const [nueva, setnueva] = useState<boolean>(true);
  const [save, setsave] = useState<boolean>(true);
  const [cifs, setcifs] = useState<{ CIF: string }[]>([]);
  const [cif, setcif] = useState<string>("");

  const [cifsel, setcifsel] = useState<string>("");
  useEffect(() => {
    if (!nueva) {
      const fetchData = async () => {
        const res = await fetch(`/Api/Empresa/CIFS?cif=${cif}`);

        const d = await res.json();
        if (res.ok) {
          setcifs(d);
          console.log("Datos actualizados");
        } else {
          console.error("Error al cargar datos:", res.statusText);
        }
      };
      fetchData();
    }
  }, [cif, nueva]);
  const GetEMP = async (c: string) => {
    console.log(c);

    const res = await fetch(`/Api/Empresa/Empresa?cif=${c}`);

    const d = await res.json();
    if (res.ok) {
      setemp(d[0]);
      console.log("Datos actualizados:", d);
    } else {
      console.error("Error al cargar datos:", res.statusText);
    }
  };
  const comprobar = () => {
    if (!base || !dir || !cont) {
      setsave(true);
    } else {
      setsave(false);
    }
  };
  const fetchData = async () => {
    const body: [
      Partial<BBDD_Cliente>,
      Partial<BBDD_Direccion>,
      Partial<BBDD_Contacto>,
      Partial<BBDD_Empresa>,
      boolean,
      boolean,
    ] = [
      base!,
      dir!,
      cont!,
      emp!,
      nueva,
      es_empresa,
    ];
    const res = await fetch(`http://localhost:8000/Api/Cliente/Cliente`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("body: \n", body, "\nres: \n", res);
    const d = await res.text();
    console.log(d);

    if (res.ok) {
      console.log("Cliente insertado", res);
      const redirectedUrl = new URL(res.url);
      globalThis.location.href = redirectedUrl.pathname;
    } else {
      console.error("Error al cargar datos:", res.statusText);
    }
  };
  return (
    <div class="flex flex-col justify-center h-fit w-fit items-start p-2 m-1 text-black border-gray-800 border-solid rounded-md border-2">
      <div class="flex flex-row justify-center h-fit w-fit items-start">
        <div class="m-1">
          Info Base
          <div class="flex flex-col h-full w-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2">
            <label for="nombre">Nombre</label>
            <input
              onInput={(e) => {
                setbase({ ...base, Nombre: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Fulano Mª Jose"
              value={base?.Nombre}
            />
            <label for="apellidos">Apellidos</label>
            <input
              onInput={(e) => {
                setbase({ ...base, Apellidos: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="apellidos"
              name="apellidos"
              placeholder="Lopez Serrano"
              value={base?.Apellidos}
            />
            <label for="DNI">DNI</label>
            <input
              onInput={(e) => {
                setbase({ ...base, DNI: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="DNI"
              name="DNI"
              placeholder="1234567890C"
              value={base?.DNI}
            />
            <label for="notas">Notas</label>
            <textarea
              onInput={(e) => {
                setbase({ ...base, OBSERVACIONES: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="notas"
              name="notas"
              placeholder="Añadir telefono..."
              value={base?.OBSERVACIONES}
            />
          </div>
        </div>
        <div class="m-1">
          Info Contacto
          <div class="flex flex-col h-full w-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2">
            <label for="telefono_1">Telefono 1</label>
            <input
              onInput={(e) => {
                setcont({ ...cont, Telefono: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="telefono_1"
              name="telefono_1"
              placeholder="23456789"
              value={cont?.Telefono}
            />
            <label for="telefono_1">Telefono 2</label>
            <input
              onInput={(e) => {
                setcont({ ...cont, Fijo: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="telefono_2"
              name="telefono_2"
              placeholder="23456789"
              value={cont?.Fijo}
            />
            <label for="email">Email</label>
            <input
              onInput={(e) => {
                setcont({ ...cont, Email: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="email"
              id="email"
              name="email"
              placeholder="email@email.fin"
              value={cont?.Email}
            />
            <label for="notas">Notas</label>
            <textarea
              onInput={(e) => {
                setcont({ ...cont, OBSERVACIONES: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="notas"
              name="notas"
              placeholder="Añadir telefono..."
              value={cont?.OBSERVACIONES}
            />
          </div>
        </div>
        <div class="m-1">
          Info Direccion
          <div class="flex flex-col h-full w-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2">
            <label for="calle">Calle</label>
            <input
              onInput={(e) => {
                setdir({ ...dir, direccion: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="calle"
              name="calle"
              placeholder="C\ Olmillo 56, 1ºB"
              value={dir?.direccion}
            />
            <label for="localidad">Localidad</label>
            <input
              onInput={(e) => {
                setdir({ ...dir, localidad: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="localidad"
              name="localidad"
              placeholder="Entrepeñas"
              value={dir?.localidad}
            />
            <label for="municipio">Municipio</label>
            <input
              onInput={(e) => {
                setdir({ ...dir, municipio: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="municipio"
              name="municipio"
              placeholder="Auñon"
              value={dir?.municipio}
            />
            <label for="provincia">Provincia</label>
            <input
              onInput={(e) => {
                setdir({ ...dir, provincia: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="provincia"
              name="provincia"
              placeholder="Guadalajara"
              value={dir?.provincia}
            />
            <label for="cp">CP</label>
            <input
              onInput={(e) => {
                setdir({ ...dir, codigo_postal: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="cp"
              name="cp"
              placeholder="19130"
              value={dir?.codigo_postal}
            />
            <label for="notas">Notas</label>
            <textarea
              onInput={(e) => {
                setdir({ ...dir, OBSERVACIONES: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="notas"
              name="notas"
              placeholder="Añadir telefono..."
              value={dir?.OBSERVACIONES}
            />
          </div>
        </div>
        <div class="m-1">
          Info Empresa
          <div class="flex flex-col h-full w-min items-start p-2  text-black border-gray-800 border-solid rounded-md border-2">
            <div class="flex flex-row">
              <label for="empresa">Tiene Empresa:</label>
              <input
                class="ml-4"
                type="checkbox"
                id="es_empresa"
                name="es_empresa"
                checked={es_empresa}
                onInput={() => {
                  setes_empresa(!es_empresa);
                }}
              />
            </div>
            <div class="flex flex-row">
              <label for="empresa">Nueva Empresa</label>
              <input
                class="ml-4"
                type="checkbox"
                id="nueva"
                name="empresa"
                checked={nueva}
                onInput={() => {
                  setnueva(!nueva);

                  setcifsel("");
                }}
              />
            </div>
            {es_empresa
              ? (nueva
                ? (
                  <>
                    <label for="razon_social">Razon Social</label>
                    <input
                      onInput={(e) => {
                        setemp({ ...emp, Razon_Social: e.currentTarget.value });
                      }}
                      class="border-gray-300 border-solid rounded-md border-2"
                      type="text"
                      id="razon_social"
                      name="razon_social"
                      placeholder="SAT Alcarria Baja"
                      value={emp?.Razon_Social}
                    />
                    <label for="CIF">CIF</label>
                    <input
                      onInput={(e) => {
                        setemp({ ...emp, CIF: e.currentTarget.value });
                      }}
                      class="border-gray-300 border-solid rounded-md border-2"
                      type="text"
                      id="CIF"
                      name="CIF"
                      placeholder="F345678 Alcarria Baja"
                      value={emp?.CIF}
                    />
                    <label for="OBSERVACIONESEMP">CIF</label>
                    <input
                      onInput={(e) => {
                        setemp({
                          ...emp,
                          OBSERVACIONES: e.currentTarget.value,
                        });
                      }}
                      class="border-gray-300 border-solid rounded-md border-2"
                      type="text"
                      id="OBSERVACIONESEMP"
                      name="OBSERVACIONESEMP"
                      placeholder="F345678 Alcarria Baja"
                      value={emp?.CIF}
                    />
                  </>
                )
                : cifsel != ""
                ? (
                  <a
                    class="flex flex-col cursor-pointer overflow-hidden text-black border-gray-600 border-solid rounded-md border-2 mr-2"
                    id={`empresa-${emp?.id_direccion}`}
                    href={`/Empresas/${emp?.id_empresa}`}
                  >
                    <Lable_texto_col
                      label="Razon Social:"
                      texto={emp?.Razon_Social || ""}
                    />
                    <Lable_texto_col label="CIF:" texto={emp?.CIF || ""} />
                    <Lable_notas
                      label="OBSERVACIONES:"
                      texto={emp?.OBSERVACIONES || ""}
                    />
                  </a>
                )
                : (
                  <>
                    <input
                      class=" border-gray-300 border-solid rounded-md border-2"
                      type="text"
                      id="cif"
                      name="cif"
                      onInput={(e) => {
                        setcif(e.currentTarget.value);
                      }}
                    />
                    <ul class="flex flex-col overflow-x-scroll h-40 w-full pl-4">
                      {cifs.map((ci: { CIF: string }) => {
                        console.log(ci);

                        return (
                          <option
                            value={ci.CIF}
                            key={ci.CIF}
                            onClick={() => {
                              setcifsel(ci.CIF);
                              console.log(cifsel);
                              GetEMP(ci.CIF);
                              console.log(cifsel);
                            }}
                          >
                            {ci.CIF}
                          </option>
                        );
                      })}
                    </ul>
                  </>
                ))
              : <></>}
            <label for="notas">Notas</label>
            <textarea
              onInput={(e) => {
                setemp({ ...emp, OBSERVACIONES: e.currentTarget.value });
              }}
              class="border-gray-300 border-solid rounded-md border-2"
              type="text"
              id="notas"
              name="notas"
              placeholder="Añadir telefono..."
              value={emp?.OBSERVACIONES}
            />
          </div>
        </div>
      </div>
      <div class="flex flex-row">
        <button
          type="button"
          class="m-3 text-black border-gray-800 border-solid rounded-md border-2 px-2"
          onClick={comprobar}
        >
          Comprobar
        </button>
        <button
          type="button"
          class={save
            ? "m-3 text-gray-400 border-gray-400 border-solid rounded-md border-2 px-2"
            : "m-3 text-black border-gray-800 border-solid rounded-md border-2 px-2"}
          disabled={save}
          onClick={fetchData}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};
