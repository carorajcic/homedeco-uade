const PRODUCTOS = {
    decoracion: [
        { id: 'deco1', nombre: 'Espejo redondo', precio: 15000, categoria: 'decoracion', tipo: 'Espejo' },
        { id: 'deco2', nombre: 'Cuadro moderno', precio: 12000, categoria: 'decoracion', tipo: 'Cuadro' },
        { id: 'deco3', nombre: 'Alfombra nórdica 2x3m', precio: 25000, categoria: 'decoracion', tipo: 'Alfombra' },
        { id: 'deco4', nombre: 'Set 3 Almohadones Lino', precio: 8500, categoria: 'decoracion', tipo: 'Textil' },
        { id: 'deco5', nombre: 'Jarrón Cerámica Grande', precio: 9800, categoria: 'decoracion', tipo: 'Accesorio' }
    ],
    muebles: [
        { id: 'mue1', nombre: 'Mesita de roble', precio: 45000, categoria: 'muebles', tipo: 'Mesa' },
        { id: 'mue2', nombre: 'Silla tapizada', precio: 28000, categoria: 'muebles', tipo: 'Silla' },
        { id: 'mue3', nombre: 'Biblioteca escandinava', precio: 52000, categoria: 'muebles', tipo: 'Estantería' },
        { id: 'mue4', nombre: 'Mesita de luz vintage', precio: 18000, categoria: 'muebles', tipo: 'Mesa' },
        { id: 'mue5', nombre: 'Rack para TV 1.80m', precio: 38000, categoria: 'muebles', tipo: 'Rack' }
    ],
    iluminacion: [
        { id: 'ilu1', nombre: 'Lámpara colgante', precio: 22000, categoria: 'iluminacion', tipo: 'Colgante' },
        { id: 'ilu2', nombre: 'Lámpara de pie', precio: 19500, categoria: 'iluminacion', tipo: 'Pie' },
        { id: 'ilu3', nombre: 'Aplique de Pared LED', precio: 11000, categoria: 'iluminacion', tipo: 'Aplique' },
        { id: 'ilu4', nombre: 'Velador', precio: 8900, categoria: 'iluminacion', tipo: 'Velador' }
    ]
};

let carrito = [];

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(precio);
}


function renderizarProductos() {
    // Decoración
    const decoracionContainer = document.getElementById('productos-decoracion');
    PRODUCTOS.decoracion.forEach(producto => {
        decoracionContainer.appendChild(crearProductoHTML(producto));
    });

    // Muebles
    const mueblesContainer = document.getElementById('productos-muebles');
    PRODUCTOS.muebles.forEach(producto => {
        mueblesContainer.appendChild(crearProductoHTML(producto));
    });

    // Iluminación
    const iluminacionContainer = document.getElementById('productos-iluminacion');
    PRODUCTOS.iluminacion.forEach(producto => {
        iluminacionContainer.appendChild(crearProductoHTML(producto));
    });
}

function crearProductoHTML(producto) {
    const div = document.createElement('div');
    div.className = 'producto-item';
    div.innerHTML = `
        <div class="producto-info-cat">
            <h4>${producto.nombre}</h4>
            <p>Categoría: ${producto.categoria}</p>
        </div>
        <span class="producto-precio">${formatearPrecio(producto.precio)}</span>
        <button class="btn-agregar" onclick="agregarAlCarrito('${producto.id}')">
            Agregar al carrito
        </button>
    `;
    return div;
}


function agregarAlCarrito(productoId) {
    let producto = null;
    for (let categoria in PRODUCTOS) {
        producto = PRODUCTOS[categoria].find(p => p.id === productoId);
        if (producto) break;
    }

    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarrito();
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Agregado';
    btn.style.backgroundColor = 'var(--marron-claro)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
    }, 1000);
}

function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarrito();
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        carrito = [];
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const carritoItemsContainer = document.getElementById('carrito-items');
    const itemsCount = document.getElementById('items-count');
    
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    itemsCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

    carritoItemsContainer.innerHTML = '';

    if (carrito.length === 0) {
        carritoItemsContainer.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        document.getElementById('btn-vaciar').style.display = 'none';
        document.getElementById('btn-finalizar').style.display = 'none';
    } else {
        carrito.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'carrito-item';
            itemDiv.innerHTML = `
                <div class="carrito-item-info">
                    <h5>${item.nombre}</h5>
                    <p>Cantidad: ${item.cantidad} | ${formatearPrecio(item.precio)} c/u</p>
                </div>
                <span class="carrito-item-precio">${formatearPrecio(item.precio * item.cantidad)}</span>
                <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.id}')">✕</button>
            `;
            carritoItemsContainer.appendChild(itemDiv);
        });
        document.getElementById('btn-vaciar').style.display = 'block';
        document.getElementById('btn-finalizar').style.display = 'block';
    }

    calcularYMostrarTotales();
}


