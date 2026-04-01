const selectVehiculo = document.getElementById("vehiculo");
const inputCantidadPedidos = document.getElementById("cantidadPedidos");
const botonGenerarPedidos = document.getElementById("generarPedidos");
const contenedorPedidos = document.getElementById("contenedorPedidos");
const botonCalcularRecorrido = document.getElementById("calcularRecorrido");
const resultado = document.getElementById("resultado");

let vehiculos = [];
let entregasGuardadas = JSON.parse(localStorage.getItem("entregas")) || [];

class Entrega {
    constructor(vehiculo, pedidos, kilometros) {
        this.vehiculo = vehiculo;
        this.pedidos = pedidos;
        this.kilometros = kilometros;
    }

    mostrarResumen() {
        return `
            <p><strong>Vehículo:</strong> ${this.vehiculo}</p>
            <p><strong>Cantidad de pedidos:</strong> ${this.pedidos}</p>
            <p><strong>Kilómetros totales:</strong> ${this.kilometros} km</p>
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

        selectVehiculo.innerHTML = '<option value="">Seleccionar</option>';

        vehiculos.forEach(function (vehiculo) {
            const option = document.createElement("option");
            option.value = vehiculo.id;
            option.textContent = vehiculo.nombre;
            selectVehiculo.appendChild(option);
        });
    } catch (error) {
        resultado.innerHTML = "<p>Error al cargar los vehículos.</p>";
    }
}

function generarInputsPedidos() {
    const cantidadPedidos = parseInt(inputCantidadPedidos.value);

    contenedorPedidos.innerHTML = "";

    if (isNaN(cantidadPedidos) || cantidadPedidos <= 0) {
        resultado.innerHTML = "<p>Ingresá una cantidad válida de pedidos.</p>";
        return;
    }

    for (let i = 1; i <= cantidadPedidos; i++) {
        const inputKm = document.createElement("input");
        inputKm.type = "number";
        inputKm.min = "1";
        inputKm.step = "0.1";
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

function guardarEntrega(entrega) {
    entregasGuardadas.push(entrega);
    localStorage.setItem("entregas", JSON.stringify(entregasGuardadas));
}

function calcularRecorrido() {
    const vehiculoElegido = selectVehiculo.value;
    const cantidadPedidos = parseInt(inputCantidadPedidos.value);
    const inputsKm = document.querySelectorAll(".inputKm");

    const vehiculoValido = vehiculos.some(function (vehiculo) {
        return vehiculo.id === vehiculoElegido;
    });

    if (!vehiculoValido) {
        resultado.innerHTML = "<p>Elegí un vehículo válido.</p>";
        return;
    }

    if (isNaN(cantidadPedidos) || cantidadPedidos <= 0) {
        resultado.innerHTML = "<p>Ingresá una cantidad válida de pedidos.</p>";
        return;
    }

    if (inputsKm.length !== cantidadPedidos) {
        resultado.innerHTML = "<p>Primero generá los pedidos.</p>";
        return;
    }

    const kilometrosTotales = calcularKilometrosTotales(inputsKm);

    if (kilometrosTotales === null) {
        resultado.innerHTML = "<p>Ingresá kilómetros válidos en todos los pedidos.</p>";
        return;
    }

    const entrega = new Entrega(vehiculoElegido, cantidadPedidos, kilometrosTotales);

    resultado.innerHTML = entrega.mostrarResumen();
    guardarEntrega(entrega);
}

botonGenerarPedidos.addEventListener("click", generarInputsPedidos);
botonCalcularRecorrido.addEventListener("click", calcularRecorrido);

cargarVehiculos();