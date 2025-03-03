import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RedirectPage() {
  const router = useRouter();
  const { short_code } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!short_code) return;

    const fetchOriginalUrl = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shortUrl/${short_code}`);
        const data = await response.json();
        
        if (data.error) {
          setError(true);
          setLoading(false);
        } else {
          window.location.href = data.url; // Redirect to original URL
        }
      } catch (err) {
        console.error("Error fetching URL:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchOriginalUrl();
  }, [short_code]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      {loading && <p className="text-xl">Redirecting...</p>}
      {error && <p className="text-red-500">Invalid or expired URL.</p>}
    </div>
  );
}
