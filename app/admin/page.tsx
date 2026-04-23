"use client";

import { useState, useEffect, useRef } from "react";
import { login, logout, checkAuth } from "../actions/auth";
import { getEvents, addEvent, deleteEvent, updateEvent, AppEvent } from "../actions/events";
import { uploadFile } from "../actions/upload";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./Admin.css";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"update" | "event">("update");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  async function loadEvents() {
    const data = await getEvents();
    setEvents(data);
  }

  useEffect(() => {
    async function init() {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
      if (auth) {
        await loadEvents();
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await login(password);
    if (res.success) {
      setIsAuthenticated(true);
      await loadEvents();
    } else {
      setLoginError(res.error || "Login failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let mediaUrl;
    let mediaType: "image" | "video" | "document" | undefined;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await uploadFile(formData);
      if (res.success && res.url) {
        mediaUrl = res.url;
        if (file.type.startsWith("image/")) {
          mediaType = "image";
        } else if (file.type.startsWith("video/")) {
          mediaType = "video";
        } else {
          mediaType = "document";
        }
      } else {
        alert("File upload failed: " + res.error);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const payload = { title, date, time, description, type, mediaUrl, mediaType };
      
      if (editId) {
        await updateEvent(editId, payload);
      } else {
        await addEvent(payload);
      }
      
      setTitle("");
      setDate("");
      setTime("");
      setDescription("");
      setType("update");
      setFile(null);
      setEditId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await loadEvents();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to post item. Make sure you have initialized the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (evt: AppEvent) => {
    setEditId(evt.id);
    setTitle(evt.title);
    setDate(evt.date || "");
    setTime(evt.time || "");
    setDescription(evt.description);
    setType(evt.type);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Scroll to top of the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteEvent(id);
        await loadEvents();
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete the event. If you are viewing this on Vercel, it is because Vercel blocks writing to the file system. We must connect a real database (like Supabase or Postgres) for the admin dashboard to work on Vercel.");
      }
    }
  };

  if (isLoading) return <div className="admin-wrap wrap"><div className="sh" style={{textAlign:"center"}}>Loading...</div></div>;

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main>
          <div className="admin-wrap wrap">
            <div className="admin-header">
              <div className="sl" style={{justifyContent:"center"}}>Admin Access</div>
              <h1 className="sh">Updates & Events</h1>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
              {loginError && <div className="admin-error">{loginError}</div>}
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button type="submit" className="btn bg admin-btn">
                <span>Login</span>
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="admin-wrap wrap">
          <div className="admin-dashboard">
            <div className="admin-dashboard-top">
              <h1 className="sh" style={{marginBottom: 0}}>Admin Dashboard</h1>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <form className="event-form" onSubmit={handleCreate}>
              <div className="sl">{editId ? "Edit Item" : "Post New Item"}</div>
              <div className="form-group">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as "update" | "event")}>
                  <option value="update">Update / News</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Charity Drive"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date (Required for events, optional for updates)</label>
                <div className="custom-date-wrapper">
                  <span className="date-display" style={{ opacity: date ? 1 : 0.5 }}>
                    {date ? new Date(date + "T00:00:00").toLocaleDateString() : "mm/dd/yyyy"}
                  </span>
                  <svg className="calendar-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required={type === "event"}
                    className="hidden-date-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Time (Optional)</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 1rem',
                    background: 'var(--bg3)',
                    border: '1px solid var(--bdr)',
                    borderRadius: '4px',
                    color: 'var(--cream)',
                    fontFamily: 'var(--fu)',
                    colorScheme: 'dark'
                  }}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details..."
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Attachment (Image, Video, Document)</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
              </div>
              <button type="submit" className="btn bg" disabled={isSubmitting} style={{width: "100%", justifyContent: "center"}}>
                <span>{isSubmitting ? "Posting..." : editId ? "Update Item" : "Publish Item"}</span>
              </button>
              {editId && (
                <button 
                  type="button" 
                  className="btn bgh" 
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setDate("");
                    setTime("");
                    setDescription("");
                    setType("update");
                  }}
                  style={{width: "100%", justifyContent: "center", marginTop: "1rem"}}
                >
                  <span>Cancel Edit</span>
                </button>
              )}
            </form>

            <div className="events-list">
              <div className="sl">Manage Existing Items</div>
              {events.length === 0 ? (
                <p className="sd">No items have been posted yet.</p>
              ) : (
                events.map((evt) => (
                  <div key={evt.id} className="event-card">
                    <div className="event-info">
                      <div className="event-meta">
                        <span className="event-type">{evt.type}</span>
                        {evt.date ? new Date(evt.date + "T00:00:00").toLocaleDateString() : new Date(evt.createdAt).toLocaleDateString()}
                      </div>
                      <h3>{evt.title}</h3>
                      <p className="sd" style={{fontSize: "0.95rem", marginTop: "0.5rem", whiteSpace: "pre-wrap"}}>{evt.description}</p>
                    </div>
                    <div style={{marginTop: "1rem", display: "flex", gap: "1rem"}}>
                      <button onClick={() => handleEdit(evt)} className="edit-btn" style={{
                        background: 'transparent',
                        border: '1px solid var(--gold)',
                        color: 'var(--gold)',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(evt.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
