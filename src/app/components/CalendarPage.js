"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Preloader from "./Preloader";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [clientsRes, servicesRes, incomeRes, recurringRes] =
          await Promise.all([
            axios.get("/api/clients", { headers }),
            axios.get("/api/Services", { headers }),
            axios.get("/api/income_records", { headers }),
            axios.get("/api/requrring_expenses", { headers }),
          ]);

        const clients = clientsRes.data;
        const services = servicesRes.data;

        const enrichedRenewals = incomeRes.data.map((r) => {
          const client = clients.find((c) => c.id === r.client_id);
          const service = services.find((s) => s.id === r.service_id);
          return {
            ...r,
            client_name: client?.name || "Unknown Client",
            company_name: client?.company_name || "",
            service_name: service?.name || "Unknown Service",
            type: "renewal",
          };
        });

        const enrichedRecurring = recurringRes.data.map((r) => ({
          ...r,
          type: "recurring",
        }));

        const allRecords = [...enrichedRenewals, ...enrichedRecurring];
        setRecords(allRecords);

        const renewalEvents = enrichedRenewals.map((r) => ({
          id: `renewal-${r.id}`,
          title: r.client_name,
          start: r.due_date,
          backgroundColor: "#007bff",
          borderColor: "#007bff",
          extendedProps: { ...r },
        }));

        const recurringEvents = enrichedRecurring.map((r) => ({
          id: `recurring-${r.id}`,
          title: r.title,
          start: r.due_date,
          backgroundColor: "#ff6f00",
          borderColor: "#ff6f00",
          extendedProps: { ...r },
        }));

        setEvents([...renewalEvents, ...recurringEvents]);
        setSelectedDate(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const recordsForCurrentMonth = records.filter((r) => {
    const due = new Date(r.due_date);
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    return due.getMonth() === month && due.getFullYear() === year;
  });

  const handleDateClick = (info) => {
    setSelectedDate(new Date(info.date));
  };

  const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

  const recordsForSelectedDate = records.filter(
    (r) => selectedDate && formatDate(r.due_date) === formatDate(selectedDate)
  );

  const renderEventContent = (eventInfo) => {
    return (
      <div
        style={{
          backgroundColor: eventInfo.event.backgroundColor,
          color: "white",
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "0.75rem",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  const recordCardStyle = (status, type) => ({
    padding: "1rem",
    borderRadius: "8px",
    background:
      type === "recurring"
        ? "#fff4e5"
        : status === "paid"
        ? "#e2fbe4"
        : "#fdecea",
    border: "1px solid #ddd",
    marginBottom: "1rem",
  });

  if (loading) return <Preloader />;

  return (
    <div className="container pt-5">
      <div className="card p-5">
        <h4 style={{ lineHeight: "5px" }} className="pt-3">
          Calendar
        </h4>
        <p>View and manage your renewal & recurring expense schedule</p>

        <div className="row border border-bottom-0 border-start-0 border-end-0 pt-4">
          <div className="col-md-8">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              eventClick={(info) => {
                setSelectedDate(new Date(info.event.start));
              }}
              datesSet={(arg) => {
                setCurrentMonth(new Date(arg.view.currentStart));
                setSelectedDate(null);
              }}
              height="auto"
              eventContent={renderEventContent}
            />
          </div>

          <div
            className="col-md-4"
            style={{
              overflowY: "scroll",
              height: "80vh",
            }}
          >
            <div>
              {selectedDate ? (
                <>
                  <h5>
                    {new Date(selectedDate).toDateString()} Scheduled Items
                  </h5>
                  {recordsForSelectedDate.length === 0 ? (
                    <p>No items due on this day.</p>
                  ) : (
                    recordsForSelectedDate.map((r) => (
                      <div
                        key={`${r.type}-${r.id}`}
                        style={recordCardStyle(r.status, r.type)}
                      >
                        <strong>
                          {r.type === "renewal"
                            ? `${r.client_name} - ${r.company_name}`
                            : r.title}
                        </strong>
                        <div>
                          {r.type === "renewal"
                            ? r.service_name
                            : "Recurring Expense"}
                        </div>
                        <div>₹{parseFloat(r.amount).toFixed(2)}</div>
                        <div>Status: {r.status}</div>
                      </div>
                    ))
                  )}
                  <button
                    className="btn btn-sm btn-outline-secondary mt-2"
                    onClick={() => setSelectedDate(null)}
                  >
                    Show Month
                  </button>
                </>
              ) : (
                <>
                  <h5>
                    {currentMonth.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    Scheduled Items
                  </h5>
                  {recordsForCurrentMonth.length === 0 ? (
                    <p>No scheduled items this month.</p>
                  ) : (
                    recordsForCurrentMonth.map((r) => (
                      <div
                        key={`${r.type}-${r.id}`}
                        style={recordCardStyle(r.status, r.type)}
                      >
                        <strong>
                          {r.type === "renewal"
                            ? `${r.client_name} - ${r.company_name}`
                            : r.title}
                        </strong>
                        <div>
                          {r.type === "renewal"
                            ? r.service_name
                            : "Recurring Expense"}
                        </div>
                        <div>₹{parseFloat(r.amount).toFixed(2)}</div>
                        <div>Status: {r.status}</div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
