// INICIO DEL SIMULADOR

alert("Bienvenido al simulador de entregas");
console.log("Simulador iniciado");

// VARIABLES, CONSTANTES Y ARRAY

const vehiculos = ["moto", "auto", "camioneta"];
const precioCombustible = 1200;

let vehiculoElegido;
let cantidadPedidos;
let kilometrosTotales = 0;

// FUNCIONES

function elegirVehiculo() {
    let opcionValida = false;
    while (!opcionValida) {
        vehiculoElegido = prompt(
            "Elegí el vehículo para repartir:\n\n1 - Moto\n2 - Auto\n3 - Camioneta"
        );
        if (vehiculoElegido == "1") {
            vehiculoElegido = "moto";
            opcionValida = true;
        } 
        else if (vehiculoElegido == "2") {
            vehiculoElegido = "auto";
            opcionValida = true;
        } 
        else if (vehiculoElegido == "3") {
            vehiculoElegido = "camioneta";
            opcionValida = true;
        } 
        else {
            alert("Opción inválida. Elegí 1, 2 o 3.");
        }
    }
    console.log("Vehículo elegido:", vehiculoElegido);
}

function cargarPedidos() {
    cantidadPedidos = parseInt(prompt("¿Cuántos pedidos vas a entregar?"));
while (isNaN(cantidadPedidos) || cantidadPedidos <= 0) {
    cantidadPedidos = parseInt(prompt("Ingresá un número válido de pedidos"));}
    kilometrosTotales = 0;
    for (let i = 1; i <= cantidadPedidos; i++) {
    let km = parseFloat(prompt("Ingresá los kilómetros del pedido " + i));
while (isNaN(km) || km <= 0) {
    km = parseFloat(prompt("Ingresá kilómetros válidos para el pedido " + i));
}
        kilometrosTotales = kilometrosTotales + km;
        console.log("Pedido", i, "-", km, "km");
    }
    console.log("Kilómetros totales:", kilometrosTotales);
}

function mostrarResultados() {
    let mensaje =
        "RESULTADO DEL SIMULADOR\n\n" +
        "Vehículo: " + vehiculoElegido + "\n" +
        "Cantidad de pedidos: " + cantidadPedidos + "\n" +
        "Kilómetros totales: " + kilometrosTotales + " km";
    alert(mensaje);
    console.log("RESULTADO FINAL");
    console.log("Vehículo:", vehiculoElegido);
    console.log("Pedidos:", cantidadPedidos);
    console.log("Kilómetros totales:", kilometrosTotales);
}

// EJECUCIÓN DEL SIMULADOR

if (confirm("¿Querés iniciar el simulador de entregas?")) {
    elegirVehiculo();
    cargarPedidos();
    mostrarResultados();
} else {
    alert("Simulador cancelado");
    console.log("El usuario canceló el simulador");
}