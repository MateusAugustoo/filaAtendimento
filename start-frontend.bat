@echo off
cd "C:\Users\admin\fila_atendimento\filaAtendimento\front-end"
echo "Instalando dependencias do front-end..."
call npm install
echo "Buildando o front-end..."
call npm run build
echo "Iniciando o front-end com serve..."
call npx serve -s dist -l 5554
