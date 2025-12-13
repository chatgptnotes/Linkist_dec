'use client';

import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import NoteIcon from '@mui/icons-material/Note';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RequestAccessModal({ isOpen, onClose, onSuccess }: RequestAccessModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/founders/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', profession: '', note: '' });
    setSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {success ? (
          // Success State
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Request Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in the Founders Club. We'll review your request and get back to you within 24-48 hours with an invite code.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              Close
            </button>
          </div>
        ) : (
          // Form State
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Request Founders Club Access
              </h2>
              <p className="text-gray-600 text-sm">
                Fill in your details and we'll review your request. Approved members will receive an invite code via email.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="John"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Doe"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 234 567 8900"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession / Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <WorkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    required
                    placeholder="e.g., CEO, Software Engineer, Designer"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Note (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to join the Founders Club? <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <NoteIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us a bit about yourself and why you're interested..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} style={{ color: 'white' }} />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
