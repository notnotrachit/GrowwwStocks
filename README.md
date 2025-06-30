# Stocks App - React Native

A comprehensive stocks and ETFs broking platform built with React Native and Expo, featuring real-time market data, watchlists, and detailed stock analysis.

## Features

### 🏠 Explore Screen
- **Top Gainers & Losers**: View the best and worst performing stocks
- **Search Functionality**: Search for specific stocks using Alpha Vantage API
- **Grid Layout**: Clean card-based interface showing stock information
- **View All**: Navigate to detailed lists with pagination

### 📊 Stock Details (Product Screen)
- **Interactive Charts**: Line graphs showing stock price history
- **Company Information**: Comprehensive overview including sector, industry, market cap
- **Key Metrics**: P/E ratio, 52-week high/low, dividend yield, beta
- **Watchlist Integration**: Add/remove stocks from watchlists with visual feedback

### 📋 Watchlist Management
- **Multiple Watchlists**: Create and manage multiple custom watchlists
- **Stock Organization**: Add stocks to existing or new watchlists
- **Easy Removal**: Remove stocks from watchlists with confirmation
- **Empty States**: Intuitive empty state handling

### 🔍 View All Screen
- **Pagination**: Efficient loading of large stock lists
- **Performance Optimized**: Virtualized lists for smooth scrolling
- **Pull to Refresh**: Update data with pull-to-refresh gesture

### 💾 Data Management
- **API Caching**: Intelligent caching with expiration (5 minutes)
- **Local Storage**: Persistent watchlist storage using AsyncStorage
- **Rate Limiting**: Respects Alpha Vantage API limits (5 requests/minute)
- **Error Handling**: Comprehensive error states with retry functionality

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **Charts**: React Native Chart Kit
- **Storage**: AsyncStorage for local data persistence
- **API**: Alpha Vantage for real-time stock data
- **UI Components**: Custom components with consistent design system
- **TypeScript**: Full TypeScript support for type safety

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Alpha Vantage API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StocksApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Get your free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Open `src/constants/index.ts`
   - Replace `YOUR_ALPHA_VANTAGE_API_KEY` with your actual API key:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'https://www.alphavantage.co/query',
     API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace this
     CACHE_DURATION: 5 * 60 * 1000,
     REQUEST_DELAY: 12000,
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── cards/           # Stock cards and list items
│   ├── charts/          # Chart components
│   ├── common/          # Common UI elements (Loading, Error, Empty states)
│   └── modals/          # Modal components
├── constants/           # App constants and configuration
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── explore/        # Explore/Home screen
│   ├── product/        # Stock details screen
│   ├── viewall/        # Paginated lists screen
│   └── watchlist/      # Watchlist management screen
├── services/           # API services and data management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## API Integration

### Alpha Vantage Endpoints Used
- **TOP_GAINERS_LOSERS**: Market movers data
- **OVERVIEW**: Company fundamental data
- **TIME_SERIES_DAILY**: Historical price data for charts
- **SYMBOL_SEARCH**: Stock symbol search functionality

### Rate Limiting
- Maximum 5 requests per minute (free tier)
- 12-second delay between requests
- Intelligent caching to minimize API calls

## Key Features Implementation

### Caching Strategy
- **Duration**: 5 minutes for market data
- **Storage**: AsyncStorage with expiration timestamps
- **Fallback**: Graceful degradation when cache fails

### Watchlist Management
- **Local Storage**: Persistent storage using AsyncStorage
- **CRUD Operations**: Create, read, update, delete watchlists
- **Validation**: Input validation for watchlist names
- **Conflict Resolution**: Handles duplicate stocks and names
