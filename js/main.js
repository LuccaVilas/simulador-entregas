const selectVehiculo = document.getElementById("vehiculo");
const inputCantidadPedidos = document.getElementById("cantidadPedidos");
const inputPrecioCombustible = document.getElementById("precioCombustible");
const botonGenerarPedidos = document.getElementById("generarPedidos");
const contenedorPedidos = document.getElementById("contenedorPedidos");
const botonCalcularRecorrido = document.getElementById("calcularRecorrido");
const botonBorrarHistorial = document.getElementById("borrarHistorial");
const resultado = document.getElementById("resultado");
const historial = document.getElementById("historial");

let vehiculos = [];
let simulacionesGuardadas = JSON.parse(localStorage.getItem("simulaciones")) || [];

class Simulacion {
    constructor(vehiculo, cantidadPedidos, kilometrosTotales, litrosEstimados, costoCombustible) {
        this.vehiculo = vehiculo;
        this.cantidadPedidos = cantidadPedidos;
        this.kilometrosTotales = kilometrosTotales;
        this.litrosEstimados = litrosEstimados;
        this.costoCombustible = costoCombustible;
    }

    obtenerResumen() {
        return `
            <p><strong>Vehículo:</strong> ${this.vehiculo.nombre}</p>
            <p><strong>Cantidad de pedidos:</strong> ${this.cantidadPedidos}</p>
            <p><strong>Kilómetros totales:</strong> ${this.kilometrosTotales.toFixed(2)} km</p>
            <p><strong>Litros estimados:</strong> ${this.litrosEstimados.toFixed(2)} L</p>
            <p><strong>Costo estimado:</strong> $${this.costoCombustible.toFixed(2)}</p>
        `;
    }
}

async function cargarVehiculos() {
    try {
        const respuesta = await fetch("./data/vehiculos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }

        vehiculos = await respuesta.json();

        selectVehiculo.innerHTML = '<option value="">Seleccionar vehículo</option>';

        vehiculos.forEach(function (vehiculo) {
            const option = document.createElement("option");
            option.value = vehiculo.id;
            option.textContent = vehiculo.nombre + " - " + vehiculo.consumo + " km/L";
            selectVehiculo.appendChild(option);
        });
    } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los vehículos.", "error");
    }
}

function generarInputsPedidos() {
    const cantidadPedidos = parseInt(inputCantidadPedidos.value);

    contenedorPedidos.innerHTML = "";

    if (isNaN(cantidadPedidos) || cantidadPedidos <= 0) {
        Swal.fire("Dato inválido", "Ingresá una cantidad válida de pedidos.", "warning");
        return;
    }

    for (let i = 1; i <= cantidadPedidos; i++) {
        const inputKm = document.createElement("input");
        inputKm.type = "number";
        inputKm.min = "1";
        inputKm.step = "0.1";
        inputKm.value = "5";
        inputKm.placeholder = "Kilómetros del pedido " + i;
        inputKm.classList.add("inputKm");
        contenedorPedidos.appendChild(inputKm);
    }

    resultado.innerHTML = "<p>Ahora ingresá los kilómetros de cada pedido.</p>";
}

function calcularKilometrosTotales(inputsKm) {
    let kilometrosTotales = 0;

    for (const input of inputsKm) {
        const km = parseFloat(input.value);

        if (isNaN(km) || km <= 0) {
            return null;
        }

        kilometrosTotales += km;
    }

    return kilometrosTotales;
}

function buscarVehiculoPorId(idVehiculo) {
    return vehiculos.find(function (vehiculo) {
        return vehiculo.id === idVehiculo;
    });
}

function guardarSimulacion(simulacion) {
    simulacionesGuardadas.push(simulacion);
    localStorage.setItem("simulaciones", JSON.stringify(simulacionesGuardadas));
}

function mostrarHistorial() {
    historial.innerHTML = "";

    if (simulacionesGuardadas.length === 0) {
        historial.innerHTML = "<p>No hay simulaciones guardadas todavía.</p>";
        return;
    }

    simulacionesGuardadas.forEach(function (simulacion, index) {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjetaHistorial");

        tarjeta.innerHTML = `
            <h3>Simulación ${index + 1}</h3>
            <p><strong>Vehículo:</strong> ${simulacion.vehiculo.nombre}</p>
            <p><strong>Pedidos:</strong> ${simulacion.cantidadPedidos}</p>
            <p><strong>Kilómetros:</strong> ${simulacion.kilometrosTotales.toFixed(2)} km</p>
            <p><strong>Litros:</strong> ${simulacion.litrosEstimados.toFixed(2)} L</p>
            <p><strong>Costo:</strong> $${simulacion.costoCombustible.toFixed(2)}</p>
        `;

        historial.appendChild(tarjeta);
    });
}

function calcularRecorrido() {
    const vehiculoSeleccionado = buscarVehiculoPorId(selectVehiculo.value);
    const cantidadPedidos = parseInt(inputCantidadPedidos.value);
    const precioCombustible = parseFloat(inputPrecioCombustible.value);
    const inputsKm = document.querySelectorAll(".inputKm");

    if (!vehiculoSeleccionado) {
        Swal.fire("Falta vehículo", "Elegí un vehículo para continuar.", "warning");
        return;
    }

    if (isNaN(cantidadPedidos) || cantidadPedidos <= 0) {
        Swal.fire("Dato inválido", "Ingresá una cantidad válida de pedidos.", "warning");
        return;
    }

    if (isNaN(precioCombustible) || precioCombustible <= 0) {
        Swal.fire("Dato inválido", "Ingresá un precio válido de combustible.", "warning");
        return;
    }

    if (inputsKm.length !== cantidadPedidos) {
        Swal.fire("Faltan pedidos", "Primero generá los pedidos.", "warning");
        return;
    }

    const kilometrosTotales = calcularKilometrosTotales(inputsKm);

    if (kilometrosTotales === null) {
        Swal.fire("Dato inválido", "Ingresá kilómetros válidos en todos los pedidos.", "warning");
        return;
    }

    const litrosEstimados = kilometrosTotales / vehiculoSeleccionado.consumo;
    const costoCombustible = litrosEstimados * precioCombustible;

    const simulacion = new Simulacion(
        vehiculoSeleccionado,
        cantidadPedidos,
        kilometrosTotales,
        litrosEstimados,
        costoCombustible
    );

    resultado.innerHTML = simulacion.obtenerResumen();
    guardarSimulacion(simulacion);
    mostrarHistorial();

    Swal.fire("Simulación guardada", "El recorrido fue calculado correctamente.", "success");
}

function borrarHistorial() {
    simulacionesGuardadas = [];
    localStorage.removeItem("simulaciones");
    mostrarHistorial();
    resultado.innerHTML = "<p>Completá los datos para ver el resultado.</p>";

    Swal.fire("Historial eliminado", "Se borraron todas las simulaciones.", "success");
}

botonGenerarPedidos.addEventListener("click", generarInputsPedidos);
botonCalcularRecorrido.addEventListener("click", calcularRecorrido);
botonBorrarHistorial.addEventListener("click", borrarHistorial);

cargarVehiculos();
mostrarHistorial();