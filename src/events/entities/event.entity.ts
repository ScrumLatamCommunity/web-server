export class Events {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  recurrency: string;
  time: string[];
  inscriptions: string[];
  image: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

//Agregar quien es el editor del evento (relacion tabla de usuarios)
//Agregar enlace del evento!

//ESTADOS DEL EVENTO: Borrador, Aprovado, Publicado, Rechazado, Pendiente
