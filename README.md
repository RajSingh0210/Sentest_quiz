# Gratuity Liability Sensitivity Test - Next.js

A modern web application for testing understanding of gratuity liability calculations under different assumption scenarios. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Interactive Testing**: Test your ability to estimate changes in gratuity liability (PBO) when key assumptions change
- **Dynamic Scenarios**: Randomly generated scenarios with varying employee demographics and actuarial assumptions
- **Real-time Validation**: Instant feedback on your estimates with percentage accuracy
- **Responsive Design**: Modern UI built with Tailwind CSS that works on all devices
- **API Routes**: RESTful API endpoints for scenario generation and validation
- **QR Code Generation**: Generate QR codes for easy mobile access

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes (serverless functions)
- **Dependencies**: React, QRCode, UUID

## Project Structure

```
Gratuity_Sentest_NextJS/
├── lib/
│   ├── scenarioGenerator.ts    # Core logic for generating test scenarios
│   └── scenarioStore.ts         # In-memory storage for active scenarios
├── pages/
│   ├── api/
│   │   ├── index.ts            # API health check
│   │   ├── routes.ts           # List all available routes
│   │   ├── start-test.ts       # Generate new scenario
│   │   ├── validate.ts         # Validate user answer
│   │   └── qr.ts               # Generate QR code
│   ├── _app.tsx                # App wrapper
│   ├── _document.tsx           # Document structure
│   ├── index.tsx               # Home page
│   └── test.tsx                # Test interface
├── styles/
│   └── globals.css             # Global styles with Tailwind
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd Gratuity_Sentest_NextJS
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm start
```

## Available Routes

### Frontend Routes

- `/` - Home page with project information
- `/test` - Interactive test interface

### API Routes

- `GET /api` - API health check
- `GET /api/routes` - List all available API routes
- `GET /api/start-test` - Generate a new test scenario
- `POST /api/validate` - Validate user's answer
  - Request body: `{ scenario_id: string, user_pbo: number }`
- `GET /api/qr` - Generate QR code for the test page

## How It Works

### Scenario Generation

The application generates random scenarios with:
- Number of employees (50-25,000)
- Average age (25-59.5 years)
- Average past service (calculated based on joining age)
- Average salary (₹15,000-₹100,000)
- Salary increase rate (4-15%)
- Discount rate (6-12%)
- Attrition rate (1-30%)
- Duration (calculated based on retirement age and attrition)

### PBO Calculation

The base PBO (Projected Benefit Obligation) is calculated using:
```
PBO = Average Salary × Average Past Service × Number of Employees × Base Multiplier × (Salary Factor / Discount Factor)
```

Where:
- Salary Factor = (1 + Salary Increase Rate)^Duration
- Discount Factor = (1 + Discount Rate)^Duration

### Sensitivity Testing

The application tests your ability to estimate PBO changes when:
- Discount Rate changes by ±0.5% or ±1%
- Salary Increase Rate changes by ±0.5% or ±1%

### Validation

Your answer is considered correct if it's within 0.5% of the actual calculated value.

## Conversion from Python/Flask

This Next.js application is a complete conversion of the original Python Flask application with the following improvements:

1. **TypeScript**: Type-safe code with better IDE support
2. **Modern UI**: Tailwind CSS for responsive, modern design
3. **Serverless**: Next.js API routes instead of Flask server
4. **No Python Dependencies**: Pure JavaScript/TypeScript implementation
5. **Better Performance**: React for efficient UI updates
6. **Easy Deployment**: Can be deployed to Vercel, Netlify, or any Node.js hosting

## Development Notes

- The scenario store is in-memory, so scenarios are lost on server restart
- For production, consider using a database or Redis for persistence
- The QR code generates a URL based on the request origin
- All calculations use JavaScript equivalents of NumPy functions

## License

This project is for educational purposes.

## Original Python Version

The original Python/Flask version can be found in the `Gratuity_Sentest` directory.
