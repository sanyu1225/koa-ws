# Koa WebSocket Server for Binance Data

A WebSocket server built with Koa.js that connects to Binance's WebSocket API and forwards real-time cryptocurrency price data to clients.

## Features

- WebSocket server running on port 8080 with path `/kline`
- Connects to Binance's WebSocket API for BTC/USDT 1-minute candlestick data
- Formats and forwards the data to connected clients
- HTTP server running on port 3333 for health checks

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

```bash
yarn run start
```

## Dependencies

- [Koa](https://koajs.com/) - Next generation web framework for Node.js
- [ws](https://github.com/websockets/ws) - Simple and fast WebSocket client and server implementation

## License

ISC