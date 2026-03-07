"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Plus } from "lucide-react";
import { API_BASE, getAuthHeaders } from "../../../lib/api";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: "",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE}/role`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const json = await res.json();
        if (Array.isArray(json?.data)) {
          setRoles(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        roleId: formData.roleId || (roles.length > 0 ? roles[0].id : ""),
      };

      if (!submitData.roleId) {
        alert("No roles available. Please seed roles first.");
        return;
      }

      const res = await fetch(`${API_BASE}/admins`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (data.success) {
        setOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          roleId: "",
        });
        // Optionally trigger a refresh of the parent table
        window.location.reload();
      } else {
        alert(data.message || data.errors || "Failed to create user");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New User
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Add a new user to the placement and internship portal. Fill in all
            required information.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-slate-700"
              >
                First Name *
              </label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="border-indigo-500 ring-2 ring-indigo-500/20 shadow-none"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-slate-700"
              >
                Last Name *
              </label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="shadow-none focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email *
            </label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="shadow-none focus-visible:ring-indigo-500 text-slate-500"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password *
            </label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength={6}
              className="shadow-none focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="roleId"
              className="text-sm font-medium text-slate-700"
            >
              Role *
            </label>
            <select
              id="roleId"
              value={formData.roleId}
              onChange={handleChange}
              required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none"
          >
              <option value="" disabled>
                Select role
              </option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="text-slate-700 rounded-lg shadow-sm border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
            >
              {loading ? "Adding..." : "Add User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
