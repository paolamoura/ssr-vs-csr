import React, { useEffect, useState } from "react";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
        const data = await res.json();
        const results = data.results;

        const detailed = await Promise.all(
          results.map((r) => fetch(r.url).then((res) => res.json()))
        );

        const list = detailed.map((d) => ({
          id: d.id,
          name: d.name,
          sprite: d.sprites?.front_default || null,
        }));

        setPokemons(list);
      } catch (err) {
        console.error(err);
        setError("Falha ao buscar Pokémons");
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  return (
    <div className="page">
      <header>
        <h1>CSR — Pokémons (Client-Side Rendering)</h1>
        <p>Conteúdo carregado no cliente após o JS inicializar.</p>
      </header>

      {loading && <p className="status">Carregando (CSR)...</p>}
      {error && <p className="status error">{error}</p>}

      <main className="grid">
        {pokemons.map((p) => (
          <article key={p.id} className="card">
            {p.sprite ? (
              <img
                src={p.sprite}
                alt={p.name}
                width={96}
                height={96}
                loading="lazy"
              />
            ) : (
              <div className="placeholder">sem imagem</div>
            )}
            <h3>{p.name}</h3>
            <small>#{p.id}</small>
          </article>
        ))}
      </main>

      <footer>
        <p>Exemplo CSR — PokéAPI</p>
      </footer>
    </div>
  );
}
