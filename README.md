# Travel Application Backend

A Node.js Express backend for a travel application.

## Features

- Express server with CORS support
- Environment variable configuration
- Error handling middleware
- Development mode with hot reloading

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3000
NODE_ENV=development
```

### Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3000 by default (or the port specified in your .env file).

## API Endpoints

- `GET /api`: Welcome message

## Project Structure

```
backend/
├── src/
│   └── app.js      # Main application file
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation
```

## License

ISC 