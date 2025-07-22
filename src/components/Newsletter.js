import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { publicService } from '../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await publicService.subscribeNewsletter(email);
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-accent rounded-md"
          required
        />
        <motion.button
          type="submit"
          className="btn-primary w-full sm:w-auto"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </motion.button>
      </div>
      <p className="text-sm text-gray-500 text-center">
        Stay updated with our latest news and insights.
      </p>
    </form>
  );
};

export default Newsletter;