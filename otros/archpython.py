import serial
import mysql.connector

# Configuración de la conexión a la base de datos MySQL
db_config = {
    'host': "localhost",
    'user': "root",
    'password': "",
    'database': "sm52_arduino"
}

# Intentar conectar a la base de datos
try:
    db = mysql.connector.connect(**db_config)
    cursor = db.cursor()
except mysql.connector.Error as err:
    print(f"Error al conectar a MySQL: {err}")
    exit(1)

# Abrir conexión serial
arduino = serial.Serial('COM9', 9600, timeout=1)  # Ajusta esto al puerto correcto

try:
    while True:
        data = arduino.readline().decode().strip()  # Leer y decodificar datos del Arduino
        if data:
            parts = data.split(',')
            if len(parts) == 2:  # Asegurarse de que hay dos partes (fotoresistor y distancia)
                valueFotoResistor, distancia = parts
                valueFotoResistor = int(valueFotoResistor)  # Convertir el valor del fotoresistor a entero
                distancia = int(distancia)
            
                # Determinar el color del LED basado en la distancia
                if distancia < 10:
                    led_color = 'rojo'
                    arduino.write(b'R')  # Enviar comando para LED Rojo
                elif distancia < 20:
                    led_color = 'amarillo'
                    arduino.write(b'A')  # Enviar comando para LED Amarillo
                else:
                    led_color = 'verde'
                    arduino.write(b'V')  # Enviar comando para LED Verde
                
                
                # Determinar la luz basada en el fotoresistor
                if valueFotoResistor < 370:
                    nivel_luz = 'mucha luz'
                 
                elif valueFotoResistor < 390:
                    nivel_luz = 'poca luz'
                 
                else:
                    nivel_luz = 'no hay luz'
               
                # Preparar sentencia SQL para insertar los datos incluyendo el color del LED
                sql_distancia = "INSERT INTO tb_puerto_serial (mensaje, led_color) VALUES (%s, %s)"
                cursor.execute(sql_distancia, (distancia, led_color))
                sql_fotoresistor = "INSERT INTO tb_puerto_serial2 (mensaje, valor) VALUES (%s, %s)"
                cursor.execute(sql_fotoresistor, (nivel_luz,valueFotoResistor))
                
                db.commit()
                print(f"Distancia: {distancia} cm, LED: {led_color} Mensaje: {valueFotoResistor} Luz: {nivel_luz}")
            
except KeyboardInterrupt:
    print("Programa terminado por el usuario")
except mysql.connector.Error as err:
    print(f"Error al interactuar con MySQL: {err}")
finally:
    # Cerrar conexiones
    if db.is_connected():
        cursor.close()
        db.close()
    arduino.close()
