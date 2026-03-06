"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Plus } from "lucide-react";

export function AddUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
          <DialogDescription className="text-slate-500">
            Add a new user to the placement and internship portal. Fill in all required information.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name *
            </label>
            <Input id="name" placeholder="Enter full name" className="border-indigo-500 ring-2 ring-indigo-500/20 shadow-none" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email *
            </label>
            <Input id="email" type="email" placeholder="Enter email address" className="shadow-none focus-visible:ring-indigo-500 text-slate-500" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="role" className="text-sm font-medium text-slate-700">
              Role *
            </label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none"
            >
              <option value="" disabled selected>
                Select role
              </option>
              <option value="director">Director</option>
              <option value="placement_officer">Faculty Coordinator</option>
              <option value="ic">IC</option>
              <option value="pc">PC</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="responsibility" className="text-sm font-medium text-slate-700">
              Responsibility *
            </label>
            <select
              id="responsibility"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none"
            >
              <option value="" disabled selected>
                Select responsibility
              </option>
              <option value="placement_oversight">Placement Oversight</option>
              <option value="campus_drives">Campus Drives</option>
              <option value="internship_coordination">Internship Coordination</option>
              <option value="student_placement">Student Placement</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="department" className="text-sm font-medium text-slate-700">
              Department *
            </label>
            <select
              id="department"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none"
            >
              <option value="" disabled selected>
                Select department
              </option>
              <option value="all">All</option>
              <option value="placement_cell">Placement Cell</option>
              <option value="cse">CSE</option>
              <option value="mechanical">Mechanical</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="branch" className="text-sm font-medium text-slate-700">
              Branch *
            </label>
            <select
              id="branch"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none"
            >
              <option value="" disabled selected>
                Select branch
              </option>
              <option value="mca">MCA</option>
              <option value="mba">MBA</option>
              <option value="msc">MSC</option>
              <option value="btech">B Tech</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              Status *
            </label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 shadow-none"
            >
              <option value="active" selected>
                Active
              </option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="text-slate-700 rounded-lg shadow-sm border-slate-200 hover:bg-slate-50">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
