FROM node:18-alpine

# Atualizar pacotes do sistema e instalar dependências necessárias
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

WORKDIR /app

# Copiar package files primeiro (para cache otimizado)
COPY back-end/package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY back-end/ ./

# Alterar propriedade dos arquivos para o usuário nodejs
RUN chown -R nodeuser:nodejs /app

# Trocar para usuário não-root
USER nodeuser

# Expor porta
EXPOSE 3000

# Usar dumb-init para melhor handling de sinais
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar
CMD ["npm", "start"]
