FROM node:22

# Crear carpeta de trabajo
WORKDIR /app

# Instalar dependencias del sistema que podrían ser útiles (opcional)
RUN apt-get update && apt-get install -y git

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto por defecto de React
EXPOSE 3000

# Comando de inicio
CMD ["npm", "run", "start"]


