-- Create WhatsApp credits related tables

-- Table for storing user WhatsApp credits
CREATE TABLE IF NOT EXISTS whatsapp_credits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_credits INT DEFAULT 0,
  used_credits INT DEFAULT 0,
  remaining_credits INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_credits (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for WhatsApp credit pricing
CREATE TABLE IF NOT EXISTS whatsapp_credit_pricing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  credits INT NOT NULL,
  price_inr DECIMAL(10,2) NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_credits_active (credits, active)
);

-- Table for WhatsApp credit transactions
CREATE TABLE IF NOT EXISTS whatsapp_credit_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  credits_added INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at)
);

-- Insert default pricing data
INSERT INTO whatsapp_credit_pricing (credits, price_inr, price_usd, active) VALUES
(1500, 599.00, 7.19, 1)
ON DUPLICATE KEY UPDATE
  price_inr = VALUES(price_inr),
  price_usd = VALUES(price_usd),
  active = VALUES(active);
