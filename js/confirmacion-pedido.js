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

    // Generar un número de pedido único basado en la fecha y un identificador aleatorio
    const orderNumber = generateOrderNumber();

    // Mostrar datos del pedido
    document.getElementById('order-number').textContent = orderNumber;
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

    // Función para generar un número de pedido único
    function generateOrderNumber() {
        const prefix = 'ORD';
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        return `${prefix}-${year}${month}${day}-${random}`;
    }

    // Función para formatear valores como moneda (COP)
    function formatCurrency(value) {
        return '$' + value.toLocaleString('es-CO');
    }
});