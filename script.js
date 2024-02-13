$(document).ready(function () {
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    type: "line", // Tipo de gráfica
    data: {
      labels: [], // Las etiquetas de tiempo
      datasets: [
        {
          label: "Sensor Distancia",
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Color inicial de fondo
          borderColor: "rgba(255, 99, 132, 1)", // Color inicial de borde
          data: [], // Los datos del sensor
        },
      ],
    },
    options: {},
  });

  var ctr = document.getElementById("myChartdos").getContext("2d");
  var chartdos = new Chart(ctr, {
    type: "bar", // Tipo de gráfica
    data: {
      labels: [], // Las etiquetas de tiempo
      datasets: [
        {
          label: "Sensor Luz",
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Color inicial de fondo
          borderColor: "rgba(255, 99, 132, 1)", // Color inicial de borde
          data: [], // Los datos del sensor
        },
      ],
    },
    options: {},
  });

  var verde = document.getElementById("verde");
  var rojo = document.getElementById("rojo");
  var amarillo = document.getElementById("amarillo");
  rojo.src = "./led/ROJO OFF.png";
  amarillo.src = "./led/AMARILLO OFF.png";
  verde.src = "./led/VERDE OFF.png";

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
        const dataLed = parsedData.tb_puerto_serial;
        const ultimoColorLed = parsedData.tb_puerto_serial[0].led_color;
        const dataLuz = parsedData.tb_puerto_serial2;
        var fecha = [];
        var valor = [];
        var backColors = [];

        if (ultimoColorLed == "verde") {
          rojo.src = "./led/ROJO OFF.png";
          amarillo.src = "./led/AMARILLO OFF.png";
          verde.src = "./led/VERDE ON.png";
          verde.style.boxShadow = "0 0 20px 2px rgb(0, 255, 51)";
          amarillo.style.boxShadow = "none";
          rojo.style.boxShadow = "none";
        } else if (ultimoColorLed == "rojo") {
          rojo.src = "./led/ROJO ON.png";
          amarillo.src = "./led/AMARILLO OFF.png";
          verde.src = "./led/VERDE OFF.png";
          verde.style.boxShadow = "none";
          amarillo.style.boxShadow = "none";
          rojo.style.boxShadow = "0 0 20px 2px rgb(255, 0, 0)";
        } else {
          rojo.src = "./led/ROJO OFF.png";
          amarillo.src = "./led/AMARILLO ON.png";
          verde.src = "./led/VERDE OFF.png";
          verde.style.boxShadow = "none";
          amarillo.style.boxShadow = " 0 0 20px 2px rgb(255, 238, 0)";
          rojo.style.boxShadow = "none";
        }

        dataLed.forEach(function (row) {
          labels.push(row.fecha);
          sensorData.push(row.mensaje);
          console.log(row.led_color);

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
        dataLuz.forEach((luz) => {
          fecha.push(luz.fecha);
          valor.push(luz.valor);
          /*     backColors.push("rgba(84, 119, 229  )"); // Color por defecto */
          switch (luz.mensaje) {
            case "poca luz":
              backColors.push("rgba(220, 140, 32   )");
              break;
            case "mucha luz":
              backColors.push("rgba(220, 214, 32  )");
              break;
            case "no hay luz":
              backColors.push("rgba(26, 49, 118  )");
              break;
            default:
              backColors.push("rgba(84, 119, 229 )"); // Color por defecto
          }
        });

        // Actualizar la gráfica 2 con los nuevos datos y colores
        chartdos.data.labels = fecha;
        chartdos.data.datasets[0].data = valor;
        chartdos.data.datasets[0].backgroundColor = backColors; // Usar el color de fondo único

        chartdos.update();

        // Actualizar la gráfica 1 con los nuevos datos y colores
        chart.data.labels = labels;
        chart.data.datasets[0].data = sensorData;
        chart.data.datasets[0].backgroundColor = backgroundColors; // Usar el color de fondo único
        chart.data.datasets[0].borderColor = borderColors; // Usar el color de borde único
        chart.update();
      },
    });
  }

  // Actualizar la gráfica cada cierto tiempo, por ejemplo, cada 5 segundos
  setInterval(function () {
    fetchData(); // Actualizar la gráfica de datos
  }, 1000); // Cambiado a 5000 para actualizar cada 5 segundos
});
