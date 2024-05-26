import { useEffect, useRef, useState } from "react";
import StartRating from "./StartRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";


const KEY = "32127572";

const average = (array) =>
  array.reduce((acc, cur) => acc + cur / array.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], 'watched');
  const [movies, error, isLoading] = useMovies(query);

  function handleSelectMovie(movieId) {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <MessageError message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              // key={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} deleteWatchedMovie={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef();

  // useEffect(function () {
  //   inputEl.current.focus();
  // }, [])

  // useEffect(function () {
  //   function callBack(e) {
  //     if (document.activeElement === inputEl.current)
  //       return;

  //     if (e.code === 'Space') {
  //       inputEl.current.focus();
  //       setQuery('');
  //     }
  //   }

  //   document.addEventListener('keydown', callBack)

  //   return function () {
  //     document.removeEventListener('keydown', callBack)
  //   }
  // }, [setQuery])

  useKey(function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  }, 'Space')

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const countRef = useRef(0);

  useEffect(function () {
    if (userRating)
      countRef.current++;
  }, [userRating])

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function addWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }

    onAddWatched(newWatchedMovie);
    onCloseMovie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating((x) => (x + userRating) / 2);
  }


  // useEffect(function () {
  //   function callBack(e) {
  //     if (e.code === 'Escape')
  //       onCloseMovie();
  //   }

  //   document.addEventListener('keydown', callBack);

  //   return function () {
  //     document.removeEventListener('keydown', callBack);
  //   }
  // }, [onCloseMovie]);

  useKey(onCloseMovie, 'Escape');

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await response.json();

        setMovie(data);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedId]
  );


  useEffect(function () {
    if (title)
      document.title = `MOVIE | ${title}`;

    return function () {
      document.title = 'usePopcorn';
    }
  }, [title])

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {
                !isWatched ? (
                  <>
                    <StartRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {
                      userRating > 0 && (
                        <button className="btn-add" onClick={addWatched}>
                          + Add to list
                        </button>
                      )
                    }
                  </>
                ) : <p style={{ textAlign: 'center' }}>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              }
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, deleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} deleteWatchedMovie={deleteWatchedMovie} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, deleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>

      <button
        className="btn-delete"
        onClick={() => deleteWatchedMovie(movie.imdbID)}
      >X</button>
    </li>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function MessageError({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}


