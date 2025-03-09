import React, { createContext, useState, useContext } from 'react';

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'E-Commerce Platform', client: 'Client A', status: 'In Progress', progress: 75, eta: '2025-03-01', team: ['John (Dev)', 'Sarah (Design)'], milestones: ['Wireframes Approved - Feb 10', 'Design Complete - Feb 20'] },
    { id: 2, name: 'Portfolio Site', client: 'Client B', status: 'Complete', progress: 100, eta: '2025-02-20', team: ['Mike (Dev)'], milestones: ['Launch - Feb 20'] },
  ]);

  const [invoices, setInvoices] = useState([
    { id: '001', amount: 5000, client: 'Client A', due: '2025-03-01', status: 'Pending', issued: '2025-02-20', items: [{ desc: 'Development Phase 1', qty: 1, price: 5000 }] },
    { id: '002', amount: 3000, client: 'Client B', due: '2025-02-15', status: 'Paid', issued: '2025-02-01', items: [{ desc: 'Portfolio Design', qty: 1, price: 3000 }] },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Admin', recipient: 'Client A', text: 'Hey, project’s on track!', timestamp: '2025-02-25 10:00' },
    { id: 2, sender: 'Client A', recipient: 'Admin', text: 'Sweet—any footer updates?', timestamp: '2025-02-25 10:05' },
  ]);

  const [files, setFiles] = useState([
    { id: 1, name: 'Wireframes.pdf', client: 'Client A', uploaded: '2025-02-20', size: '1.2 MB' },
    { id: 2, name: 'Mockup_v1.png', client: 'Client B', uploaded: '2025-02-15', size: '800 KB' },
  ]);

  const [tickets, setTickets] = useState([
    { id: '001', title: 'Header Bug', client: 'Client A', status: 'Open', submitted: '2025-02-24', description: 'Header overlaps on mobile.', priority: 'High' },
    { id: '002', title: 'Payment Issue', client: 'Client B', status: 'Resolved', submitted: '2025-02-23', description: 'Payment link broken.', priority: 'Medium' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Client A', email: 'clienta@nettech.com', status: 'Active', lastLogin: '2025-02-25', permissions: ['view', 'chat'] },
    { id: 2, name: 'Client B', email: 'clientb@nettech.com', status: 'Active', lastLogin: '2025-02-24', permissions: ['view', 'chat'] },
  ]);

  const sendMessage = (sender, recipient, text) => {
    const newMessage = {
      id: messages.length + 1,
      sender,
      recipient,
      text,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    setMessages([...messages, newMessage]);
  };

  const uploadFile = (name, client) => {
    const newFile = {
      id: files.length + 1,
      name,
      client,
      uploaded: new Date().toISOString().slice(0, 10),
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    };
    setFiles([...files, newFile]);
  };

  const resolveTicket = (id) => {
    setTickets(tickets.map(ticket =>
      ticket.id === id ? { ...ticket, status: 'Resolved' } : ticket
    ));
  };

  const createTicket = (title, client, description, priority) => {
    const newTicket = {
      id: String(tickets.length + 1).padStart(3, '0'),
      title,
      client,
      status: 'Open',
      submitted: new Date().toISOString().slice(0, 10),
      description,
      priority
    };
    setTickets([...tickets, newTicket]);
  };

  const updateInvoiceStatus = (id, status) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === id ? { ...invoice, status } : invoice
    ));
  };

  const updateProjectStatus = (id, status, progress) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, status, progress } : project
    ));
  };

  return (
    <PortalContext.Provider value={{
      projects, setProjects, updateProjectStatus,
      invoices, setInvoices, updateInvoiceStatus,
      messages, setMessages, sendMessage,
      files, setFiles, uploadFile,
      tickets, setTickets, resolveTicket, createTicket,
      users, setUsers
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);