document.addEventListener('DOMContentLoaded', function() {
    // Simular datos del pedido (normalmente vendrían de la base de datos)
    const pedidoData = {
        subtotal: 85000,
        impuestos: 16150, // 19% del subtotal
        envio: 0,         // Gratis
        total: 101150     // Subtotal + impuestos + envío
    };

    // Mostrar los valores del resumen
    document.getElementById('subtotal').textContent = formatCurrency(pedidoData.subtotal);
    document.getElementById('impuestos').textContent = formatCurrency(pedidoData.impuestos);
    document.getElementById('total').textContent = formatCurrency(pedidoData.total);

    // Variables para controlar el método de pago seleccionado
    let selectedPaymentMethod = null;
    const continueBtn = document.getElementById('continue-btn');
    
    // Evento para todas las tarjetas de opciones de pago
    const paymentOptions = document.querySelectorAll('.option-card');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-payment-method');
            selectPaymentMethod(method);
            
            // Remover clase "selected" de todas las opciones
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Agregar clase "selected" solo a la opción elegida
            this.classList.add('selected');
            
            // Habilitar el botón Continuar
            continueBtn.removeAttribute('disabled');
        });
    });

    // Función para seleccionar un método de pago
    function selectPaymentMethod(method) {
        selectedPaymentMethod = method;
        
        // Ocultar todos los formularios
        document.querySelectorAll('.payment-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // Mostrar el formulario correspondiente
        const formId = `${method}-form`;
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'block';
            form.classList.add('show');
        }
    }

    // Evento para el botón continuar
    continueBtn.addEventListener('click', function() {
        if (!selectedPaymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }
        
        // Validar dependiendo del método de pago seleccionado
        let isValid = true;
        let paymentDetails = {};
        
        switch (selectedPaymentMethod) {
            case 'tarjeta':
                const cardNumber = document.getElementById('card-number').value;
                const expiryDate = document.getElementById('expiry-date').value;
                const cvv = document.getElementById('cvv').value;
                const cardName = document.getElementById('card-name').value;
                
                if (!cardNumber || !expiryDate || !cvv || !cardName) {
                    alert('Por favor completa todos los campos de la tarjeta');
                    isValid = false;
                } else {
                    paymentDetails = {
                        tipo: 'tarjeta',
                        numeroTarjeta: cardNumber.replace(/\s/g, ''),
                        fechaExpiracion: expiryDate,
                        cvv: cvv,
                        nombreTitular: cardName
                    };
                }
                break;
                
            case 'pse':
                const bank = document.getElementById('bank-select').value;
                const docType = document.getElementById('doc-type').value;
                const docNumber = document.getElementById('doc-number').value;
                
                if (!bank || !docType || !docNumber) {
                    alert('Por favor completa todos los campos para PSE');
                    isValid = false;
                } else {
                    paymentDetails = {
                        tipo: 'pse',
                        banco: bank,
                        tipoDocumento: docType,
                        numeroDocumento: docNumber
                    };
                }
                break;
                
            case 'efectivo':
                paymentDetails = {
                    tipo: 'efectivo'
                };
                break;
                
            case 'nequi':
                const phoneNumber = document.getElementById('phone-number').value;
                
                if (!phoneNumber) {
                    alert('Por favor ingresa tu número de celular para Nequi');
                    isValid = false;
                } else {
                    paymentDetails = {
                        tipo: 'nequi',
                        numeroCelular: phoneNumber.replace(/\s/g, '')
                    };
                }
                break;
        }
        
        if (isValid) {
            // Guardar los detalles del método de pago en sessionStorage para usarlos en la siguiente pantalla
            sessionStorage.setItem('paymentMethod', JSON.stringify(paymentDetails));
            sessionStorage.setItem('pedidoData', JSON.stringify(pedidoData));
            
            // Redirigir a la página de detalles de factura
            window.location.href = 'detalles-factura.html';
        }
    });

    // Función para formatear valores como moneda (COP)
    function formatCurrency(value) {
        return '$' + value.toLocaleString('es-CO');
    }

    // Validación y formato para el número de tarjeta
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value.substring(0, 19); // Limitar a 16 dígitos (19 con espacios)
        });
    }

    // Validación y formato para la fecha de expiración
    const expiryDateInput = document.getElementById('expiry-date');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5); // Formato MM/AA
        });
    }

    // Validación para CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    // Validación para número de teléfono
    const phoneInput = document.getElementById('phone-number');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3 && value.length <= 6) {
                value = value.substring(0, 3) + ' ' + value.substring(3);
            } else if (value.length > 6) {
                value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
            }
            e.target.value = value.substring(0, 12); // 10 dígitos + 2 espacios
        });
    }
});