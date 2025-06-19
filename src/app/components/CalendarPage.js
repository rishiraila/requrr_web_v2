'use client';
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Preloader from './Preloader';

export default function CalendarPage() {

    const [loading, setLoading] = useState(true);

    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const fetchAll = async () => {
            try {
                setLoading(true); // Show loader
                const [clientsRes, servicesRes, incomeRes] = await Promise.all([
                    axios.get('/api/clients', { headers }),
                    axios.get('/api/Services', { headers }),
                    axios.get('/api/income_records', { headers }),
                ]);

                const clients = clientsRes.data;
                const services = servicesRes.data;
                const enriched = incomeRes.data.map(r => {
                    const client = clients.find(c => c.id === r.client_id);
                    const service = services.find(s => s.id === r.service_id);
                    return {
                        ...r,
                        client_name: client?.name || 'Unknown Client',
                        service_name: service?.name || 'Unknown Service',
                    };
                });

                setRecords(enriched);
                const events = enriched.map(r => ({
                    id: r.id,
                    title: r.client_name,
                    start: r.due_date,
                    extendedProps: { ...r }
                }));
                setEvents(events);
                setSelectedDate(null); // show all by default
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false); // Hide loader
            }
        };

        fetchAll();
    }, []);

    const handleDateClick = (info) => {
        setSelectedDate(new Date(info.date));
    };

    const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

    const recordsForSelectedDate = records.filter(r =>
        selectedDate && formatDate(r.due_date) === formatDate(selectedDate)
    );

    const renderEventContent = (eventInfo) => {
        return (
            <div style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {eventInfo.event.title}
            </div>
        );
    };

    const recordCardStyle = (status) => ({
        padding: '1rem',
        borderRadius: '8px',
        background: status === 'paid' ? '#e2fbe4' : '#fdecea',
        marginBottom: '1rem'
    });

    if (loading) {
        return <Preloader />;
    }

    return (
        <div className='container pt-5'>
            <div className='card p-5'>
                <h4 style={{ lineHeight: "5px" }} className='pt-3'>Calendar</h4>
                <p>View and manage your renewal schedule</p>

                <div className='row border border-bottom-0 border-start-0 border-end-0 pt-4'>
                    <div className='col-md-8'>
                        {/* Left: Full Calendar View */}
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            dateClick={handleDateClick}
                            height="auto"
                            eventContent={renderEventContent}
                        />
                    </div>

                    <div className='col-md-4'>
                        {/* Right: Daily or Full Renewal List */}
                        <div>
                            {selectedDate ? (
                                <>
                                    <h5>{new Date(selectedDate).toDateString()} Renewals</h5>
                                    {recordsForSelectedDate.length === 0 ? (
                                        <p>No renewals due on this day.</p>
                                    ) : (
                                        recordsForSelectedDate.map((r) => (
                                            <div key={r.id} style={recordCardStyle(r.status)}>
                                                <strong>{r.client_name}</strong>
                                                <div>{r.service_name}</div>
                                                <div>₹{parseFloat(r.amount).toFixed(2)}</div>
                                                <div>Status: {r.status}</div>
                                            </div>
                                        ))
                                    )}
                                    <button className='btn btn-sm btn-outline-secondary mt-2' onClick={() => setSelectedDate(null)}>Show All</button>
                                </>
                            ) : (
                                <>
                                    <h5>All Renewals</h5>
                                    {records.length === 0 ? (
                                        <p>No renewals found.</p>
                                    ) : (
                                        records.map((r) => (
                                            <div key={r.id} style={recordCardStyle(r.status)}>
                                                <strong>{r.client_name}</strong>
                                                <div>{r.service_name}</div>
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
