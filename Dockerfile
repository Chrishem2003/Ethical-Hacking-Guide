# Multi-stage build for HACKFORGE React + Vite frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production server
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js 2>/dev/null || true
COPY server.ts ./
COPY --from=builder /app/content ./content 2>/dev/null || true

EXPOSE 3000

CMD ["node", "-e", "import('express').then(({default: express}) => { const app = express(); app.use(express.static('dist')); app.get('*', (req, res) => res.sendFile('/app/dist/index.html')); app.listen(3000, '0.0.0.0', () => console.log('HACKFORGE Web listening on 3000')); })"]
