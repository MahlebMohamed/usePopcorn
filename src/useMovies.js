import { useState, useEffect } from 'react'

const KEY = "32127572";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(
        function () {
            const controller = new AbortController();
            // callBack?.()

            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");
                    const response = await fetch(
                        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                        { signal: controller.signal }
                    );

                    if (!response.ok)
                        throw new Error("Something went wrong with fetching movies");

                    const data = await response.json();

                    if (data.Response === "False")
                        throw new Error("Movies not found");

                    setMovies(data.Search);
                    setError('');
                } catch (err) {
                    if (err.name !== 'AbortError')
                        setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }

            fetchMovies();

            return function () {
                controller.abort();
            }
        },
        [query]
    );

    return [movies, error, isLoading];
}
