# Projeto de Fila de Atendimento

### criar executavel usando a lib serve

  - 1. npm install -g serve
  - 2. criar arquivo .vbs e adicionar na inicialização do windows
  - script .vbs:
  Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\mateu\fullStack\filaAtendimento\front-end\"
WshShell.Run "cmd /c ""C:\Users\mateu\AppData\Roaming\npm\serve.cmd"" -s dist -p 5000", 0, False

