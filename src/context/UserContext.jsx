//Sirve para compartir información entre componentes 
// sin tener que pasar props manualmente
//ya que Se crea una vez y cualquier componente puede acceder al usuario directamente.
import { createContext } from "react";

export const UserContext = createContext(null);
