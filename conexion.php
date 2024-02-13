

<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Configuración de la conexión a la base de datos
$host = 'localhost';
$dbname = 'sm52_arduino';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    // Configura el PDO error mode a excepción
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      // Consulta SQL para obtener los últimos datos de tb_puerto_serial
      $sql1 = "SELECT mensaje, led_color, fecha FROM tb_puerto_serial ORDER BY id_puerto_serial DESC LIMIT 10";
      $stmt1 = $pdo->query($sql1);
  
      $data1 = [];
      while ($row = $stmt1->fetch(PDO::FETCH_ASSOC)) {
          $data1[] = $row;
      }

     // Consulta SQL para obtener los últimos datos de tb_puerto_serial2
     $sql2 = "SELECT mensaje, valor, fecha FROM tb_puerto_serial2 ORDER BY id_tabla DESC LIMIT 10";
     $stmt2 = $pdo->query($sql2);
 
     $data2 = [];
     while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
         $data2[] = $row;
     }
 

      // Combinar los datos de ambas consultas
    $combinedData = ['tb_puerto_serial' => $data1, 'tb_puerto_serial2' => $data2];
  
// Enviar datos combinados en formato JSON
echo json_encode($combinedData);

} catch (PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}