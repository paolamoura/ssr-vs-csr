export default function Home({ pokemons }) {
  return (
    <div style={{ padding: 24, background: "#f7f7fb", minHeight: "100vh" }}>
      <header>
        <h1>SSR — Pokémons (Server-Side Rendering)</h1>
        <p>Conteúdo pré-carregado no servidor (getServerSideProps).</p>
      </header>

      <main
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {pokemons.map((p) => (
          <article
            key={p.id}
            style={{
              background: "white",
              padding: 12,
              borderRadius: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
              textAlign: "center",
            }}
          >
            {p.sprite ? (
              <img
                src={p.sprite}
                alt={p.name}
                width={96}
                height={96}
                decoding="async"
              />
            ) : (
              <div
                style={{
                  width: 96,
                  height: 96,
                  background: "#eee",
                  borderRadius: 8,
                  display: "inline-block",
                }}
              >
                sem imagem
              </div>
            )}
            <h3 style={{ textTransform: "capitalize" }}>{p.name}</h3>
            <small>#{p.id}</small>
          </article>
        ))}
      </main>

      <footer style={{ marginTop: 24 }}>
        <p>Exemplo SSR — PokéAPI</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=250");
    const data = await res.json();
    const results = data.results;

    const detailed = await Promise.all(
      results.map((r) => fetch(r.url).then((res) => res.json()))
    );

    const pokemons = detailed.map((d) => ({
      id: d.id,
      name: d.name,
      sprite: d.sprites?.front_default || null,
    }));

    return { props: { pokemons } };
  } catch (err) {
    console.error("Erro SSR:", err);
    return { props: { pokemons: [] } };
  }
}
