# 📊 Diccionario de Indicadores y Datos (KPIs) - Grafógrafo

Este documento detalla la lógica técnica de los indicadores visualizados en el dashboard del sistema Grafógrafo.

---

## 1. Indicadores de Desempeño (KPIs)

| Nombre del Indicador | Definición | Fórmula / Lógica | Fuente de Datos | Impacto en la Decisión |
| :--- | :--- | :--- | :--- | :--- |
| **Ventas Totales** | Ingresos brutos confirmados en el periodo. | `Sumatoria(Ventas.Monto)` | Hoja `Ventas` | Evaluar cumplimiento de metas financieras. |
| **Ticket Promedio** | Monto medio gastado por transacción. | `Ventas Totales / Conteo transacciones` | Hoja `Ventas` | Ajustar estrategias de precios y combos. |
| **Stock Crítico** | Alerta de productos con existencias mínimas. | `Conteo(Productos donde stock <= 5)` | Hoja `Inventario` | Gestionar pedidos a proveedores proactivamente. |
| **Saldo Pendiente** | Capital retenido en cuentas de clientes. | `Sumatoria(CuentasPendientes.MontoRestante)` | Hoja `Cuentas Pendientes` | Priorizar gestión de cobro y flujo de efectivo. |
| **Distribución por Categoría** | Mix de ventas Cafetería vs Librería. | `(Ventas[Cat] / Ventas Totales) * 100` | Hoja `Ventas` | Definir inversión en inventario por área. |

---

## 2. Diccionario de Datos (Estructura Técnica)

### Hoja: Inventario
*   **ID:** Identificador único del producto.
*   **Nombre:** Nombre comercial del libro o producto.
*   **Categoría:** Clasificación (Librería, Cafetería, Otros).
*   **Precio:** Precio de venta al público.
*   **Stock:** Cantidad actual en almacén (unidades).
*   **Icono:** Identificador visual de la categoría.

### Hoja: Ventas
*   **ID:** Referencia única de la transacción.
*   **Timestamp:** Fecha y hora completa (`America/Mexico_City`).
*   **Producto:** Nombre del ítem vendido.
*   **Monto:** Valor monetario de la línea de venta.
*   **Cantidad:** Unidades vendidas.
*   **Método Pago:** Efectivo, Tarjeta, Transferencia o Pendiente.
*   **Usuario:** Empleado que registró la venta.

### Hoja: Cuentas Pendientes
*   **ID:** Referencia de la cuenta.
*   **Cliente:** Nombre del deudor.
*   **CreatedAt:** Fecha de apertura.
*   **UpdatedAt:** Último movimiento registrado.
*   **Items:** JSON con el desglose de productos consumidos.
*   **Payments:** JSON con el historial de abonos realizados.
*   **Status:** Estado actual (Abierta / Cerrada).

### Hoja: Movimientos
*   **Timestamp:** Fecha/Hora del ajuste.
*   **ProductoID:** Referencia al inventario.
*   **Tipo:** Entrada, Salida (Venta) o Ajuste Manual.
*   **Cantidad:** Variación (+/-).
*   **StockResult:** Resultado final tras el movimiento.
*   **Usuario:** Responsable del ajuste.
