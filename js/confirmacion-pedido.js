document.addEventListener('DOMContentLoaded', function () {
    // Recuperar datos de la factura desde sessionStorage
    const facturaData = JSON.parse(sessionStorage.getItem('facturaData')) || {
        numero: '--',
        fecha: '--',
        cliente: {
            nombre: '--',
            direccion: '--',
            telefono: '--'
        },
        resumen: {
            total: 0
        }
    };

    // Mostrar datos del pedido
    document.getElementById('order-number').textContent = facturaData.numero;
    document.getElementById('invoice-number').textContent = facturaData.numero;
    document.getElementById('order-date').textContent = facturaData.fecha;
    document.getElementById('order-total').textContent = formatCurrency(facturaData.resumen.total);

    // Mostrar información de entrega
    document.getElementById('recipient-name').textContent = facturaData.cliente.nombre;
    document.getElementById('delivery-address').textContent = facturaData.cliente.direccion;
    document.getElementById('delivery-phone').textContent = facturaData.cliente.telefono;

    // Evento para el botón "Ver factura"
    document.getElementById('view-invoice').addEventListener('click', function () {
        window.location.href = 'detalles-factura.html';
    });

    // Evento para el botón "Continuar comprando"
    document.getElementById('continue-shopping').addEventListener('click', function () {
        window.location.href = '../index.html';
    });

    // Función para formatear valores como moneda (COP)
    function formatCurrency(value) {
        return '$' + value.toLocaleString('es-CO');
    }
});