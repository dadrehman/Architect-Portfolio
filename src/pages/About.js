import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaBuilding, FaLeaf } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import { createPlaceholderUrl } from '../utils/placeholderUtil';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Placeholder images
  const aboutHeroImage = createPlaceholderUrl(1920, 800, 'About Us', 'dcb286', '333333');
  const aboutDetailImage = createPlaceholderUrl(800, 600, 'Design Process', 'f4f4f5', '333333');
  const teamMember1 = createPlaceholderUrl(600, 600, 'Team Member 1', 'f4f4f5', '333333');
  const teamMember2 = createPlaceholderUrl(600, 600, 'Team Member 2', 'f4f4f5', '333333');
  const teamMember3 = createPlaceholderUrl(600, 600, 'Team Member 3', 'f4f4f5', '333333');
  const teamMember4 = createPlaceholderUrl(600, 600, 'Team Member 4', 'f4f4f5', '333333');

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Team data
  const teamData = [
    {
      id: 1,
      name: 'David Anderson',
      position: 'Principal Architect',
      image: teamMember1,
      bio: 'David has over 20 years of experience in architectural design with a focus on sustainable urban development.'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      position: 'Senior Designer',
      image: teamMember2,
      bio: 'With a background in fine arts and structural engineering, Sarah brings a unique perspective to each project.'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      position: 'Project Manager',
      image: teamMember3,
      bio: 'Michael excels at coordinating complex projects and ensuring they are completed on time and within budget.'
    },
    {
      id: 4,
      name: 'Julia Kim',
      position: 'Interior Specialist',
      image: teamMember4,
      bio: 'Julias innovative approach to interior spaces has earned her recognition in numerous design publications.'
    }
  ];

  // Rest of the component code remains the same
  
  return (
    <>
      {/* Page Header */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHeroImage} 
            alt="About Architect Studio" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white max-w-2xl"
          >
            <span className="text-accent uppercase tracking-widest text-sm font-medium mb-4 block">
              About Us
            </span>
            <h1 className="text-5xl md:text-6xl font-display mb-6 leading-tight">
              Crafting Exceptional <span className="text-accent">Architectural</span> Experiences
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <SectionTitle 
                subtitle="Our Story" 
                title="A Passion for Innovative Architecture" 
              />
              
              <p className="text-secondary mb-6 leading-relaxed">
                Founded in 2005, Architect Studio began with a simple vision: to create spaces that 
                inspire, function beautifully, and stand the test of time. What started as a small 
                team of passionate designers has grown into a leading architectural firm with projects 
                across the globe.
              </p>
              <p className="text-secondary mb-6 leading-relaxed">
                We believe that architecture is both an art and a science—a delicate balance between 
                creative expression and technical precision. Every project we undertake reflects this 
                philosophy, resulting in designs that are as practical as they are beautiful.
              </p>
              <p className="text-secondary mb-8 leading-relaxed">
                Our collaborative approach involves clients at every stage of the design process, 
                ensuring that the final result not only meets but exceeds expectations. We pride 
                ourselves on our attention to detail, commitment to sustainability, and ability to 
                transform challenges into opportunities for innovation.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              <div className="relative z-10">
                <img 
                  src={aboutDetailImage} 
                  alt="Our design process" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-8 -right-8 w-1/2 h-24 bg-accent z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <StatItem 
              icon={<FaAward size={36} />}
              number="25+"
              label="Design Awards"
              delay={0}
            />
            <StatItem 
              icon={<FaUsers size={36} />}
              number="150+"
              label="Happy Clients"
              delay={1}
            />
            <StatItem 
              icon={<FaBuilding size={36} />}
              number="200+"
              label="Projects Completed"
              delay={2}
            />
            <StatItem 
              icon={<FaLeaf size={36} />}
              number="85%"
              label="Sustainable Designs"
              delay={3}
            />
          </motion.div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle 
            subtitle="Meet The Experts" 
            title="Our Team" 
            alignment="center"
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            {teamData.map((member, index) => (
              <TeamMember 
                key={member.id}
                image={member.image}
                name={member.name}
                position={member.position}
                bio={member.bio}
                delay={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-neutral-100">
        <div className="container-custom">
          <SectionTitle 
            subtitle="Our Core Values" 
            title="What Drives Us" 
            alignment="center"
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <ValueCard 
              number="01"
              title="Innovation"
              description="We constantly push the boundaries of what's possible, embracing new technologies and methodologies to create forward-thinking designs."
              delay={0}
            />
            <ValueCard 
              number="02"
              title="Sustainability"
              description="Environmental responsibility is integrated into every aspect of our design process, creating spaces that are as kind to the planet as they are beautiful."
              delay={1}
            />
            <ValueCard 
              number="03"
              title="Collaboration"
              description="We believe the best results come from true partnership—with our clients, with each other, and with the communities in which we build."
              delay={2}
            />
          </motion.div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-24 bg-accent text-primary">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-6 tracking-tight">
              Start Your Project With Us
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto opacity-80">
              Ready to bring your architectural vision to life? Our team is excited to collaborate with you
              on your next project, whether it's a residential dream home or a commercial masterpiece.
            </p>
            <Link to="/contact" className="px-8 py-3 bg-primary text-white font-medium tracking-wide uppercase text-sm hover:bg-neutral-800 transition-all duration-300">
              Contact Us Today
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Stat Item Component (internal to About page)
const StatItem = ({ icon, number, label, delay = 0 }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        delay: delay * 0.1
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      variants={itemVariants}
    >
      <div className="text-accent mb-4">{icon}</div>
      <div className="text-4xl font-display font-medium mb-2">{number}</div>
      <div className="text-secondary uppercase tracking-wide text-sm">{label}</div>
    </motion.div>
  );
};

// Team Member Component (internal to About page)
const TeamMember = ({ image, name, position, bio, delay = 0 }) => {
  const memberVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        delay: delay * 0.1
      }
    }
  };

  return (
    <motion.div
      className="group"
      variants={memberVariants}
    >
      <div className="relative overflow-hidden mb-6">
        <img 
          src={image} 
          alt={name} 
          className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <h3 className="text-xl font-medium mb-1 group-hover:text-accent transition-colors duration-300">{name}</h3>
      <p className="text-accent mb-3">{position}</p>
      <p className="text-secondary text-sm">{bio}</p>
    </motion.div>
  );
};

// Value Card Component (internal to About page)
const ValueCard = ({ number, title, description, delay = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        delay: delay * 0.1
      }
    }
  };

  return (
    <motion.div 
      className="bg-white p-8 border border-neutral-200 group hover:border-accent transition-colors duration-300 h-full"
      variants={cardVariants}
    >
      <span className="text-accent text-5xl font-display opacity-30 block mb-6">{number}</span>
      <h3 className="text-xl font-medium mb-4 group-hover:text-accent transition-colors duration-300">{title}</h3>
      <p className="text-secondary">{description}</p>
    </motion.div>
  );
};

export default About;