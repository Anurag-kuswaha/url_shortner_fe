import { useRouter } from "next/router";
import { useState, useEffect } from "react";

type urlProps ={
  id: number,
  short_code:string,
  original_url: string,
  clicks: number
}
export default function URLListTable() {
  const [urls, setUrls] = useState<urlProps[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/urls?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setUrls(data.data);
        setTotalPages(() => Math.ceil(data.totalCount / limit));
      })
      .catch((err) => console.error("Error fetching URLs:", err));
  }, [page]);

  return (
    <div className="p-0 md:p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📌 URL Dashboard</h1>

      <div className="bg-white shadow-md rounded-xl overflow-scroll md:overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#1D5E6D] text-white">
            <tr>
              <th className="p-3 text-left">Short URL</th>
              <th className="p-3 text-left">Original URL</th>
              <th className="p-3 text-center">Clicks</th>
              <th className="p-3 text-center">View Analytics</th>
            </tr>
          </thead>
          <tbody>
            {urls.length > 0 ? (
              urls.map((url, index) => (
                <tr
                  key={url.id}
                  className={index % 2 === 0 ? "bg-[#F1F6F6]" : "bg-white"}
                >
                  <td className="p-3">
                    <a href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/r/${url.short_code}`} target="_blank" className="text-blue-500 underline">
                    {`${process.env.NEXT_PUBLIC_FRONTEND_URL}/r/${url.short_code}`}
                    </a>
                  </td>
                  <td className="p-3 truncate max-w-xs">{url.original_url}</td>
                  <td className="p-3 text-center">{url.clicks}</td>
                  <td className="p-3 text-center">
                    <button
                      className="px-4 py-2 bg-[#1D5E6D] text-white rounded-md hover:bg-[#00D095] transition"
                      onClick={() => router.push(`/analytics/${url.id}`)}
                    >
                      View Analytics
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No URLs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
