"use client";

import { useState, useEffect } from "react";
import { AppEvent } from "../actions/events";
import "./Updates.css";

export default function UpdatesClient({ events }: { events: AppEvent[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<"all" | "update" | "event">("all");

  // Initialize scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
        }
      });
    }, { threshold: 0.1 });
    
    // Slight delay to ensure DOM has painted the new filtered items
    const timer = setTimeout(() => {
      document.querySelectorAll("[data-r]").forEach(el => observer.observe(el));
    }, 10);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [events, filterType]);
  
  // Create calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  const handlePrev = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Determine if a day has an event/update
  const getDayStatus = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const dayEvents = events.filter(e => e.date === dateStr);
    if (dayEvents.length === 0) return "";
    if (dayEvents.some(e => e.type === "event")) return "has-event";
    return "has-update";
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : a.createdAt;
    const timeB = b.date ? new Date(b.date).getTime() : b.createdAt;
    return timeB - timeA;
  });

  const displayedEvents = sortedEvents.filter(e => filterType === "all" ? true : e.type === filterType);

  return (
    <div className="updates-wrap wrap">
      <div className="sl" style={{justifyContent:"center"}} data-r>News & Announcements</div>
      <h1 className="sh" style={{textAlign:"center", marginBottom: "4rem"}} data-r="d1">Updates & Events</h1>
      
      <div className="updates-grid">
        <div className="updates-feed-col">
          <div className="feed-filter" style={{display: "flex", gap: "0.5rem", marginBottom: "2rem"}} data-r="d2">
            <button className={`btn ${filterType === 'all' ? 'bg' : 'bgh'}`} onClick={() => setFilterType('all')} style={{padding: '0.5rem 1.5rem'}}><span>All</span></button>
            <button className={`btn ${filterType === 'update' ? 'bg' : 'bgh'}`} onClick={() => setFilterType('update')} style={{padding: '0.5rem 1.5rem'}}><span>News / Updates</span></button>
            <button className={`btn ${filterType === 'event' ? 'bg' : 'bgh'}`} onClick={() => setFilterType('event')} style={{padding: '0.5rem 1.5rem'}}><span>Events</span></button>
          </div>
          <div className="updates-feed">
            {displayedEvents.length === 0 ? (
              <div className="empty-state" data-r="d2">
                <p className="sd">No items found.</p>
              </div>
            ) : (
              displayedEvents.map((evt) => (
              <div key={evt.id} className="feed-item" data-r>
                <div className="feed-meta">
                  <span className="feed-type">{evt.type}</span>
                  <span className="feed-date">
                    {evt.date ? new Date(evt.date + "T00:00:00").toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : new Date(evt.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {evt.time && (() => {
                      const [h, m] = evt.time.split(':');
                      const d = new Date();
                      d.setHours(parseInt(h, 10), parseInt(m, 10));
                      return " • " + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
                    })()}
                  </span>
                </div>
                <h2 className="feed-title">{evt.title}</h2>
                <p className="feed-desc">{evt.description}</p>
                {evt.mediaUrl && (
                  <div className="feed-media">
                    {evt.mediaType === "image" && (
                      <img src={evt.mediaUrl} alt={evt.title} loading="lazy" />
                    )}
                    {evt.mediaType === "video" && (
                      <video src={evt.mediaUrl} controls playsInline />
                    )}
                    {evt.mediaType === "document" && (
                      <a href={evt.mediaUrl} target="_blank" rel="noopener noreferrer" className="btn bgh" style={{marginTop: "1rem", padding: "0.5rem 0"}}>
                        <span>Download Attachment</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        </div>

        <div className="calendar-container" data-r="d2">
          <div className="calendar-header">
            <button onClick={handlePrev}>&larr;</button>
            <h3>{monthNames[month]} {year}</h3>
            <button onClick={handleNext}>&rarr;</button>
          </div>
          <div className="calendar-weekdays">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          <div className="calendar-days">
            {days.map((d, i) => {
              if (!d) return <div key={i} className="calendar-day empty"></div>;
              const status = getDayStatus(d);
              return (
                <div 
                  key={i} 
                  className={`calendar-day ${status} ${selectedDate?.getTime() === d.getTime() ? 'selected' : ''}`} 
                  title={status ? "Event/Update" : ""}
                  onClick={() => setSelectedDate(d)}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>
          <div style={{display: "flex", gap: "1rem", marginTop: "1rem", fontSize: "0.75rem", fontFamily: "var(--fu)", color: "var(--txtd)", justifyContent: "center"}}>
            <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
              <span style={{width: 10, height: 10, background: "var(--gold)", borderRadius: "2px"}}></span> Event
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
              <span style={{width: 10, height: 10, border: "1px solid var(--gold)", borderRadius: "2px"}}></span> Update
            </div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="calendar-modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="calendar-modal" onClick={e => e.stopPropagation()}>
            <div className="calendar-modal-header">
              <h3>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              <button onClick={() => setSelectedDate(null)}>&times;</button>
            </div>
            <div className="calendar-modal-body">
              {(() => {
                const y = selectedDate.getFullYear();
                const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const d = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${y}-${m}-${d}`;
                const dayEvents = events.filter(e => e.date === dateStr);

                if (dayEvents.length === 0) return <p className="sd">No updates or events scheduled for this day.</p>;
                return dayEvents.map(evt => (
                  <div key={evt.id} className="modal-event-item">
                    <span className="feed-type" style={{marginBottom: "0.5rem", display: "inline-block"}}>{evt.type}</span>
                    <h4 style={{fontFamily: "var(--fd)", color: "var(--cream)", fontSize: "1.2rem"}}>{evt.title}</h4>
                    <p className="sd" style={{fontSize: "0.95rem", lineHeight: "1.5"}}>{evt.description}</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
