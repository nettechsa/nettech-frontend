import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaFileInvoiceDollar, FaComments, FaFolder, FaTicketAlt, FaBook, FaSignOutAlt, FaBars, FaDownload, FaPrint, FaShoppingCart } from 'react-icons/fa';
import './ClientPortal.css';

function ClientPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://nettechsa-server.herokuapp.com'; // Live Heroku backend
  const clientName = localStorage.getItem('userName') || 'Client A';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    } else {
      setIsLoggedIn(false); // Ensure logged-out state on refresh
    }
  }, [navigate]); // Only re-run on navigate change

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

    setProjects((await fetchWithAuth(`${API_BASE_URL}/api/projects`)).filter(p => p.client === clientName));
    setInvoices((await fetchWithAuth(`${API_BASE_URL}/api/invoices`)).filter(i => i.client === clientName));
    setMessages((await fetchWithAuth(`${API_BASE_URL}/api/messages`)).filter(m => m.sender === clientName || m.recipient === clientName));
    setFiles((await fetchWithAuth(`${API_BASE_URL}/api/files`)).filter(f => f.client === clientName));
    setTickets((await fetchWithAuth(`${API_BASE_URL}/api/tickets`)).filter(t => t.client === clientName));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    navigate('/questionnaire'); // Redirect to signup, not self
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ sender: clientName, recipient: 'Admin', text: newMessage })
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
    formData.append('client', clientName);
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

  const toggleNav = () => setIsNavCollapsed(!isNavCollapsed);

  if (!isLoggedIn) {
    return (
      <div className="portal-login">
        <h2>Client Portal</h2>
        <p>Already have an account? Log in below or sign up to get started.</p>
        <div className="auth-container">
          <button className="cta-button" onClick={() => navigate('/questionnaire')}>Sign Up</button>
          <div className="login-section">
            <h3>Log In</h3>
            <form className="login-form" onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              try {
                const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.token) {
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('userName', data.user.name);
                  setIsLoggedIn(true);
                  navigate(data.user.role === 'admin' ? '/admin-portal' : '/client-portal');
                } else {
                  alert(data.message || 'Login failed');
                }
              } catch (err) {
                console.error('Login error:', err);
                alert('Login failed');
              }
            }}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit" className="cta-button">Log In</button>
            </form>
          </div>
        </div>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="client-portal">
      <nav className={`portal-nav ${isNavCollapsed ? 'collapsed' : ''}`}>
        <div className="nav-header">
          <h1>NetTech Portal</h1>
          <button className="nav-toggle" onClick={toggleNav}>
            <FaBars />
          </button>
        </div>
        <ul>
          <li><button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><FaHome className="nav-icon" /><span>Dashboard</span></button></li>
          <li><button className={`nav-link ${activeTab === 'project' ? 'active' : ''}`} onClick={() => setActiveTab('project')}><FaProjectDiagram className="nav-icon" /><span>Project Details</span></button></li>
          <li><button className={`nav-link ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}><FaFileInvoiceDollar className="nav-icon" /><span>Invoices</span></button></li>
          <li><button className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}><FaComments className="nav-icon" /><span>Chat</span></button></li>
          <li><button className={`nav-link ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}><FaFolder className="nav-icon" /><span>Files</span></button></li>
          <li><button className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}><FaTicketAlt className="nav-icon" /><span>Support Tickets</span></button></li>
          <li><button className={`nav-link ${activeTab === 'purchase' ? 'active' : ''}`} onClick={() => setActiveTab('purchase')}><FaShoppingCart className="nav-icon" /><span>Purchase Service</span></button></li>
          <li><button className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}><FaBook className="nav-icon" /><span>Resources</span></button></li>
          <li><button className="nav-link logout" onClick={handleLogout}><FaSignOutAlt className="nav-icon" /><span>Log Out</span></button></li>
        </ul>
      </nav>

      <main className={`portal-content ${isNavCollapsed ? 'collapsed' : ''}`}>
        <aside className="left-panel">
          <h2>Quick Info</h2>
          <div className="quick-info">
            <div className="info-item">
              <h3>Project Status</h3>
              <p>{projects[0]?.progress || 0}% Complete</p>
              <div className="progress-bar" style={{ width: `${projects[0]?.progress || 0}%`, background: '#0077ff' }}></div>
            </div>
            <div className="info-item">
              <h3>Next Invoice</h3>
              <p>R{invoices.find(i => i.status === 'Pending')?.amount || 0} - Due {invoices.find(i => i.status === 'Pending')?.due || 'N/A'}</p>
            </div>
            <div className="info-item">
              <h3>Recent Chat</h3>
              <p>{messages[messages.length - 1]?.sender || 'N/A'}: {(messages[messages.length - 1]?.text || 'No messages').slice(0, 20)}...</p>
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
              <p>Your project overview.</p>
              <div className="progress-tracker">
                {projects.map(project => (
                  <div key={project.id} className="progress-item">
                    <h3>{project.name}</h3>
                    <p>Status: {project.status} | ETA: {project.eta || 'N/A'}</p>
                    <p>Team: {(project.team || []).join(', ') || 'None'}</p>
                    <div className="progress-bar" style={{ width: `${project.progress}%`, background: project.status === 'Complete' ? '#00ffcc' : '#0077ff' }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'project' && (
            <div className="tab-content">
              <h2>Project Details</h2>
              <p>Your website build details.</p>
              <div className="project-details">
                {projects.map(project => (
                  <div key={project.id}>
                    <p><strong>Name:</strong> {project.name}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                    <p><strong>Progress:</strong> {project.progress}%</p>
                    <p><strong>ETA:</strong> {project.eta || 'N/A'}</p>
                    <p><strong>Team:</strong> {(project.team || []).join(', ') || 'None'}</p>
                    <p><strong>Milestones:</strong></p>
                    <ul>{(project.milestones || []).map((m, i) => <li key={i}>{m}</li>) || <li>No milestones</li>}</ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="tab-content">
              <h2>Invoices</h2>
              <p>Keep track of your payments.</p>
              <div className="invoice-list">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="invoice-item">
                    <p>Invoice #{invoice.id} - R{invoice.amount}</p>
                    <p>Issued: {invoice.issued} | Due: {invoice.due} | Status: {invoice.status}</p>
                    <p>Items: {(invoice.items || []).map(item => `${item.desc} (R${item.price})`).join(', ') || 'N/A'}</p>
                    <div className="invoice-actions">
                      <a href={`${API_BASE_URL}/api/invoices/download/${invoice.id}`} download className="cta-button small"><FaDownload /> Download</a>
                      <button className="cta-button small" onClick={() => window.open(`${API_BASE_URL}/api/invoices/download/${invoice.id}`, '_blank')}><FaPrint /> Print</button>
                      {invoice.status === 'Pending' && <button className="cta-button small" onClick={() => alert('Payment processing...')}>Pay Now</button>}
                      {invoice.status === 'Paid' && <button className="cta-button small" disabled>Paid</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="tab-content">
              <h2>Chat</h2>
              <p>Chat with your NetTech team.</p>
              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.sender === clientName ? 'client' : 'nettech'}`}>
                    <p><strong>{msg.sender}:</strong> {msg.text}</p>
                    <span>{msg.timestamp}</span>
                  </div>
                ))}
              </div>
              <form className="chat-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                />
                <button type="submit" className="cta-button">Send</button>
              </form>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="tab-content">
              <h2>Files</h2>
              <p>Access and upload project-related files.</p>
              <div className="file-list">
                {files.map(file => (
                  <div key={file.id} className="file-item">
                    <p>{file.name} ({file.size}) - Uploaded: {file.uploaded}</p>
                    <a href={`${API_BASE_URL}/api/files/download/${file.id}`} download className="cta-button small"><FaDownload /> Download</a>
                  </div>
                ))}
              </div>
              <div className="file-upload">
                <p>Upload a file:</p>
                <input
                  type="file"
                  className="file-input"
                  onChange={handleUploadFile}
                />
                <button className="cta-button" onClick={() => {}}>Upload</button>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="tab-content">
              <h2>Support Tickets</h2>
              <p>Submit and track support requests.</p>
              <div className="ticket-list">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="ticket-item">
                    <p>Ticket #{ticket.id} - {ticket.title}</p>
                    <p>Status: {ticket.status} | Submitted: {ticket.submitted}</p>
                    <p>Description: {ticket.description} | Priority: {ticket.priority}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'purchase' && (
            <div className="tab-content">
              <h2>Purchase a Service</h2>
              <p>Select a NetTech service to enhance your project.</p>
              <div className="services-grid">
                <div className="service-card">
                  <h3>Custom Web Development</h3>
                  <p>Tailored websites built from scratch.</p>
                  <p><strong>Price:</strong> R5,000</p>
                  <button className="cta-button" onClick={() => alert('Service purchase coming soon!')}>Purchase</button>
                </div>
                <div className="service-card">
                  <h3>Responsive Design</h3>
                  <p>Pixel-perfect sites for all devices.</p>
                  <p><strong>Price:</strong> R2,000</p>
                  <button className="cta-button" onClick={() => alert('Service purchase coming soon!')}>Purchase</button>
                </div>
                <div className="service-card">
                  <h3>E-Commerce Solutions</h3>
                  <p>Secure online stores with seamless UX.</p>
                  <p><strong>Price:</strong> R7,500</p>
                  <button className="cta-button" onClick={() => alert('Service purchase coming soon!')}>Purchase</button>
                </div>
                <div className="service-card">
                  <h3>Web App Development</h3>
                  <p>Interactive, scalable web apps.</p>
                  <p><strong>Price:</strong> R10,000</p>
                  <button className="cta-button" onClick={() => alert('Service purchase coming soon!')}>Purchase</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="tab-content">
              <h2>Resources</h2>
              <p>Helpful tools and guides for your project.</p>
              <div className="resource-list">
                <div className="resource-item">
                  <p>Guide: How to Review Designs</p>
                  <button className="cta-button small" onClick={() => alert('Viewing guide...')}>View</button>
                </div>
                <div className="resource-item">
                  <p>FAQ: Common Project Questions</p>
                  <button className="cta-button small" onClick={() => alert('Viewing FAQ...')}>View</button>
                </div>
                <div className="resource-item">
                  <p>Link: NetTech Blog</p>
                  <button className="cta-button small" onClick={() => window.open('https://example.com', '_blank')}>Visit</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ClientPortal;