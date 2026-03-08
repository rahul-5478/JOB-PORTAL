import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Send, Search, MessageCircle } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/chat/conversations');
      setConversations(data.conversations || []);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/chat/users');
      setUsers(data.users || []);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await API.get(`/chat/messages/${userId}`);
      setMessages(data.messages || []);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const { data } = await API.post('/chat/send', { receiverId: selectedUser._id, message: newMessage });
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
      fetchConversations();
    } catch (err) { console.error(err); }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)', background: 'var(--bg2)' }}>
      {/* Sidebar */}
      <div style={{ width: 300, background: 'var(--bg1)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>💬 Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input className="form-input" style={{ paddingLeft: 32, fontSize: '0.85rem', padding: '8px 8px 8px 30px' }}
              placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredUsers.map(u => {
            const convo = conversations.find(c => c.other?._id === u._id);
            return (
              <div key={u._id} onClick={() => setSelectedUser(u)}
                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selectedUser?._id === u._id ? 'var(--bg3)' : 'transparent', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.9rem', flexShrink: 0 }}>
                    {u.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{u.name}</span>
                      {convo?.unread > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{convo.unread}</span>}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {convo?.lastMessage || `${u.role} • Start conversation`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredUsers.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text3)', fontSize: '0.875rem' }}>No users found</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <div style={{ padding: '14px 20px', background: 'var(--bg1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
                {selectedUser.name[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{selectedUser.name}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text3)', textTransform: 'capitalize' }}>{selectedUser.role}</div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text3)', marginTop: 60 }}>
                  <MessageCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                  <p>Start a conversation with {selectedUser.name}</p>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                return (
                  <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? 'var(--primary)' : 'var(--bg1)', color: isMe ? 'white' : 'var(--text1)', fontSize: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <div>{msg.message}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: 3, textAlign: 'right' }}>{formatTime(msg.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: '12px 16px', background: 'var(--bg1)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <input className="form-input" style={{ flex: 1 }} placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }} disabled={!newMessage.trim()}>
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text3)' }}>
            <MessageCircle size={60} style={{ opacity: 0.15, marginBottom: 16 }} />
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Your Messages</h3>
            <p style={{ fontSize: '0.875rem' }}>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
