#include <Ultrasonic.h>

Ultrasonic ultrasonic(12, 13); // (Trig pin, Echo pin)
int ledR = 9; // LED Rojo
int ledA = 10; // LED Amarillo
int ledV = 11; // LED Verde
int sensorFotoResistor = A0; // Selecciona el pin al que está conectado el LDR
int ValueFotoResistor = 0; // Variable para almacenar el valor del sensor

void setup() {
  Serial.begin(9600);
  pinMode(ledR, OUTPUT);
  pinMode(ledA, OUTPUT);
  pinMode(ledV, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    controlLEDs(command);
  }

   ValueFotoResistor = analogRead(sensorFotoResistor); // Lee el valor del sensor
  long distance = ultrasonic.distanceRead(CM);
  Serial.print(ValueFotoResistor);
  Serial.print(",");
  Serial.println(distance);
  delay(1000);
}

void controlLEDs(char command) {
  // Apagar todos los LEDs primero
  digitalWrite(ledR, LOW);
  digitalWrite(ledA, LOW);
  digitalWrite(ledV, LOW);
  
  // Encender el LED basado en el comando recibido
  switch (command) {
    case 'R':
      digitalWrite(ledR, HIGH);
      break;
    case 'A':
      digitalWrite(ledA, HIGH);
      break;
    case 'V':
      digitalWrite(ledV, HIGH);
      break;
    default:
      // Si se recibe otro carácter, no hacer nada o apagar todos los LEDs
      break;
  }
}