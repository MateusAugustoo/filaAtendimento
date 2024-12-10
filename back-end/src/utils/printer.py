import win32print
import win32ui, win32com
import sys


def imprimir_bematech(texto, nome_impressora="Bematech MP-4200 HS"):
    try:
        hprinter = win32print.OpenPrinter(nome_impressora)
        hdc = win32ui.CreateDC()
        hdc.CreatePrinterDC(nome_impressora)

        # Define a fonte (opcional)
        fonte = win32ui.CreateFont(
            {
                "name": "Arial",
                "height": 120,  # Altura em pontos
                "weight": 700,  # Negrito (700 para negrito)
                "orientation": 0,
            }
        )

        hdc.SelectObject(fonte)

        hdc.StartDoc("Impressão Bematech")
        hdc.StartPage()

        # Comando de inicialização da Bematech (se necessário)
        # hdc.TextOut(0, 0, "INIT")  # Ou o comando específico da sua impressora

        # Imprime o texto
        hdc.TextOut(0, 0, "Senha")
        # Comando de corte de papel (se necessário - verificar manual da impressora)
        hdc.TextOut(0, 180, texto)  # Exemplo de comando ESC/POS

        hdc.EndPage()
        hdc.EndDoc()

        win32print.ClosePrinter(hprinter)
        print("Impressão enviada com sucesso para a Bematech MP-4200 HS.")

    except Exception as e:
        print(f"Erro ao imprimir: {e}")


# Para descobrir o nome exato da impressora:
# import win32print
# impressoras = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL)
# for impressora in impressoras:
#     print(impressora[2])  # O nome da impressora está no índice 2


if __name__ == "__main__":
    password = sys.argv[1]
    imprimir_bematech(password)
    