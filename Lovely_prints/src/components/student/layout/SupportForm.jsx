import React, { useState, useEffect, useRef } from 'react';
import './supportForm-e.css';
import { createPortal } from 'react-dom';

const SupportForm = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
    const modalRoot = document.getElementById("modal-root");


  // ESC key closes modal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset after close animation
      setTimeout(() => {
        setForm({ name: '', email: '', message: '' });
        setErrors({});
        setSubmitted(false);
      }, 300);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
        setErrors(errs);
        return;
    }

    // ✅ 1. Show success UI
    setSubmitted(true);

    const subject = encodeURIComponent(`Support Request from ${form.name}`);
    const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    const mailtoLink = `mailto:support.docuvio@gmail.com?subject=${subject}&body=${body}`;

    // ✅ 2. Open mail + close modal after slight delay
    setTimeout(() => {
        window.location.href = mailtoLink;
        onClose(); // closes modal
    }, 700);
    };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`sf-overlay_e ${isOpen ? 'sf-overlay--visible_e' : ''}`}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Contact Support"
    >
      <div className={`sf-modal_e ${isOpen ? 'sf-modal--visible_e' : ''}`}>

        {/* Header */}
        <div className="sf-header_e">
          <div className="sf-header-left_e">
            <span className="sf-eyebrow_e">DOCUVIO SUPPORT</span>
            <h2 className="sf-title_e">
              {submitted ? 'Message Sent' : 'Contact Support'}
            </h2>
          </div>
          <button
            className="sf-close_e"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="sf-divider_e" />

        {/* Success State */}
        {submitted ? (
          <div className="sf-success_e">
            <div className="sf-success-icon_e">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#7cb518" strokeWidth="1.5"/>
                <path d="M8 14.5L11.5 18L20 10" stroke="#7cb518" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="sf-success-title_e">We've got your message</p>
            <p className="sf-success-sub_e">
              Our team will get back to you at <strong>{form.email}</strong> within 24 hours.
            </p>
            <button className="sf-btn_e sf-btn--primary_e" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form className="sf-form_e" onSubmit={handleSubmit} noValidate>
            <p className="sf-subtitle_e">
              Having trouble? Drop us a message and we'll sort it out fast.
            </p>

            {/* Name */}
            <div className={`sf-field_e ${errors.name ? 'sf-field--error_e' : ''}`}>
              <label className="sf-label_e" htmlFor="sf-name">Full Name</label>
              <div className="sf-input-wrap_e">
                <svg className="sf-input-icon_e" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <input
                  ref={firstInputRef}
                  className="sf-input_e"
                  id="sf-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="sf-error_e">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className={`sf-field_e ${errors.email ? 'sf-field--error_e' : ''}`}>
              <label className="sf-label_e" htmlFor="sf-email">Email Address</label>
              <div className="sf-input-wrap_e">
                <svg className="sf-input-icon_e" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <input
                  className="sf-input_e"
                  id="sf-email"
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="sf-error_e">{errors.email}</span>}
            </div>

            {/* Message */}
            <div className={`sf-field_e ${errors.message ? 'sf-field--error_e' : ''}`}>
              <label className="sf-label_e" htmlFor="sf-message">
                Message
                <span className="sf-char-count_e">{form.message.length}/500</span>
              </label>
              <textarea
                className="sf-textarea_e"
                id="sf-message"
                name="message"
                placeholder="Describe your issue in detail — the more context you give, the faster we can help."
                value={form.message}
                onChange={handleChange}
                rows={4}
                maxLength={500}
              />
              {errors.message && <span className="sf-error_e">{errors.message}</span>}
            </div>

            {/* Actions */}
            <div className="sf-actions_e">
              <button
                type="button"
                className="sf-btn_e sf-btn--secondary_e"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`sf-btn_e sf-btn--primary_e ${submitting ? 'sf-btn--loading_e' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="sf-spinner_e" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    modalRoot
  );
};

export default SupportForm;