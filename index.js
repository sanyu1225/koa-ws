const Koa = require("koa");
const WebSocket = require("ws");
const app = new Koa();

const wss = new WebSocket.Server({ port: 8080, path: "/kline" });

let binanceSocket = null;

const formatData = (data) => {
  const jsonData = typeof data === "string" ? JSON.parse(data) : data;
  const { E, k, e } = jsonData || {};
  if (e !== "kline") return;
  const res = {
    type: "data",
    topic: "memecoin_candlestick",
    data: {
      token_address: "<TOKEN_ADDRESS>",
      interval: "1m",
      candlestick: {
        timestamp_milli: E,
        open: k?.o,
        close: k?.c,
        high: k?.h,
        low: k?.l,
        volume: k?.v,
      },
    },
  };
  return JSON.stringify(res);
};

wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.on("message", (message) => {
    processMessage(message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function processMessage(message) {
  try {
    const parsedMessage = JSON.parse(message);
    if (
      parsedMessage.type === "subscribe" &&
      parsedMessage.topic === "memecoin_candlestick"
    ) {
      if (!binanceSocket) {
        binanceSocket = new WebSocket(
          "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
        );

        binanceSocket.on("message", (data) => {
          const jsonData = JSON.parse(data);
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(formatData(jsonData));
            }
          });
        });

        binanceSocket.on("open", () => {
          const subscribeMessage = JSON.stringify({
            method: "SUBSCRIBE",
            params: ["btcusdt@kline_1m"],
            id: 1,
          });
          binanceSocket.send(subscribeMessage);
          console.log("Sent subscription message to Binance");
        });

        binanceSocket.on("close", () => {
          console.log("Binance WebSocket closed");
          binanceSocket = null;
        });

        binanceSocket.on("error", (error) => {
          console.error("Binance WebSocket error:", error);
          binanceSocket = null;
        });
      }
    }
  } catch (error) {
    console.error("Failed to parse message:", error);
  }
}

app.use(async (ctx) => {
  ctx.body = "Test Ws 🚀";
});

app.listen(3333, () => {
  console.log("Koa server is running on port 3333");
});
