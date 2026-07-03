export function Parse_Date_to_Visual(fechaISO: string) {
  const fecha = new Date(fechaISO);
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Mes comienza en 0
  const dia = fecha.getDate().toString().padStart(2, "0");
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${año} - ${horas}:${minutos}`;
}

export function Parse_Visual_to_Date(fecha: string) {
  let busqueda: string = "";
  const dia: string = fecha.substring(0, 2);

  if (dia && dia.length > 1) {
    busqueda = `${dia} `;
  } else if (dia && dia.length == 1) {
    busqueda = `0${dia} `;
  }

  const mes: string = fecha.substring(3, 5);
  busqueda = mes && dia ? `${mes}-${dia} ` : busqueda;
  const año: string = fecha.substring(6, 10);
  busqueda = año && mes && dia ? `${año}-${mes}-${dia} ` : busqueda;
  const horas: string = fecha.substring(14, 16);
  busqueda = horas && año && mes && dia
    ? `${año}-${mes}-${dia} ${horas}:`
    : busqueda;
  const minutos: string = fecha.substring(17, 19);
  busqueda = minutos && horas && año && mes && dia
    ? `${año}-${mes}-${dia} ${horas}:${minutos}:00`
    : busqueda;

  return busqueda;
}
