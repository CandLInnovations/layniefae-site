// Email templates for Laynie Fae - mystical and beautiful

interface OrderConfirmationData {
  customerName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderDate: string;
}

interface WelcomeEmailData {
  customerName: string;
  email: string;
}

export const emailTemplates = {
  orderConfirmation: (data: OrderConfirmationData) => ({
    subject: `🌸 Your Sacred Order Confirmation - ${data.orderId}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sacred Purchase Complete</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #2d1b69;
      background: linear-gradient(135deg, #0f0c29 0%, #24243e 50%, #2d1b69 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 2.5em;
      color: #8b5cf6;
      margin-bottom: 10px;
    }
    .title {
      font-size: 2em;
      color: #2d1b69;
      margin-bottom: 10px;
      font-weight: 300;
    }
    .subtitle {
      color: #6b7280;
      font-size: 1.1em;
    }
    .order-details {
      background: #f8fafc;
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
      border-left: 4px solid #8b5cf6;
    }
    .order-id {
      font-size: 0.9em;
      color: #6b7280;
      margin-bottom: 15px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .item:last-child {
      border-bottom: none;
      font-weight: bold;
      font-size: 1.1em;
      color: #2d1b69;
    }
    .blessing {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 25px 0;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 0.9em;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌸🔮✨</div>
      <h1 class="title">Sacred Purchase Complete!</h1>
      <p class="subtitle">Your mystical treasures have been blessed and are now making their way to you with sacred intention.</p>
    </div>

    <div class="order-details">
      <div class="order-id">Order ID: ${data.orderId}</div>
      <div class="order-id">Order Date: ${data.orderDate}</div>
      
      ${data.orderItems.map(item => `
        <div class="item">
          <span>${item.name} × ${item.quantity}</span>
          <span>$${(item.price * item.quantity / 100).toFixed(2)}</span>
        </div>
      `).join('')}
      
      <div class="item">
        <span>Total</span>
        <span>$${(data.totalAmount / 100).toFixed(2)}</span>
      </div>
    </div>

    <div class="blessing">
      <h3>🌙 Sacred Blessing 🌙</h3>
      <p>Your mystical items will be prepared with loving intention and positive energy. Shipping will be arranged within 1-2 sacred days.</p>
    </div>

    <div class="footer">
      <p>Thank you for choosing Laynie Fae for your mystical journey.</p>
      <p>With love and light ✨</p>
      <p><strong>Laynie Fae</strong></p>
    </div>
  </div>
</body>
</html>`,
    text: `
Sacred Purchase Complete! 🌸

Dear ${data.customerName},

Your mystical treasures have been blessed and are now making their way to you with sacred intention.

Order Details:
Order ID: ${data.orderId}
Order Date: ${data.orderDate}

${data.orderItems.map(item => `${item.name} × ${item.quantity}: $${(item.price * item.quantity / 100).toFixed(2)}`).join('\n')}

Total: $${(data.totalAmount / 100).toFixed(2)}

Your mystical items will be prepared with loving intention and positive energy. Shipping will be arranged within 1-2 sacred days.

Thank you for choosing Laynie Fae for your mystical journey.

With love and light ✨
Laynie Fae
    `
  }),

  welcomeEmail: (data: WelcomeEmailData) => ({
    subject: `🌸 Welcome to the Laynie Fae Mystical Community!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Laynie Fae</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #2d1b69;
      background: linear-gradient(135deg, #0f0c29 0%, #24243e 50%, #2d1b69 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 3em;
      margin-bottom: 15px;
    }
    .title {
      font-size: 2.2em;
      color: #2d1b69;
      margin-bottom: 10px;
      font-weight: 300;
    }
    .subtitle {
      color: #6b7280;
      font-size: 1.1em;
    }
    .welcome-message {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
      color: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      margin: 25px 0;
    }
    .features {
      background: #f8fafc;
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
    }
    .feature {
      margin: 15px 0;
      display: flex;
      align-items: center;
    }
    .feature-icon {
      margin-right: 12px;
      font-size: 1.2em;
    }
    .cta {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 0.9em;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌸🔮✨</div>
      <h1 class="title">Welcome to Laynie Fae!</h1>
      <p class="subtitle">Your mystical journey begins here</p>
    </div>

    <div class="welcome-message">
      <h3>🌙 Blessed Greetings, ${data.customerName}! 🌙</h3>
      <p>Welcome to our sacred community of mystical souls. Your account has been created and you're now part of the Laynie Fae family.</p>
    </div>

    <div class="features">
      <h3>What awaits you:</h3>
      <div class="feature">
        <span class="feature-icon">🔮</span>
        <span>Personalized mystical product recommendations based on your preferences</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📜</span>
        <span>Order history and tracking for all your sacred purchases</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🌟</span>
        <span>Exclusive access to new mystical collections and rituals</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🎭</span>
        <span>Custom ritual preferences for a truly personalized experience</span>
      </div>
    </div>

    <div class="cta">
      <a href="https://layniefae.com/shop" class="cta-button">Explore Sacred Collection</a>
    </div>

    <div class="footer">
      <p>Thank you for joining our mystical community.</p>
      <p>May your journey be filled with magic and wonder ✨</p>
      <p><strong>Laynie Fae</strong></p>
    </div>
  </div>
</body>
</html>`,
    text: `
Welcome to Laynie Fae! 🌸

Dear ${data.customerName},

Blessed greetings! Welcome to our sacred community of mystical souls. Your account has been created and you're now part of the Laynie Fae family.

What awaits you:
🔮 Personalized mystical product recommendations based on your preferences
📜 Order history and tracking for all your sacred purchases  
🌟 Exclusive access to new mystical collections and rituals
🎭 Custom ritual preferences for a truly personalized experience

Visit our sacred collection: https://layniefae.com/shop

Thank you for joining our mystical community.
May your journey be filled with magic and wonder ✨

Laynie Fae
    `
  })
};

export type { OrderConfirmationData, WelcomeEmailData };