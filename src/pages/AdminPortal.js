import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaFileInvoiceDollar, FaComments, FaFolder, FaTicketAlt, FaBook, FaSignOutAlt, FaBars, FaUsers, FaDownload, FaPrint } from 'react-icons/fa';
import './AdminPortal.css';

function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedClient, setSelectedClient] = useState('Client A');
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'Medium' });
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://nettechsa-server.herokuapp.com'; // Live Heroku backend

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/questionnaire'); // Redirect to signup if no token
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const fetchWithAuth = async (url) => {
      try {
        const res = await fetch(url, { headers });
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          return [];
        }
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error(`Fetch error for ${url}:`, err);
        return [];
      }
    };

    setProjects(await fetchWithAuth(`${API_BASE_URL}/api/projects`));
    setInvoices(await fetchWithAuth(`${API_BASE_URL}/api/invoices`));
    setMessages(await fetchWithAuth(`${API_BASE_URL}/api/messages`));
    setFiles(await fetchWithAuth(`${API_BASE_URL}/api/files`));
    setTickets(await fetchWithAuth(`${API_BASE_URL}/api/tickets`));
    setUsers(await fetchWithAuth(`${API_BASE_URL}/api/users`));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/questionnaire');
  };

  const toggleNav = () => setIsNavCollapsed(!isNavCollapsed);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sender: 'Admin', recipient: selectedClient, text: newMessage })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data]);
        setNewMessage('');
      } else {
        throw new Error('Message send failed');
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('client', selectedClient);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/files`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setFiles([...files, data]);
      } else {
        throw new Error('File upload failed');
      }
    } catch (err) {
      console.error('Upload file error:', err);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: newTicket.title,
          client: selectedClient,
          description: newTicket.description,
          priority: newTicket.priority,
          status: 'Open', // Add default status
          submitted: new Date().toISOString().split('T')[0] // Add submitted date
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTickets([...tickets, data]);
        setNewTicket({ title: '', description: '', priority: 'Medium' });
      } else {
        throw new Error('Ticket creation failed');
      }
    } catch (err) {
      console.error('Create ticket error:', err);
    }
  };

  const handleUpdateProjectStatus = async (id, status, progress) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status, progress })
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(projects.map(p => p.id === id ? data : p));
      } else {
        throw new Error('Project update failed');
      }
    } catch (err) {
      console.error('Update project error:', err);
    }
  };

  const handleUpdateInvoiceStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(invoices.map(i => i.id === id ? data : i));
      } else {
        throw new Error('Invoice update failed');
      }
    } catch (err) {
      console.error('Update invoice error:', err);
    }
  };

  const handleResolveTicket = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'Resolved' })
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(tickets.map(t => t.id === id ? data : t));
      } else {
        throw new Error('Ticket resolve failed');
      }
    } catch (err) {
      console.error('Resolve ticket error:', err);
    }
  };

  return (
    <div className="admin-portal">
      <nav className={`portal-nav ${isNavCollapsed ? 'collapsed' : ''}`}>
        <div className="nav-header">
          <h1>NetTech Admin</h1>
          <button className="nav-toggle" onClick={toggleNav}>
            <FaBars />
          </button>
        </div>
        <ul>
          <li><button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><FaHome className="nav-icon" /><span>Dashboard</span></button></li>
          <li><button className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}><FaProjectDiagram className="nav-icon" /><span>Projects</span></button></li>
          <li><button className={`nav-link ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}><FaFileInvoiceDollar className="nav-icon" /><span>Invoices</span></button></li>
          <li><button className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}><FaComments className="nav-icon" /><span>Chat</span></button></li>
          <li><button className={`nav-link ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}><FaFolder className="nav-icon" /><span>Files</span></button></li>
          <li><button className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}><FaTicketAlt className="nav-icon" /><span>Tickets</span></button></li>
          <li><button className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}><FaBook className="nav-icon" /><span>Resources</span></button></li>
          <li><button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}><FaUsers className="nav-icon" /><span>Users</span></button></li>
          <li><button className="nav-link logout" onClick={handleLogout}><FaSignOutAlt className="nav-icon" /><span>Log Out</span></button></li>
        </ul>
      </nav>

      <main className={`portal-content ${isNavCollapsed ? 'collapsed' : ''}`}>
        <aside className="left-panel">
          <h2>Admin Overview</h2>
          <div className="quick-info">
            <div className="info-item">
              <h3>Active Projects</h3>
              <p>{projects.filter(p => p.status === 'In Progress').length} in Progress</p>
            </div>
            <div className="info-item">
              <h3>Pending Invoices</h3>
              <p>${invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0)} Due</p>
            </div>
            <div className="info-item">
              <h3>Unread Messages</h3>
              <p>{messages.filter(m => m.recipient === 'Admin').length} New</p>
            </div>
            <div className="info-item">
              <h3>Open Tickets</h3>
              <p>{tickets.filter(t => t.status === 'Open').length} Active</p>
            </div>
          </div>
        </aside>

        <section className="right-panel">
          {activeTab === 'dashboard' && (
            <div className="tab-content">
              <h2>Dashboard</h2>
              <p>Track all client activity at a glance.</p>
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h3>Project Status</h3>
                  <p>{projects[0]?.name || 'No projects'}: {projects[0]?.progress || 0}% Complete</p>
                  <div className="progress-bar" style={{ width: `${projects[0]?.progress || 0}%`, background: '#0077ff' }}></div>
                </div>
                <div className="dashboard-card">
                  <h3>Recent Activity</h3>
                  <p>Invoice #{invoices[invoices.length - 1]?.id || 'N/A'} Sent</p>
                  <p>Chat: New message from {messages[messages.length - 1]?.sender || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="tab-content">
              <h2>Projects</h2>
              <p>Manage all client projects.</p>
              <div className="progress-tracker">
                {projects.map(project => (
                  <div key={project.id} className="progress-item">
                    <h3>{project.name}</h3>
                    <p>Client: {project.client}</p>
                    <p>Status: {project.status} | ETA: {project.eta || 'N/A'}</p>
                    <p>Team: {(project.team || []).join(', ') || 'None'}</p>
                    <p>Milestones: {(project.milestones || []).join(', ') || 'None'}</p>
                    <div className="progress-bar" style={{ width: `${project.progress}%`, background: project.status === 'Complete' ? '#00ffcc' : '#0077ff' }}></div>
                    <select
                      value={project.status}
                      onChange={(e) => handleUpdateProjectStatus(project.id, e.target.value, e.target.value === 'Complete' ? 100 : project.progress)}
                      className="status-select"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="tab-content">
              <h2>Invoices</h2>
              <p>Track and manage client payments.</p>
              <div className="invoice-list">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="invoice-item">
                    <p>Invoice #{invoice.id} - ${invoice.amount} ({invoice.client})</p>
                    <p>Issued: {invoice.issued} | Due: {invoice.due} | Status: {invoice.status}</p>
                    <p>Items: {(invoice.items || []).map(item => `${item.desc} ($${item.price})`).join(', ') || 'N/A'}</p>
                    <div className="invoice-actions">
                      <a href={`${API_BASE_URL}/api/invoices/download/${invoice.id}`} download className="cta-button small"><FaDownload /> Download</a>
                      <button className="cta-button small" onClick={() => window.open(`${API_BASE_URL}/api/invoices/download/${invoice.id}`, '_blank')}><FaPrint /> Print</button>
                      <select
                        value={invoice.status}
                        onChange={(e) => handleUpdateInvoiceStatus(invoice.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="tab-content">
              <h2>Chat</h2>
              <p>Communicate with clients in real-time.</p>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="client-select"
              >
                {users.map(user => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
              <div className="chat-messages">
                {messages.filter(m => m.sender === 'Admin' || m.recipient === 'Admin').map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.sender === 'Admin' ? 'admin' : 'client'}`}>
                    <p><strong>{msg.sender} to {msg.recipient}:</strong> {msg.text}</p>
                    <span>{msg.timestamp}</span>
                  </div>
                ))}
              </div>
              <form className="chat-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedClient}...`}
                  required
                />
                <button type="submit" className="cta-button">Send</button>
              </form>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="tab-content">
              <h2>Files</h2>
              <p>Manage client files and uploads.</p>
              <div className="file-list">
                {files.map(file => (
                  <div key={file.id} className="file-item">
                    <p>{file.name} ({file.client}) - {file.size} - Uploaded: {file.uploaded}</p>
                    <a href={`${API_BASE_URL}/api/files/download/${file.id}`} download className="cta-button small"><FaDownload /> Download</a>
                  </div>
                ))}
              </div>
              <div className="file-upload">
                <p>Upload a file:</p>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="client-select"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
                <input
                  type="file"
                  className="file-input"
                  onChange={handleUploadFile}
                />
                <button className="cta-button">Upload</button>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="tab-content">
              <h2>Support Tickets</h2>
              <p>Track and resolve client issues.</p>
              <div className="ticket-list">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="ticket-item">
                    <p>Ticket #{ticket.id} - {ticket.title} ({ticket.client})</p>
                    <p>Status: {ticket.status} | Submitted: {ticket.submitted}</p>
                    <p>Description: {ticket.description} | Priority: {ticket.priority}</p>
                    {ticket.status === 'Open' && <button className="cta-button small" onClick={() => handleResolveTicket(ticket.id)}>Resolve</button>}
                  </div>
                ))}
              </div>
              <form className="ticket-form" onSubmit={handleCreateTicket}>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Ticket Title"
                  required
                />
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Description"
                  rows="3"
                  required
                />
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="priority-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="client-select"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
                <button type="submit" className="cta-button">Create Ticket</button>
              </form>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="tab-content">
              <h2>Resources</h2>
              <p>Admin tools and guides.</p>
              <div className="resource-list">
                <div className="resource-item">
                  <p>Admin Guide: Project Management</p>
                  <button className="cta-button small" onClick={() => alert('Viewing guide...')}>View</button>
                </div>
                <div className="resource-item">
                  <p>FAQ: Billing Procedures</p>
                  <button className="cta-button small" onClick={() => alert('Viewing FAQ...')}>View</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-content">
              <h2>User Management</h2>
              <p>Manage client accounts and permissions.</p>
              <div className="user-list">
                {users.map(user => (
                  <div key={user.id} className="user-item">
                    <p>{user.name} - {user.email}</p>
                    <p>Status: {user.status} | Last Login: {user.last_login}</p>
                    <p>Permissions: {(user.permissions || []).join(', ') || 'None'}</p>
                    <button className="cta-button small" onClick={() => alert(`Editing ${user.name}`)}>Edit</button>
                  </div>
                ))}
              </div>
              <button className="cta-button" onClick={() => alert('Add user feature coming soon!')}>Add User</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPortal;