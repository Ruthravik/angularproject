# Vendor Portal - SAP Integration Platform

A professional, animated Angular frontend application for vendor management with seamless SAP ERP integration.

## 🚀 Features

### 🔐 Authentication
- Secure vendor login with vendor-ID and password validation
- SAP ERP integration for user authentication
- Session management with automatic token validation
- Demo credentials for quick testing

### 📊 Dashboard
- Real-time vendor dashboard with animated statistics cards
- Interactive data visualization
- Live time display with automatic updates
- Quick actions for common tasks
- Recent quotations, purchase orders, and goods receipts

### 👤 Profile Management
- Comprehensive vendor profile view
- Editable company and contact information
- Address management
- SAP integration status monitoring
- Real-time data synchronization

### ⚡ Modern UI/UX
- Professional, responsive design
- Beautiful animations and micro-interactions
- Real-time updates and live data
- Mobile-first responsive layout
- Glassmorphism and modern design elements

## 🛠 Technology Stack

- **Frontend**: Angular 17+ with TypeScript
- **Styling**: SCSS with CSS Custom Properties
- **Animations**: CSS Animations & Transitions
- **HTTP Client**: Angular HttpClient for API integration
- **Routing**: Angular Router with Guards
- **State Management**: RxJS Observables
- **Backend Integration**: SAP OData Services

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vendor-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Angular CLI (if not already installed)
```bash
npm install -g @angular/cli@latest
```

### 4. Start the Development Server
```bash
ng serve
```

### 5. Open Browser
Navigate to `http://localhost:4200`

## 🔑 Demo Credentials

### Vendor 1 - Tech Solutions Ltd.
- **Vendor ID**: `V001`
- **Password**: `password123`

### Vendor 2 - Global Suppliers Inc.
- **Vendor ID**: `V002`
- **Password**: `vendor456`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/              # Login page with animations
│   │   ├── dashboard/          # Main dashboard with real-time data
│   │   └── profile/            # Vendor profile management
│   ├── services/
│   │   ├── auth.service.ts     # Authentication service
│   │   └── sap-odata.service.ts # SAP integration service
│   ├── models/
│   │   └── vendor.model.ts     # TypeScript interfaces
│   ├── guards/
│   │   └── auth.guard.ts       # Route protection
│   └── app.module.ts           # Main application module
├── assets/                     # Static assets
└── styles.scss                 # Global styles
```

## 🔧 Configuration

### SAP Integration Setup

1. **Update SAP OData URLs** in `src/app/services/sap-odata.service.ts`:
```typescript
private readonly sapBaseUrl = 'https://your-sap-system.com/sap/opu/odata/sap';
```

2. **Configure Authentication** in `src/app/services/auth.service.ts`:
```typescript
private sapODataUrl = 'https://your-sap-system.com/sap/opu/odata/sap/ZVendor_SRV';
```

3. **Set up CORS** in your SAP system or use a proxy configuration.

### Environment Configuration

Create environment files for different deployment stages:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  sapBaseUrl: 'https://dev-sap-system.com/sap/opu/odata/sap',
  apiUrl: 'https://your-backend-api.com/api'
};
```

## 🎨 Customization

### Theming
Update CSS custom properties in `src/styles.scss`:

```scss
:root {
  --primary-color: #2563eb;      // Change primary color
  --secondary-color: #64748b;    // Change secondary color
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Animations
Modify animation durations and effects in component SCSS files:

```scss
.fade-in { animation: fadeIn 0.5s ease-out; }
.slide-in-left { animation: slideInLeft 0.5s ease-out; }
```

## 📱 Mobile Support

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px and up)
- 📟 Tablets (768px and up)
- 💻 Desktop (1024px and up)
- 🖥️ Large screens (1440px and up)

## 🔒 Security Features

- JWT-like token authentication
- Route guards for protected pages
- Secure session management
- HTTPS-ready configuration
- XSS protection through Angular's built-in sanitization

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production
```

### Deploy to Various Platforms

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Azure Static Web Apps
```bash
ng build --configuration production
# Deploy using Azure CLI or GitHub Actions
```

#### AWS S3 + CloudFront
```bash
ng build --configuration production
aws s3 sync dist/ s3://your-bucket-name --delete
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `ng generate component <name>` - Generate new component

## 🎯 Key Features Implemented

### 1. Vendor Login (3.2.1)
- ✅ User-ID as vendor-ID authentication
- ✅ Password validation
- ✅ SAP ERP system integration via SAP PO interface
- ✅ Validation result handling
- ✅ Dashboard access upon successful login

### 2. Vendor Profile View (3.2.2)
- ✅ Comprehensive vendor information display
- ✅ Web-service integration with SAP system
- ✅ Synchronous SAP PO calls
- ✅ Master data collection and display

### 3. Vendor Dashboard (3.2.3)
- ✅ End-to-end transaction management
- ✅ Request for Quotation module
- ✅ Purchase Order tracking
- ✅ Goods Receipt monitoring
- ✅ Real-time SAP ERP data fetching
- ✅ User-friendly navigation
- ✅ Complete business transaction overview

## 🌟 Bonus Features

- 🕒 Real-time clock display
- 🎨 Beautiful animations and transitions
- 📱 Mobile-responsive design
- 🔄 Auto-refresh functionality
- 💾 Offline capability preparation
- 🎯 Accessibility features
- 🚀 Performance optimizations

## 🐛 Troubleshooting

### Common Issues

1. **CORS Issues with SAP**
   - Configure SAP system for CORS
   - Use Angular proxy configuration for development

2. **Authentication Failures**
   - Check vendor credentials
   - Verify SAP system connectivity

3. **Styling Issues**
   - Clear browser cache
   - Check SCSS compilation

### Development Tips

1. Use Chrome DevTools for debugging
2. Enable Angular DevTools extension
3. Check Network tab for API calls
4. Use console.log for state debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- 📊 Advanced analytics and reporting
- 🔔 Real-time notifications
- 📧 Email integration
- 📄 Document management
- 🌐 Multi-language support
- 🎨 Theme customization
- 📱 Progressive Web App (PWA) features

---

**Built with ❤️ using Angular and modern web technologies**