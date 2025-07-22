-- COMPLETE SQL DATABASE FOR ARCHITECT PORTFOLIO - SERVERPIE CPANEL READY
-- Import this SQL file into your ServerPie cPanel phpMyAdmin
-- This includes your existing data + all optimizations

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `architect_portfolio` (replace with your ServerPie database name)
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  INDEX `idx_email` (`email`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'admin', 'admin@example.com', '$2b$10$HvEARSKoz/aIDEkSjWDZ1eN/MsKD8agdhSlqMHVnyqo6v7qo0eE.e', '2025-04-30 01:00:41');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `year` varchar(4) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `image_main` varchar(500) DEFAULT NULL,
  `gallery` JSON DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_featured` (`featured`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_year` (`year`),
  FULLTEXT `idx_search` (`title`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `category`, `description`, `client`, `location`, `year`, `featured`, `image_main`, `gallery`, `created_at`, `updated_at`) VALUES
(1, 'Shahab Modern Villa', 'Residential', 'A stunning modern villa featuring contemporary design elements and sustainable architecture principles.', 'Fiver Client', 'Nigeria', '2025', 1, '/uploads/projects/project-1746008908310.jpg', '[\"/uploads/projects/project-1746008908344.jpeg\",\"/uploads/projects/project-1746008908354.jpeg\"]', '2025-04-30 10:28:28', '2025-04-30 10:28:28'),
(2, 'Corporate Plaza', 'Commercial', 'A state-of-the-art corporate building with modern amenities and energy-efficient design.', 'Business Corp', 'Downtown', '2024', 1, '/uploads/projects/sample-commercial.jpg', '["/uploads/projects/commercial-1.jpg", "/uploads/projects/commercial-2.jpg"]', '2025-04-29 09:15:30', '2025-04-29 09:15:30'),
(3, 'City Cultural Center', 'Cultural', 'An innovative cultural center designed to promote arts and community engagement.', 'City Municipality', 'City Center', '2023', 0, '/uploads/projects/sample-cultural.jpg', '["/uploads/projects/cultural-1.jpg"]', '2025-04-28 14:22:10', '2025-04-28 14:22:10');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `quote` text NOT NULL,
  `rating` int(1) DEFAULT 5,
  `image` varchar(500) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_featured` (`featured`),
  INDEX `idx_rating` (`rating`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_company` (`company`),
  FULLTEXT `idx_search` (`client_name`, `company`, `quote`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `client_name`, `position`, `company`, `quote`, `rating`, `image`, `featured`, `created_at`, `updated_at`) VALUES
(1, 'Dadjan Ahmed', 'Software Engineer', 'ITSolera', 'Working with this architecture firm was an incredible experience. Their attention to detail and innovative design solutions exceeded our expectations.', 5, '/uploads/testimonials/testimonial-1746009569228.jpg', 1, '2025-04-30 10:39:29', '2025-04-30 10:39:29'),
(2, 'Sarah Johnson', 'Project Manager', 'Urban Development', 'The team delivered exceptional architectural solutions that perfectly balanced functionality with aesthetic appeal. Highly recommended!', 5, '/uploads/testimonials/sarah-johnson.jpg', 1, '2025-04-29 08:20:15', '2025-04-29 08:20:15'),
(3, 'Michael Chen', 'CEO', 'Tech Innovations', 'Outstanding work on our corporate headquarters. The design reflects our company values and creates an inspiring work environment.', 4, '/uploads/testimonials/michael-chen.jpg', 0, '2025-04-28 16:45:22', '2025-04-28 16:45:22');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` LONGTEXT NOT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_likes` (`likes`),
  FULLTEXT `idx_search` (`title`, `description`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `description`, `content`, `seo_title`, `seo_description`, `likes`, `created_at`, `updated_at`) VALUES
