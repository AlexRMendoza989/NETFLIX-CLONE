import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import { NavbarFilm } from "./components/NavbarFilm";
import { MovieVideo } from "./components/MovieVideo";

// Función auxiliar para obtener los datos de la película
async function getMovieData(movieId: string) {
  const movieFilm = await db.movie.findUnique({
    where: { id: movieId },
  });

  const popularMovie = await db.popularMovie.findUnique({
    where: { id: movieId },
  });

  return { movieFilm, popularMovie };
}

// Función para generar las rutas estáticas
export async function generateStaticParams() {
  // Obtén todas las películas y películas populares de la base de datos
  const movies = await db.movie.findMany({
    select: { id: true },
  });

  const popularMovies = await db.popularMovie.findMany({
    select: { id: true },
  });

  // Combina las listas de IDs
  const allMovieIds = [
    ...movies.map((movie) => ({ params: { movieId: movie.id } })),
    ...popularMovies.map((movie) => ({ params: { movieId: movie.id } })),
  ];

  return allMovieIds;
}

export default async function MovieIdPage({
  params,
}: {
  params: { movieId: string };
}) {
  if (!params.movieId) {
    redirect("/");
    return null;
  }

  const { movieFilm, popularMovie } = await getMovieData(params.movieId);

  // Redirigir si no se encuentra la película
  if (!movieFilm && !popularMovie) {
    redirect("/");
    return null;
  }

  // Determinar la película actual y su título
  const currentMovie = movieFilm?.movieVideo || popularMovie?.movieVideo || "";
  const titleMovie = movieFilm?.title || popularMovie?.title || "";

  return (
    <div className="h-screen w-full bg-black">
      <NavbarFilm titleMovie={titleMovie} />
      <MovieVideo currentMovie={currentMovie} />
    </div>
  );
}