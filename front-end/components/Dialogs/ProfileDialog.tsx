"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserDetails {
  firstname: string;
  lastname: string;
  gender: string;
  avatar: string;
  address: string;
  phone: string;
  birthDate: string;
}

const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

const BLANK_FORM: UserDetails = {
  firstname: "",
  lastname: "",
  gender: "",
  avatar: "",
  address: "",
  phone: "",
  birthDate: "",
};



export function ProfileDialog({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [profile, setProfile] = useState<UserDetails | null>(null);
  const [formData, setFormData] = useState<UserDetails>(BLANK_FORM);
  const [editMode, setEditMode] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = decodeToken(token);
      setUserId(user?.userId ?? null);
    }
    setTokenLoaded(true);
  }, []);

  useEffect(() => {
    if (!userId || !isDialogOpen) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setProfile(null);
    setFormData(BLANK_FORM);
    setEditMode(true); 

    fetch(`http://localhost:5000/api/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.userDetails) {
          setProfile(data.userDetails);
          setFormData(data.userDetails);
          setEditMode(false);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, [userId, isDialogOpen]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const method = profile ? "PUT" : "POST";
    const url = profile
      ? `http://localhost:5000/api/profile/${userId}`
      : `http://localhost:5000/api/profile`;
    const body = profile ? formData : { userid: userId, ...formData };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    setProfile(formData); 
    setEditMode(false);    
    
  };



  if (!tokenLoaded || !userId) {
    return <>{children}</>;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        {editMode ? (
          <div className="grid gap-4 py-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={key} className="text-right capitalize">
                  {key}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={formData[key as keyof UserDetails] || ""}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="col-span-3"
                  type={key === 'birthDate' ? 'date' : 'text'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 space-y-2">
            <p><b>Name:</b> {profile?.firstname} {profile?.lastname}</p>
            <p><b>Phone:</b> {profile?.phone}</p>
            <p><b>Address:</b> {profile?.address}</p>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {editMode ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}