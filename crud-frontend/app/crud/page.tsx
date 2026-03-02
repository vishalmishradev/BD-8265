"use client";

import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/crud";

interface User {
  id: number;
  name: string;
  age: number;
}

export default function CrudPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      console.log(data);
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Error fetching users. Check console.");
    } finally {
      setLoading(false);
    }
  };

  //CREATE & UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return alert("Please fill in both fields");

    const userData = { name, age };

    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(userData),
        });

        if (!res.ok) throw new Error("Failed to update");

        fetchUsers();
        setEditingId(null);
      } else {
        //CREATE
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(userData),
        });

        if (!res.ok) throw new Error("Failed to create");

        fetchUsers();
      }

      // Reset form
      setName("");
      setAge("");
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Operation failed");
    }
  };

  // 3. DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);

    setAge(String(user.age));
  };

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">
        User Management (API)
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg mb-8 shadow-sm"
      >
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded text-black"
              placeholder="Enter name"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded text-black"
              placeholder="Age"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white font-bold transition-colors ${
            editingId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {editingId ? "Update User" : "Add User"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setAge("");
            }}
            className="w-full mt-2 py-1 text-sm text-gray-600 underline"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border border-gray-300 text-black">Name</th>
                <th className="p-3 border border-gray-300 text-black">Age</th>
                <th className="p-3 border border-gray-300 text-center text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 text-black">
                    {user.name}
                  </td>
                  <td className="p-3 border border-gray-300 text-black">
                    {user.age}
                  </td>
                  <td className="p-3 border border-gray-300 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
