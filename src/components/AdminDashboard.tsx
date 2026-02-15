// import { useEffect, useState } from "react";

// export default function AdminDashboard() {
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     fetch(import.meta.env.VITE_API_URL + "/api/admin/waitlist", {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("admin_token"),
//       },
//     })
//       .then((res) => res.json())
//       .then(setData);
//   }, []);

//   return (
//     <div className="p-10 bg-black min-h-screen text-white">
//       <h1 className="text-2xl mb-6">AHEAD Waitlist</h1>

//       <table className="w-full border border-zinc-700">
//         <thead>
//           <tr className="bg-zinc-900">
//             <th className="p-2">Name</th>
//             <th className="p-2">Email</th>
//             <th className="p-2">Model</th>
//             <th className="p-2">Preorder</th>
//             <th className="p-2">Date</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((u) => (
//             <tr key={u._id} className="border-t border-zinc-800">
//               <td className="p-2">{u.name}</td>
//               <td className="p-2">{u.email}</td>
//               <td className="p-2">{u.model}</td>
//               <td className="p-2">{u.preorder}</td>
//               <td className="p-2">
//                 {new Date(u.createdAt).toLocaleDateString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      toast.error("You must login first");
      window.location.href = "/admin/login";
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/admin/waitlist", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const json = await res.json();

        if (!res.ok) {
          toast.error(json.message || "Failed to fetch waitlist");
          if (res.status === 403 || res.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("admin_token");
            window.location.href = "/admin/login";
          }
          return;
        }

        if (!Array.isArray(json)) {
          toast.error("Invalid data from server");
          return;
        }

        setData(json);
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    // window.location.href = "/admin/login";
    window.location.href = "/admin"; // Redirect to login page after logout
  };

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-2xl mb-6">AHEAD Waitlist</h1>

      <button
        onClick={handleLogout}
        className="mb-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      <table className="w-full border border-zinc-700">
        <thead>
          <tr className="bg-zinc-900">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Model</th>
            <th className="p-2">Preorder</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((u) => (
              <tr key={u._id} className="border-t border-zinc-800">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.model}</td>
                <td className="p-2">{u.preorder}</td>
                <td className="p-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-400">
                No waitlist data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
