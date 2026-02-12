import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  movies: Movie[] | null;
  setMovies: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  setMovies,
  movies,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loadingButtonFindAMovie, setLoadingButtonFindAMovie] = useState(false);
  const [buttonFindAMovie, setButtonFindAMovie] = useState(false);
  const [haveError, setHaveError] = useState(false);

  const moviesNotFound = movie?.Response === 'False';

  const changeFindMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setLoadingButtonFindAMovie(true);

    getMovie(query)
      .then(data => {
        setMovie(data);

        if (data.Response === 'False') {
          setHaveError(true);
        } else {
          setHaveError(false);
          setButtonFindAMovie(true);
        }
      })
      .finally(() => {
        setLoadingButtonFindAMovie(false);
      });
  }

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className={haveError ? 'input is-danger' : 'input'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setHaveError(false);
              }}
            />
          </div>

          {haveError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loadingButtonFindAMovie ? 'is-loading' : ''}`}
              disabled={!query.trim()}
              onClick={changeFindMovie}
            >
              <p className={loadingButtonFindAMovie ? 'is-loading' : ''}>
                Find a movie
              </p>
            </button>
          </div>

          {!moviesNotFound && query.length > 0 && buttonFindAMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={event => {
                  event.preventDefault();

                  if (!movie) {
                    return;
                  }

                  const alreadyExists = movies.some(
                    m => m.imdbID === movie.imdbID,
                  );

                  if (alreadyExists) {
                    setQuery('');
                    setMovie(null);
                    setButtonFindAMovie(false);
                  } else {
                    setMovies(prev => [...prev, movie]);
                    setQuery('');
                    setMovie(null);
                    setButtonFindAMovie(false);
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && !moviesNotFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
