import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function AnalyticsPage() {
  const router = useRouter();
  const { url_id } = router.query;
  const [urlDetails, setUrlDetails] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (!url_id) return;
 
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/${url_id}?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data.data);
        setUrlDetails(data.details)
        setTotalPages(Math.ceil(data.totalCount/limit));
      })
      .catch((err) => console.error("Error fetching analytics:", err));
    
  }, [url_id, page]);

  if (!url_id) return <p>Loading...</p>;

  return (
    <div className="p-0 pt-6 md:p-6 min-h-screen">
      {/* Back to Dashboard Button */}
      <div className="mb-4">
        <Link href="/">
          <button className="px-4 py-2 text-white rounded-md cursor-pointer bg-[#00D095]">⬅ Back to Dashboard</button>
        </Link>
      </div>

      {/* URL Summary Card */}
      {urlDetails && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 overflow-scroll">
          <h2 className="text-xl font-semibold">URL Summary</h2>
          <div className="mt-2 grid grid grid-cols-1 md:grid-cols-2 text-[#1D5E6D]">
            <p><strong>URL ID:</strong> {urlDetails.id}</p>
            <p><strong>Total Clicks:</strong> {urlDetails.clicks}</p>
            <p><strong>Short URL:</strong> <a href={`process.env.NEXT_PUBLIC_FRONTEND_URL/r/${urlDetails.short_code}`} target="_blank" className="text-blue-500">{`process.env.NEXT_PUBLIC_FRONTEND_URL/r/${urlDetails.short_code}`}</a></p>
            <p><strong>Original URL:</strong> <a href={urlDetails.original_url} target="_blank" className="text-blue-500">{urlDetails.original_url}</a></p>
           
          </div>
        </div>
      )}

  
      {/* Analytics Table */}
      <div className="bg-white shadow-md rounded-xl overflow-scroll md:overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#1D5E6D] text-white text-left">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((entry, index) => (
              <tr
                key={entry.id}
                className={index % 2 === 0 ? "bg-[#F1F6F6]" : "bg-white"}
              >
                <td className="p-3">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="p-3">{entry.ip}</td>
                <td className="p-3 truncate max-w-xs">{entry.user_agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ◀
        </button>
        {new Array(totalPages).fill(1).map((p, index) => (
          <button
            key={index}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              page === index+1 ? "bg-gray-600 text-white" : "bg-gray-300"
            }`}
          >
            {index+1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ▶
        </button>
      </div>
    </div>
  );
}