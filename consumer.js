const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulateData() {
    const bpm1 = getRandomInt(61, 76);
    const bpm2 = getRandomInt(61, 76);
    const oxigenacion = getRandomInt(98, 100);
    const temperatura = getRandomInt(36, 38); // Simulación de temperatura para MLX90614
  
    const activityLevels = ['low', 'mid']; // Agregamos los niveles de actividad
  
    const data = {
      Pulse_Sensor: bpm1,
      MAX30102: oxigenacion,
      MLX90614: temperatura,
      Pulse_irt: bpm2,
      ADXL345: activityLevels[Math.floor(Math.random() * activityLevels.length)] // Seleccionamos aleatoriamente entre 'low' y 'mid'
    };
  

  return data;
}

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  const interval = setInterval(() => {
    const simulatedData = simulateData();

    // Enviar ambos valores en el mismo mensaje como un objeto JSON
    ws.send(JSON.stringify(simulatedData));
  }, 1000);

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });
});

app.use(express.static('public'));

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(3001, () => {
  console.log('Servidor WebSocket iniciado en el puerto 3001');
});
