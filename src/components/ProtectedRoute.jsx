import { Navigate } from "@tanstack/react-router";//TanStack Router


import { getSession } from "../services/authService";// Esta función obtiene la sesión del usuario que inició sesión


// Recibe
// children, lo que se quiere mostrar
// requiredRole, el rol necesario para entrar
function ProtectedRoute({ children, requiredRole }) {

  const user = getSession();  // guarda la información del usuario que tiene sesion iniciada


  // Si NO hay usuario logueado
  if (!user) {

    // Redirecciona al login
    return (
      <Navigate
        to="/login"
        replace
        search={{ redirect: location.pathname }}
      />
    );
  }

  // Si existe requiredRole
  // y el rol del usuario es diferente
  if (requiredRole && user.role !== requiredRole) {

    // Lo manda al inicio
    return <Navigate to="/" replace />;
  }

  return children; //si todo está correcto muestra el contenido protegido
}

// Exporta el componente
export default ProtectedRoute;