function calcularYMostrarTotales() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const promoDecoracion = calcularPromo2x1Decoracion();
    const promoMuebles = calcularPromo3x2Muebles();
    const promoMonto = calcularPromoMonto(subtotal);

    let mejorPromo = { nombre: 'Sin promoción', descuento: 0 };
    
    if (promoDecoracion.descuento > mejorPromo.descuento) {
        mejorPromo = promoDecoracion;
    }
    if (promoMuebles.descuento > mejorPromo.descuento) {
        mejorPromo = promoMuebles;
    }
    if (promoMonto.descuento > mejorPromo.descuento) {
        mejorPromo = promoMonto;
    }

    const total = subtotal - mejorPromo.descuento;

    document.getElementById('subtotal').textContent = formatearPrecio(subtotal);
    document.getElementById('total').innerHTML = `<strong>${formatearPrecio(total)}</strong>`;

    const promoAplicadaDiv = document.getElementById('promo-aplicada');
    if (mejorPromo.descuento > 0) {
        promoAplicadaDiv.style.display = 'flex';
        document.getElementById('promo-nombre').textContent = mejorPromo.nombre + ':';
        document.getElementById('promo-monto').textContent = '-' + formatearPrecio(mejorPromo.descuento);
    } else {
        promoAplicadaDiv.style.display = 'none';
    }
}

// Promoción 1: 2x1
function calcularPromo2x1Decoracion() {
    const productosDecoracion = carrito.filter(item => item.categoria === 'decoracion');
    
    const cantidadTotal = productosDecoracion.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (cantidadTotal < 2) {
        return { nombre: 'Sin promoción', descuento: 0 };
    }

    const productosExpandidos = [];
    productosDecoracion.forEach(item => {
        for (let i = 0; i < item.cantidad; i++) {
            productosExpandidos.push(item.precio);
        }
    });

    productosExpandidos.sort((a, b) => a - b);

    // Calcular descuentos
    let descuentoTotal = 0;
    for (let i = 0; i < Math.floor(productosExpandidos.length / 2); i++) {
        descuentoTotal += productosExpandidos[i] * 0.5;
    }

    return {
        nombre: '2x1 en Decoración (50% OFF)',
        descuento: descuentoTotal
    };
}

// Promoción 2: 3x2
function calcularPromo3x2Muebles() {
    const productosMuebles = carrito.filter(item => item.categoria === 'muebles');
    
    // Necesitamos al menos 3 muebles
    const cantidadTotal = productosMuebles.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (cantidadTotal < 3) {
        return { nombre: 'Sin promoción', descuento: 0 };
    }

    // Expandir productos según cantidad
    const productosExpandidos = [];
    productosMuebles.forEach(item => {
        for (let i = 0; i < item.cantidad; i++) {
            productosExpandidos.push(item.precio);
        }
    });

    // Ordenar de menor a mayor
    productosExpandidos.sort((a, b) => a - b);

    // Por cada grupo de 3, el más barato sale gratis
    let descuentoTotal = 0;
    const gruposDe3 = Math.floor(productosExpandidos.length / 3);
    for (let i = 0; i < gruposDe3; i++) {
        descuentoTotal += productosExpandidos[i];
    }

    return {
        nombre: '3x2 en Muebles',
        descuento: descuentoTotal
    };
}

// Promoción 3: 10% OFF
function calcularPromoMonto(subtotal) {
    const MONTO_MINIMO = 30000;
    const PORCENTAJE = 0.10;

    if (subtotal > MONTO_MINIMO) {
        return {
            nombre: '10% OFF (compra mayor a $30.000)',
            descuento: subtotal * PORCENTAJE
        };
    }

    return { nombre: 'Sin promoción', descuento: 0 };
}


function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = parseFloat(document.getElementById('total').textContent.replace(/[^0-9,]/g, '').replace(',', '.'));
    
    const mensaje = `¡Gracias por tu compra!\n\n` +
                   `Total de productos: ${carrito.reduce((sum, item) => sum + item.cantidad, 0)}\n` +
                   `Total: ${document.getElementById('total').textContent}\n\n` +
                   `En breve te contactaremos para coordinar el pago y envío.`;
    
    alert(mensaje);
    
    carrito = [];
    actualizarCarrito();
}


document.addEventListener('DOMContentLoaded', function() {
    // Renderizar productos
    renderizarProductos();

    // Botón vaciar carrito
    document.getElementById('btn-vaciar').addEventListener('click', vaciarCarrito);

    // Botón finalizar compra
    document.getElementById('btn-finalizar').addEventListener('click', finalizarCompra);

    console.log('Sistema de carrito DecoHome cargado correctamente');
});