import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const markAllRead = async () => {
    await API.put('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success('All marked as read');
  };

  const deleteOne = async (id) => {
    await API.delete(`/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  const typeEmoji = { application: '📋', interview: '📅', message: '💬', job: '💼', system: '🔔' };
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="page" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>🔔 Notifications</h1>
          {unreadCount > 0 && <span className="badge badge-primary">{unreadCount} unread</span>}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="spinner" style={{ margin: '60px auto' }} />
      ) : notifications.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.15 }} />
          <h3>All caught up!</h3>
          <p style={{ color: 'var(--text2)' }}>No notifications yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notifications.map(n => (
            <div key={n._id} style={{ display: 'flex', gap: 14, padding: '16px 18px', background: n.read ? 'var(--bg2)' : 'rgba(124,111,255,0.06)', borderRadius: 12, border: `1px solid ${n.read ? 'var(--border)' : 'rgba(124,111,255,0.2)'}`, transition: 'all 0.2s', marginBottom: 6 }}>
              <div style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: 2 }}>{typeEmoji[n.type] || '🔔'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: n.read ? 500 : 700, marginBottom: 3 }}>{n.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.875rem', lineHeight: 1.5 }}>{n.message}</div>
                <div style={{ color: 'var(--text3)', fontSize: '0.775rem', marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
              </div>
              <button onClick={() => deleteOne(n._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4, flexShrink: 0 }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
