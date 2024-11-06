import win32print
import sys

def print_password(password: str): 
    zpl_command = f"""
    ^XA  ;

    ^LL600  ;
    ^PW300  ;

    ;
    ^FO0,200  ; 
    ^A0N,100,100  ; 
    ^FB300,1,0,C  ; 
    ^FDSenha:^FS  ; 
    ;
    ^FO0,350  ;
    ^A0N,100,100  ; 
    ^FB300,1,0,C  ;
    ^FD{password}^FS  ; 

    ^XZ  ; 

    ^MC1 ;
    """
    printer_name = "ZDesigner GC420d (EPL)"
    printer = win32print.OpenPrinter(printer_name)
    job = win32print.StartDocPrinter(printer, 1, ("Zebra Print Job", None, "RAW"))
    win32print.StartPagePrinter(printer)
    win32print.WritePrinter(printer, zpl_command.encode('utf-8'))
    win32print.EndPagePrinter(printer)
    win32print.EndDocPrinter(printer)
    win32print.ClosePrinter(printer)

if __name__ == "__main__":
    password = sys.argv[1]  
    print_password(password)
