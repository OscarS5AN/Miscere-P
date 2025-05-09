document.addEventListener('DOMContentLoaded', function() {
    // Recuperar datos del pedido y método de pago de sessionStorage
    const pedidoData = JSON.parse(sessionStorage.getItem('pedidoData')) || {
        subtotal: 85000,
        impuestos: 16150,
        envio: 0,
        total: 101150
    };
    
    const paymentMethod = JSON.parse(sessionStorage.getItem('paymentMethod')) || {
        tipo: 'tarjeta'
    };
    
    // Simulación de datos del cliente y pedido (normalmente vendrían de la base de datos)
    const clienteData = {
        nombre: 'Juan Carlos Pérez',
        documento: 'CC 1234567890',
        direccion: 'Calle 45 # 23-67, Cali, Valle del Cauca',
        telefono: '301 234 5678'
    };
    
    const productosData = [
        { nombre: 'Papel Bond carta (resma)', cantidad: 2, precio: 15000, subtotal: 30000 },
        { nombre: 'Cuaderno argollado grande', cantidad: 3, precio: 12000, subtotal: 36000 },
        { nombre: 'Bolígrafos x12', cantidad: 1, precio: 19000, subtotal: 19000 }
    ];
    
    // Generar número de factura
    const invoiceNumber = generateInvoiceNumber();
    const currentDate = new Date().toLocaleDateString('es-CO');
    
    // Mostrar información en la factura
    document.getElementById('invoice-number').textContent = invoiceNumber;
    document.getElementById('invoice-date').textContent = currentDate;
    
    document.getElementById('customer-name').textContent = clienteData.nombre;
    document.getElementById('customer-document').textContent = clienteData.documento;
    document.getElementById('customer-address').textContent = clienteData.direccion;
    document.getElementById('customer-phone').textContent = clienteData.telefono;
    
    // Mostrar los valores del resumen
    document.getElementById('subtotal').textContent = formatCurrency(pedidoData.subtotal);
    document.getElementById('impuestos').textContent = formatCurrency(pedidoData.impuestos);
    document.getElementById('total').textContent = formatCurrency(pedidoData.total);
    
    // Cargar los productos
    const orderItemsContainer = document.getElementById('order-items');
    productosData.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `        
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>${formatCurrency(producto.precio)}</td>
            <td>${formatCurrency(producto.subtotal)}</td>
        `;
        orderItemsContainer.appendChild(row);
    });
    
    // Mostrar detalles del método de pago
    const paymentMethodDetails = document.getElementById('payment-method-details');
    renderPaymentMethodDetails(paymentMethod, paymentMethodDetails);
    
    // Evento para continuar al siguiente paso
    document.getElementById('continue-btn').addEventListener('click', function() {
        // Guardar datos de la factura en sessionStorage
        const facturaData = {
            numero: invoiceNumber,
            fecha: currentDate,
            cliente: clienteData,
            productos: productosData,
            resumen: pedidoData,
            metodoPago: paymentMethod
        };
        
        sessionStorage.setItem('facturaData', JSON.stringify(facturaData));
        
        // Redirigir a la página de confirmación
        window.location.href = 'confirmacion-pedido.html';
    });
    
    // Función para formatear valores como moneda (COP)
    function formatCurrency(value) {
        return '$' + value.toLocaleString('es-CO');
    }
    
    // Función para generar número de factura (simulación)
    function generateInvoiceNumber() {
        const prefix = 'MISC';
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        return `${prefix}-${year}${month}-${random}`;
    }
    
    // Función para renderizar los detalles del método de pago
    function renderPaymentMethodDetails(method, container) {
        let detailsHTML = '';
        
        switch (method.tipo) {
            case 'tarjeta':
                const lastFour = method.numeroTarjeta ? method.numeroTarjeta.slice(-4) : '****';
                detailsHTML = `
                    <div class="payment-detail">
                        <span class="payment-detail-label">Tipo:</span>
                        <span>Tarjeta de Crédito/Débito</span>
                    </div>
                    <div class="payment-detail">
                        <span class="payment-detail-label">Número:</span>
                        <span>**** **** **** ${lastFour}</span>
                    </div>
                    <div class="payment-detail">
                        <span class="payment-detail-label">Titular:</span>
                        <span>${method.nombreTitular || 'No especificado'}</span>
                    </div>
                `;
                break;
                
            case 'pse':
                detailsHTML = `
                    <div class="payment-detail">
                        <span class="payment-detail-label">Tipo:</span>
                        <span>Transferencia PSE</span>
                    </div>
                    <div class="payment-detail">
                        <span class="payment-detail-label">Banco:</span>
                        <span>${getBankName(method.banco)}</span>
                    </div>
                `;
                break;
                
            case 'efectivo':
                detailsHTML = `
                    <div class="payment-detail">
                        <span class="payment-detail-label">Tipo:</span>
                        <span>Pago en efectivo</span>
                    </div>
                    <div class="payment-detail">
                        <span class="payment-detail-label">Código de pago:</span>
                        <span>${generatePaymentCode()}</span>
                    </div>
                    <div class="payment-detail">
                        <span class="payment-detail-label">Validez:</span>
                        <span>48 horas</span>
                    </div>
                `;
                break;
                
            case 'nequi':
                detailsHTML = `
                    <div class="payment-detail">
                        <span class="payment-detail-label">Tipo:</span>
                        <span>Pago con Nequi</span>
                    </div>
                    <div class="payment-detail">
                        <span class="payment-detail-label">Número:</span>
                        <span>${method.numeroCelular || 'No especificado'}</span>
                    </div>
                    <div class="payment-detail">
                        <span class="payment-detail-label">Estado:</span>
                        <span>Pendiente de confirmación</span>
                    </div>
                `;
                break;
                
            default:
                detailsHTML = `
                    <div class="payment-detail">
                        <span>Método de pago no especificado</span>
                    </div>
                `;
        }
        
        container.innerHTML = detailsHTML;
    }
    
    // Función para obtener el nombre del banco según su código
    function getBankName(bankCode) {
        const banks = {
            'bancolombia': 'Bancolombia',
            'davivienda': 'Davivienda',
            'bbva': 'BBVA Colombia',
            'bancodebogota': 'Banco de Bogotá',
            'colpatria': 'Scotiabank Colpatria'
        };
        
        return banks[bankCode] || 'Banco no especificado';
    }
    
    // Función para generar código de pago (simulación)
    function generatePaymentCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
});