(1, 'Modern Architecture Trends in 2024', 'Exploring the latest trends in modern architecture and sustainable design.', '<p>Modern architecture continues to evolve with new materials, technologies, and design philosophies. This year, we are seeing a strong emphasis on sustainability, biophilic design, and smart building technologies.</p><p>Key trends include the use of cross-laminated timber, passive house standards, and integration of renewable energy systems into building design. Architects are also focusing on creating spaces that promote wellbeing and connection with nature.</p><p>The future of architecture lies in creating buildings that not only serve their functional purpose but also contribute positively to the environment and human experience.</p>', 'Modern Architecture Trends 2024 - Sustainable Design Solutions', 'Discover the latest architectural trends shaping the future of design, from sustainable materials to smart building technologies.', 15, '2025-04-30 12:30:00', '2025-04-30 12:30:00'),
(2, 'Sustainable Building Materials Guide', 'A comprehensive guide to eco-friendly materials in construction and architecture.', '<p>Sustainability in architecture is more important than ever. This comprehensive guide explores the latest eco-friendly materials that are revolutionizing the construction industry.</p><p>From recycled steel and bamboo composites to innovative bio-based materials, these options offer excellent performance while reducing environmental impact. We will examine their properties, applications, and benefits for modern construction projects.</p><p>Making informed choices about building materials is crucial for creating a sustainable future in architecture and construction.</p>', 'Sustainable Building Materials - Eco-Friendly Construction Guide', 'Complete guide to sustainable and eco-friendly building materials for modern construction projects.', 8, '2025-04-29 15:45:00', '2025-04-29 15:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `cv`
--

CREATE TABLE `cv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cv`
--

INSERT INTO `cv` (`id`, `title`, `file_path`, `created_at`) VALUES
(1, 'Professional CV 2024', '/uploads/cv/professional-cv-2024.pdf', '2025-04-30 11:00:00'),
(2, 'Portfolio Resume', '/uploads/cv/portfolio-resume.pdf', '2025-04-29 10:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` TEXT DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  INDEX `idx_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'site_title', 'Architect Studio', '2025-04-29 21:22:03', '2025-04-29 23:54:18'),
(2, 'site_description', 'Modern architectural solutions for residential and commercial projects.', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(3, 'contact_email', 'contact@architectshahab.site', '2025-04-29 21:22:03', '2025-04-29 23:56:30'),
(4, 'contact_phone', '+1 (555) 123-4567', '2025-04-29 21:22:03', '2025-04-29 23:57:16'),
(5, 'contact_address', '123 Design Street, Creative District, CA 90210', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(6, 'primary_color', '#14151a', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(7, 'accent_color', '#dcb286', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(8, 'social_facebook', 'https://facebook.com/architectstudio', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(9, 'social_instagram', 'https://instagram.com/architectstudio', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(10, 'social_linkedin', 'https://linkedin.com/company/architectstudio', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(11, 'social_twitter', 'https://twitter.com/architectstudio', '2025-04-29 21:22:03', '2025-04-29 21:22:03'),
(12, 'theme_primary_color', '#2B2D42', '2025-04-29 23:54:48', '2025-04-30 00:19:36'),
(13, 'theme_accent_color', '#D4A017', '2025-04-29 23:54:48', '2025-04-30 00:19:36'),
(14, 'site_logo', '', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(15, 'site_favicon', '', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(16, 'meta_keywords', 'architecture, design, construction, portfolio, modern architecture', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(17, 'meta_description', 'Professional architecture portfolio showcasing modern design solutions', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(18, 'google_analytics', '', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(19, 'contact_form_email', 'contact@architectshahab.site', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(20, 'newsletter_enabled', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(21, 'blog_enabled', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(22, 'testimonials_enabled', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(23, 'projects_per_page', '12', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(24, 'testimonials_per_page', '10', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(25, 'blogs_per_page', '6', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(26, 'featured_projects_limit', '6', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(27, 'featured_testimonials_limit', '3', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(28, 'file_upload_max_size', '10485760', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(29, 'allowed_image_types', 'jpeg,jpg,png,webp', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(30, 'allowed_document_types', 'pdf', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(31, 'maintenance_mode', '0', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(32, 'site_status', 'active', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(33, 'admin_email_notifications', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(34, 'backup_frequency', 'weekly', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(35, 'cache_duration', '3600', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(36, 'session_timeout', '1800', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(37, 'password_min_length', '8', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(38, 'max_login_attempts', '5', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(39, 'login_lockout_duration', '300', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(40, 'api_rate_limit', '100', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(41, 'enable_ssl', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(42, 'force_https', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(43, 'cookie_secure', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(44, 'cookie_httponly', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(45, 'csrf_protection', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(46, 'xss_protection', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08'),
(47, 'content_security_policy', '1', '2025-04-30 00:20:08', '2025-04-30 00:20:08');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  INDEX `idx_email` (`email`),
  INDEX `idx_subscribed_at` (`subscribed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`id`, `email`, `subscribed_at`) VALUES
(1, 'user1@example.com', '2025-04-30 09:15:30'),
(2, 'user2@example.com', '2025-04-29 14:22:45'),
(3, 'subscriber@demo.com', '2025-04-28 11:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `analytics`
--

CREATE TABLE `analytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_url` varchar(500) NOT NULL,
  `visits` int(11) DEFAULT 0,
  `last_visited` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_url` (`page_url`),
  INDEX `idx_visits` (`visits`),
  INDEX `idx_last_visited` (`last_visited`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `analytics`
--

INSERT INTO `analytics` (`id`, `page_url`, `visits`, `last_visited`) VALUES
(1, '/', 150, '2025-04-30 12:00:00'),
(2, '/projects', 89, '2025-04-30 11:30:00'),
(3, '/about', 64, '2025-04-30 10:45:00'),
(4, '/contact', 45, '2025-04-30 09:15:00'),
(5, '/testimonials', 38, '2025-04-29 16:30:00'),
(6, '/blogs', 42, '2025-04-29 14:20:00');

-- --------------------------------------------------------

--
-- Create database views for better performance
--

CREATE OR REPLACE VIEW `featured_projects_view` AS
SELECT id, title, category, description, client, location, year, image_main, gallery, created_at
FROM projects 
WHERE featured = 1 
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW `featured_testimonials_view` AS
SELECT id, client_name, position, company, quote, rating, image, created_at
FROM testimonials 
WHERE featured = 1 
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW `recent_blogs_view` AS
SELECT id, title, description, likes, created_at
FROM blogs 
ORDER BY created_at DESC 
LIMIT 10;

-- --------------------------------------------------------

--
-- Create stored procedures for common operations
--

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS `GetProjectsByCategory`(IN category_name VARCHAR(100))
BEGIN
    SELECT id, title, category, description, client, location, year, featured, image_main, gallery, created_at, updated_at
    FROM projects 
    WHERE category = category_name 
    ORDER BY created_at DESC;
END //

CREATE PROCEDURE IF NOT EXISTS `GetTopRatedTestimonials`(IN limit_count INT)
BEGIN
    SELECT id, client_name, position, company, quote, rating, image, featured, created_at, updated_at
    FROM testimonials 
    ORDER BY rating DESC, created_at DESC 
    LIMIT limit_count;
END //

CREATE PROCEDURE IF NOT EXISTS `GetDashboardStats`()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM projects WHERE featured = 1) as featured_projects,
        (SELECT COUNT(*) FROM testimonials) as total_testimonials,
        (SELECT COUNT(*) FROM testimonials WHERE featured = 1) as featured_testimonials,
        (SELECT COUNT(*) FROM blogs) as total_blogs,
        (SELECT COUNT(*) FROM cv) as total_cvs,
        (SELECT COUNT(*) FROM newsletter_subscribers) as total_subscribers,
        (SELECT COALESCE(AVG(rating), 0) FROM testimonials) as average_rating,
        (SELECT COALESCE(SUM(likes), 0) FROM blogs) as total_blog_likes,
        (SELECT COALESCE(SUM(visits), 0) FROM analytics) as total_page_visits;
END //

DELIMITER ;

-- --------------------------------------------------------

--
-- Create triggers for automatic updates
--

DELIMITER //

CREATE TRIGGER IF NOT EXISTS `update_project_timestamp` 
BEFORE UPDATE ON `projects`
FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER IF NOT EXISTS `update_testimonial_timestamp` 
BEFORE UPDATE ON `testimonials`
FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER IF NOT EXISTS `update_blog_timestamp` 
BEFORE UPDATE ON `blogs`
FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER IF NOT EXISTS `update_cv_timestamp` 
BEFORE UPDATE ON `cv`
FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER IF NOT EXISTS `update_settings_timestamp` 
BEFORE UPDATE ON `settings`
FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- --------------------------------------------------------

--
-- Final verification and success message
--

SELECT 'Database created successfully with all optimizations!' as STATUS;

SELECT 
    'admins' as table_name, 
    COUNT(*) as record_count,
    'Authentication system' as purpose
FROM admins
UNION ALL
SELECT 
    'projects', 
    COUNT(*),
    'Portfolio projects' 
FROM projects
UNION ALL
SELECT 
    'testimonials', 
    COUNT(*),
    'Client testimonials' 
FROM testimonials
UNION ALL
SELECT 
    'blogs', 
    COUNT(*),
    'Blog posts' 
FROM blogs
UNION ALL
SELECT 
    'cv', 
    COUNT(*),
    'CV documents' 
FROM cv
UNION ALL
SELECT 
    'settings', 
    COUNT(*),
    'Site configuration' 
FROM settings
UNION ALL
SELECT 
    'newsletter_subscribers', 
    COUNT(*),
    'Email subscribers' 
FROM newsletter_subscribers
UNION ALL
SELECT 
    'analytics', 
    COUNT(*),
    'Page analytics' 
FROM analytics;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;