@echo off
cd "C:\Users\admin\fila_atendimento\filaAtendimento\back-end"
echo "Instalando dependencias do back-end..."
call npm install
echo "Buildando o back-end..."
call npm run build
echo "Iniciando o back-end..."
call npm run dev