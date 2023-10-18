import React from "react";
import "../css/UserFeed.css";
import logo from "../assets/logo.png";
import comida from "../assets/comida1.jpg";
import { Link } from "react-router-dom"; // Importa Link de react-router-dom

function UserFeed() {
  // const [recipes, setRecipes] = useState([]); // Estado para almacenar las recetas

  // useEffect(() => {
  //   // Para traer los datos del backend
  //   fetch("URL_DEL_BACKEND/recetas")
  //     .then((response) => response.json())
  //     .then((data) => setRecipes(data))
  //     .catch((error) => console.error("Error al obtener recetas:", error));
  // }, []);
  const recipes = [
    {
      id: 1,
      name: "Macarrones con patatas",
      image: comida,
    },
    {
      id: 2,
      name: "Tortilla",
      image: comida,
    },
    {
      id: 3,
      name: "Pollo al ast",
      image: comida,
    },
    {
      id: 4,
      name: "Verduras asadas",
      image: comida,
    },
  ];

  return (
    <div className="user-feed-container">
      {/* Encabezado (igual al de las otras páginas) */}
      <header className="header">
        <img src={logo} alt="Kasula" className="logo" />
        <h1>Kasula</h1>
        {/* <Link to="/logout" className="logout-link">
          Logout
        </Link> */}
      </header>
      <div className="background-image"></div>

      {/* Contenedor de recetas */}
      <div className="recipe-container">
        <div className="recipe-container">
          {recipes.map((recipe) => (
            <a
              key={recipe.id}
              href={`/detalleReceta/${recipe.id}`}
              className="recipe-link"
            >
              <div className="recipe">
                <p className="recipe-name">{recipe.name}</p>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="recipe-image"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Contenedor de recetas cuando tengamos el backend utilizamos un map */}
        {/* <div className="recipe-container">
          {recipes.map((recipe, index) => (
            <div key={index} className="recipe">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="recipe-image"
              />
              <p className="recipe-name">{recipe.name}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default UserFeed;
