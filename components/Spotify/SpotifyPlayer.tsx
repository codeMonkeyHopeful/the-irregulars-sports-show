const SpotifyPlayer = () => {
  return (
    <div className="spotify-player">
      <iframe
        src="https://open.spotify.com/embed/show/0YdcBxpNuJzRcQ8JddLsc9"
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};

export default SpotifyPlayer;
