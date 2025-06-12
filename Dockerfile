
# Utilise une image Node.js officielle comme base
FROM node:20-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances (y compris dev pour le build)
RUN npm ci

# Copie le code source
COPY . .

# Construit l'application pour la production
RUN npm run build

# Expose le port 8080
EXPOSE 8080

# Commande pour démarrer l'application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
