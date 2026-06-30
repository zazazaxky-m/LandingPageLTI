FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
CMD ["npx", "prisma", "migrate", "deploy"]

FROM base AS seeder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY prisma ./prisma
CMD ["npm", "run", "db:seed"]

FROM base AS runner
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
