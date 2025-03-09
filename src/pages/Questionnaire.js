import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questionnaire.css';

function Questionnaire() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
    businessName: '',
    industry: '',
    websitePurpose: '',
    targetAudience: '',
    pagesNeeded: [],
    designStyle: '',
    colorScheme: '',
    logo: null,
    contentProvided: '',
    contentFiles: [],
    features: [],
    ecommerce: false,
    ecommerceDetails: '',
    budget: '',
    timeline: '',
    competitors: '',
    inspirationSites: '',
    additionalNotes: ''
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://nettechsa-server.herokuapp.com'; // Live Heroku backend

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox' && name !== 'ecommerce') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter(v => v !== value)
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'logo' ? files[0] : Array.from(files)
      }));
    } else if (name === 'ecommerce') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, adminCode, logo, contentFiles, ...questionnaire } = formData;

    // Prepare FormData for multipart upload
    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    formDataToSend.append('adminCode', adminCode);
    formDataToSend.append('questionnaire', JSON.stringify(questionnaire));
    if (logo) formDataToSend.append('logo', logo);
    contentFiles.forEach(file => formDataToSend.append('contentFiles', file));

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        body: formDataToSend // No headers—FormData sets Content-Type automatically
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        setStep(2);
        setError('');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed—check your connection or try again');
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found—please sign up again');
      setStep(1);
      return;
    }

    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id; // Decode JWT
      const res = await fetch(`${API_BASE_URL}/api/users/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Booking confirmed! Payment of R1000 processed.');
        navigate('/client-portal');
      } else {
        setError(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Booking failed—check your connection or try again');
    }
  };

  return (
    <div className="questionnaire">
      {step === 1 ? (
        <>
          <h2>Website Questionnaire</h2>
          <p>Please fill out the details below to help us build your perfect website.</p>
          <form className="questionnaire-form" onSubmit={handleSubmit}>
            <h3>Basic Info</h3>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            <input type="text" name="adminCode" value={formData.adminCode} onChange={handleChange} placeholder="Admin Code (optional)" />

            <h3>Business Details</h3>
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Business Name" required />
            <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry (e.g., Retail, Tech)" required />
            <textarea name="websitePurpose" value={formData.websitePurpose} onChange={handleChange} placeholder="What’s the purpose of your website?" required />
            <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Who’s your target audience?" required />

            <h3>Website Structure</h3>
            <label>Pages Needed (select all that apply):</label>
            <div className="checkbox-group">
              {['Home', 'About', 'Services', 'Contact', 'Blog', 'Portfolio', 'Shop', 'Other'].map(page => (
                <label key={page}>
                  <input type="checkbox" name="pagesNeeded" value={page} checked={formData.pagesNeeded.includes(page)} onChange={handleChange} /> {page}
                </label>
              ))}
            </div>

            <h3>Design Preferences</h3>
            <select name="designStyle" value={formData.designStyle} onChange={handleChange} required>
              <option value="">Select Design Style</option>
              <option value="Modern">Modern</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Classic">Classic</option>
              <option value="Bold">Bold</option>
            </select>
            <input type="text" name="colorScheme" value={formData.colorScheme} onChange={handleChange} placeholder="Preferred Color Scheme (e.g., Blue, Green)" required />
            <label>Upload Logo (if available):</label>
            <input type="file" name="logo" onChange={handleChange} accept="image/*" />

            <h3>Content</h3>
            <select name="contentProvided" value={formData.contentProvided} onChange={handleChange} required>
              <option value="">Will you provide content?</option>
              <option value="Yes">Yes</option>
              <option value="No">No, I need help</option>
            </select>
            <label>Upload Content Files (images, docs, etc.):</label>
            <input type="file" name="contentFiles" onChange={handleChange} multiple accept="image/*, .pdf, .doc, .docx" />

            <h3>Functionality</h3>
            <label>Features Needed (select all that apply):</label>
            <div className="checkbox-group">
              {['Contact Form', 'Blog', 'Gallery', 'E-Commerce', 'User Login', 'Search', 'Social Media Links', 'Newsletter Signup', 'Other'].map(feature => (
                <label key={feature}>
                  <input type="checkbox" name="features" value={feature} checked={formData.features.includes(feature)} onChange={handleChange} /> {feature}
                </label>
              ))}
            </div>
            <label>E-Commerce (if applicable):</label>
            <input type="checkbox" name="ecommerce" checked={formData.ecommerce} onChange={handleChange} />
            {formData.ecommerce && (
              <textarea name="ecommerceDetails" value={formData.ecommerceDetails} onChange={handleChange} placeholder="Details (e.g., products, payment methods)" />
            )}

            <h3>Budget & Timeline</h3>
            <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="Budget Range (e.g., R10,000 - R20,000)" required />
            <input type="text" name="timeline" value={formData.timeline} onChange={handleChange} placeholder="Desired Timeline (e.g., 1 month)" required />

            <h3>Competitors & Inspiration</h3>
            <textarea name="competitors" value={formData.competitors} onChange={handleChange} placeholder="List your main competitors’ websites" />
            <textarea name="inspirationSites" value={formData.inspirationSites} onChange={handleChange} placeholder="Websites you like for inspiration" />

            <h3>Additional Info</h3>
            <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} placeholder="Anything else we should know?" />

            <button type="submit" className="cta-button">Submit & Proceed to Booking</button>
          </form>
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <>
          <h2>Confirm Your Booking</h2>
          <p>Please pay the R1000 booking fee to secure your project slot with NetTech.</p>
          <div className="booking-section">
            <p><strong>Fee:</strong> R1000</p>
            <button className="cta-button" onClick={handleBooking}>Pay Now</button>
          </div>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}

export default Questionnaire;