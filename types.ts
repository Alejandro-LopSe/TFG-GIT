//Usuario
export type User = {
  id_usuario: number;
  Nombre: string;
  Password: string;
};
export type MyState = {
  id_usuario: number;
  Nombre: string;
  route: string;
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< BBDD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export type BBDD_Cliente = {
  id_cliente: number;
  Nombre: string;
  Apellidos: string;
  DNI: string;
  id_contacto: number;
  id_direccion: number;
  Fecha_mod: string;
  Activo: boolean;
  OBSERVACIONES: string;
};
export type BBDD_Contacto = {
  id_contacto: number;
  id_cliente: number;
  id_empresa: number;
  Telefono: string;
  Fijo: string;
  Email: string;
  activo: boolean;
  OBSERVACIONES: string;
};
export type BBDD_Direccion = {
  id_direccion: number;
  id_cliente: number;
  id_empresa: number;
  tipo_via: string;
  direccion: string;
  codigo_postal: string;
  localidad: string;
  municipio: string;
  provincia: string;
  activo: boolean;
  OBSERVACIONES: string;
};
export type BBDD_Empresa = {
  id_empresa: number;
  Razon_Social: string;
  id_cliente: number;
  CIF: string;
  id_contacto: number;
  id_direccion: number;
  activo: boolean;
  OBSERVACIONES: string;
};

export type BBDD_Articulo = {
  iloc: "Articulo";
  id_articulo: number;
  nombre: string;
  tamano: BBDD_Tamano;
  tipo_aceite: BBDD_Aceite;
  envase: BBDD_Envase;
  cantidad: number;
  precio: number;
  Tipo_IVA: BBDD_IVA;
  OBSERVACIONES: string;
};
export type BBDD_IVA = {
  iloc: "IVA";
  id: number;
  tipo: number;
  actualizado: string;
  usuario_actualizador: string;
};
export type BBDD_Aceite = {
  iloc: "Aceite";
  id: number;
  tipo: string;
  OBSERVACIONES: string;
};
export type BBDD_Envase = {
  iloc: "Envase";
  id: number;
  tipo: string;
  OBSERVACIONES: string;
};
export type BBDD_Tamano = {
  iloc: "Tamano";
  id: number;
  tipo: string;
  OBSERVACIONES: string;
};

export type dics = {
  tamano: BBDD_Tamano[];
  envase: BBDD_Envase[];
  iva: BBDD_IVA[];
  tipo_aceite: BBDD_Aceite[];
};
