import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
  const { settings } = useSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: ''
  });

  // Form submission handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    alert('Thank you for your message! We will contact you shortly.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      projectType: ''
    });
  };

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <>
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-neutral-100">
        <div className="container-custom">
          <SectionTitle 
            subtitle="Get In Touch" 
            title="Contact Us" 
          />
          <p className="text-secondary max-w-2xl mt-8">
            We'd love to hear about your project. Contact us using the form below 
            or visit our studio to discuss your architectural needs in person.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <h3 className="text-2xl font-display mb-8 heading-line">Contact Information</h3>
              
              <div className="space-y-8">
                <ContactInfoItem 
                  icon={<FaMapMarkerAlt />}
                  title="Office Address"
                  details={[settings.contact_address || '123 Architecture St. New York, NY 10001']}
                />
                
                <ContactInfoItem 
                  icon={<FaPhone />}
                  title="Phone Numbers"
                  details={[settings.contact_phone || '(123) 456-7890']}
                />
                
                <ContactInfoItem 
                  icon={<FaEnvelope />}
                  title="Email Addresses"
                  details={[settings.contact_email || 'info@architectstudio.com']}
                />
                
                <ContactInfoItem 
                  icon={<FaClock />}
                  title="Working Hours"
                  details={["Monday - Friday: 9am - 6pm", "Saturday: 10am - 4pm", "Sunday: Closed"]}
                />
              </div>
              
              <h3 className="text-xl font-display mt-12 mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                {settings.social_facebook && (
                  <SocialIcon icon={<FaFacebook />} link={settings.social_facebook} />
                )}
                {settings.social_twitter && (
                  <SocialIcon icon={<FaTwitter />} link={settings.social_twitter} />
                )}
                {settings.social_instagram && (
                  <SocialIcon icon={<FaInstagram />} link={settings.social_instagram} />
                )}
                {settings.social_linkedin && (
                  <SocialIcon icon={<FaLinkedin />} link={settings.social_linkedin} />
                )}
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              <h3 className="text-2xl font-display mb-8 heading-line">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-accent"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-accent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-accent"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-accent"
                      placeholder="Project Inquiry"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-neutral-700 mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-accent"
                  >
                    <option value="">Select Project Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="interior">Interior Design</option>
                    <option value="landscape">Landscape Architecture</option>
                    <option value="renovation">Renovation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-accent"
                    placeholder="Tell us about your project and requirements..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="btn-primary w-full md:w-auto"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] bg-neutral-200 relative">
        <div className="absolute inset-0 z-0">
          {/* In a real application, you would embed a Google Map or other map provider here */}
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-neutral-300 mb-4">
                <FaMapMarkerAlt className="inline-block" />
              </div>
              <p className="text-xl text-neutral-500">Google Map would be embedded here</p>
              <p className="text-neutral-400 mt-2">{settings.contact_address || '123 Architecture St. New York, NY 10001'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl font-display mb-6">Need a Project Consultation?</h2>
            <p className="text-secondary max-w-2xl mx-auto mb-8">
              Schedule a free 30-minute consultation with one of our expert architects to discuss your project ideas and requirements.
            </p>
            <a href={`tel:${settings.contact_phone || '+1234567890'}`} className="btn-primary">
              Call {settings.contact_phone || '(123) 456-7890'}
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Contact Info Item Component (internal to Contact page)
const ContactInfoItem = ({ icon, title, details }) => {
  return (
    <div className="flex">
      <div className="text-accent mt-1 mr-4">
        {icon}
      </div>
      <div>
        <h4 className="font-medium mb-2">{title}</h4>
        <div className="text-secondary">
          {details.map((detail, index) => (
            <p key={index} className="mb-1">{detail}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

// Social Icon Component (internal to Contact page)
const SocialIcon = ({ icon, link }) => {
  return (
    <a 
      href={link} 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-secondary hover:border-accent hover:text-accent hover:bg-white transition-colors duration-300"
    >
      {icon}
    </a>
  );
};

export default Contact;