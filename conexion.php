

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

    // Consulta SQL para obtener los últimos datos
    $sql = "SELECT mensaje, led_color, fecha FROM tb_puerto_serial ORDER BY id_puerto_serial DESC LIMIT 100";
    $stmt = $pdo->query($sql);

    $data = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }

    // Enviar datos en formato JSON
    echo json_encode($data);

} catch (PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}
