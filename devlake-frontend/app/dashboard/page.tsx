"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/repos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRepos(response.data);
      } catch (error) {
        console.error("Failed to fetch repositories", error);
      }
    };

    fetchRepos();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold">Your Repositories</h2>
      <ul className="mt-4 space-y-2">
        {repos.map((repo: any) => (
          <li key={repo.id} className="p-4 bg-white shadow-md rounded-md">
            <p className="font-semibold">{repo.name}</p>
            <p className="text-sm text-gray-600">{repo.url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
