import { useState } from "react";

const URLShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleShorten = async () => {
    setError(""); // Clear previous errors
    setShortUrl("");

    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }),
      });

      if (!res.ok) throw new Error("Failed to shorten URL");

      const data = await res.json();
      setShortUrl(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/r/${data.data.short_code}`);
    } catch (err) {
      setError("Something went wrong! Try again.");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔗 URL Shortener</h1>
      <div className="flex space-x-2">
        <input
          className="border p-2 flex-1 rounded"
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-[#00D095] text-white px-4 py-2 rounded hover:bg-[#00B984] transition"
          onClick={handleShorten}
        >
          Shorten
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {shortUrl && (
        <p className="mt-4">
          Shortened URL:{" "}
          <a href={shortUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default URLShortener;
