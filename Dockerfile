
# Utilise une image Node.js officielle comme base
FROM node:20-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances (utilise install si pas de lock file)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copie le code source
COPY . .

# Construit l'application pour la production
RUN npm run build

# Expose le port 8080
EXPOSE 8080

# Commande pour démarrer l'application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
