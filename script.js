$(document).ready(function () {
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    type: "line", // Tipo de gráfica
    data: {
      labels: [], // Las etiquetas de tiempo
      datasets: [
        {
          label: "Sensor Data",
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Color inicial de fondo
          borderColor: "rgba(255, 99, 132, 1)", // Color inicial de borde
          data: [], // Los datos del sensor
        },
      ],
    },
    options: {},
  });

  // Función para actualizar la gráfica
  function fetchData() {
    $.ajax({
      url: "http://localhost:3000/ultrasonico-UT-2024/conexion.php",
      type: "GET",
      success: function (data) {
        var parsedData = JSON.parse(data);
        var labels = [];
        var sensorData = [];
        var backgroundColors = [];
        var borderColors = [];

        parsedData.forEach(function (row) {
          labels.push(row.fecha);
          sensorData.push(row.mensaje);

          // Determinar los colores basados en el color del LED
          switch (row.led_color) {
            case "rojo":
              backgroundColors.push(" rgba(255, 99, 132, 1)");
              borderColors.push("rgba(255, 99, 132, 1)");
              break;
            case "amarillo":
              backgroundColors.push("rgba(255, 206, 86, 0.2)");
              borderColors.push("rgba(255, 206, 86, 1)");
              break;
            case "verde":
              backgroundColors.push("rgba(75, 192, 192, 0.2)");
              borderColors.push("rgba(75, 192, 192, 1)");
              break;
            default:
              backgroundColors.push("rgba(201, 203, 207, 0.2)"); // Color por defecto
              borderColors.push("rgba(201, 203, 207, 1)");
          }
        });

        // Actualizar la gráfica con los nuevos datos y colores
        chart.data.labels = labels;
        chart.data.datasets[0].data = sensorData;
        chart.data.datasets[0].backgroundColor = backgroundColors;
        chart.data.datasets[0].borderColor = borderColors;
        chart.update();
      },
    });
  }

  // Actualizar la gráfica cada cierto tiempo, por ejemplo, cada 5 segundos
  setInterval(function () {
    fetchData(); // Actualizar la gráfica de datos
  }, 1000); // Cambiado a 5000 para actualizar cada 5 segundos
});
