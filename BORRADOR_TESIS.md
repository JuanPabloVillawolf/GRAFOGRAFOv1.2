# BORRADOR DE TESIS: TRANSFORMACIÓN DIGITAL LIBRERÍA-CAFETERÍA

## 1. TÍTULO DEL PROYECTO
**Propuesta de dashboard para la visualización de indicadores de ventas e inventario en una librería-cafetería mediante una aplicación web**

---

## 2. RESUMEN
En la actualidad, las organizaciones generan grandes volúmenes de datos que requieren ser analizados de manera eficiente para apoyar la toma de decisiones. Sin embargo, la falta de herramientas adecuadas para la visualización de la información dificulta la interpretación de los datos y limita su aprovechamiento estratégico (Few, 2013). En el contexto de las pequeñas empresas locales, como las librerías-cafeterías, la gestión suele realizarse mediante procesos manuales, lo que genera una carencia de registros históricos y una nula visibilidad sobre el rendimiento real del negocio.

En este contexto, el presente proyecto tiene como objetivo diseñar una propuesta de dashboard para la visualización de indicadores de ventas e inventario, aplicada a una librería-cafetería, con el fin de facilitar el análisis de la información y apoyar la toma de decisiones. El proyecto se desarrolla bajo un enfoque aplicado, integrando conceptos de visualización de datos, indicadores clave de desempeño y proyectos de innovación, utilizando Google Sheets como motor de base de datos para garantizar una solución de bajo costo y alta accesibilidad (Eckerson, 2010).

Como resultado esperado, se plantea un dashboard funcional integrado en una aplicación web que permita presentar información clara, resumida y relevante sobre el flujo de caja, existencias y tendencias de consumo. Esta herramienta contribuirá directamente a mejorar el análisis operativo y la eficiencia en la toma de decisiones estratégicas para el crecimiento del establecimiento.

---

## 3. INTRODUCCIÓN
En un entorno organizacional cada vez más orientado al uso de datos, la capacidad para transformar información en conocimiento útil se ha convertido en un factor clave para la competitividad. No obstante, el crecimiento en la cantidad de datos disponibles no siempre se traduce en una mejor toma de decisiones, especialmente cuando la información no se presenta de forma clara y comprensible. Según Ackoff (1989), la transición de datos crudos a información con significado es el primer paso crítico para generar conocimiento accionable dentro de cualquier sistema de gestión.

La visualización de información surge como una estrategia que permite sintetizar datos complejos y facilitar su análisis mediante representaciones gráficas. Entre las herramientas más utilizadas para este fin se encuentran los dashboards, los cuales integran indicadores clave (KPIs) y permiten monitorear el desempeño de procesos u organizaciones de manera inmediata. De acuerdo con Tufte (2001), una visualización efectiva debe comunicar ideas complejas con claridad, precisión y eficiencia, permitiendo al usuario identificar patrones que de otro modo permanecerían ocultos en tablas de datos extensas.

En este sentido, el presente proyecto propone el diseño de un dashboard enfocado en la visualización de indicadores de ventas e inventario, aplicado a una librería-cafetería local, como una solución innovadora que contribuya a mejorar la interpretación de los datos y fortalecer la toma de decisiones. La propuesta busca resolver la problemática de la gestión manual mediante una aplicación web que centraliza la operación y ofrece una interfaz visual estratégica para la administración del negocio.

---

## CAPÍTULO I. GENERALIDADES DEL PROYECTO

### 1.1 Antecedentes
Diversos autores señalan que la visualización de datos permite mejorar la comprensión de la información y apoyar la toma de decisiones en las organizaciones (Few, 2006). En particular, los dashboards se han consolidado como herramientas clave dentro de la inteligencia de negocios, al integrar indicadores relevantes en una sola interfaz visual que permite el monitoreo en tiempo real (Eckerson, 2010). Esta capacidad de síntesis es fundamental en negocios con inventarios mixtos y flujos de venta constantes.

En distintos sectores, la implementación de dashboards ha permitido optimizar procesos, reducir tiempos de análisis y mejorar la eficiencia organizacional mediante la democratización del acceso a la información (Power, 2008). No obstante, muchas organizaciones de pequeña escala aún presentan limitaciones significativas en la forma en que gestionan y presentan su información, dependiendo de métodos tradicionales que no permiten un análisis prospectivo.

En el caso de la Librería-Cafetería Grafógrafo, objeto de este estudio, la información se gestiona actualmente mediante registros manuales o herramientas de oficina básicas sin vinculación entre procesos, lo que genera dificultades para el análisis oportuno, falta de claridad en las cuentas pendientes y una toma de decisiones fundamentada más en la intuición que en la evidencia de datos.

### 1.2 Planteamiento del Problema
Actualmente, la Librería-Cafetería Grafógrafo no cuenta con una herramienta que permita visualizar de forma integrada la información necesaria para la toma de decisiones. La información de ventas, inventario de libros y consumibles de cafetería se encuentra dispersa o no registrada formalmente, lo que dificulta su análisis y limita la identificación de patrones de consumo y tendencias de inventario.

**Problema central:** La ausencia de un sistema digital y un dashboard que integre y visualice información clave de ventas e inventario limita la toma de decisiones oportunas y fundamentadas, poniendo en riesgo la rentabilidad y el control operativo del negocio.

### 1.3 Pregunta de Investigación
¿Cómo puede el diseño de un dashboard contribuir a mejorar la visualización de información y la toma de decisiones en una librería-cafetería?

### 1.4 Objetivo General
Desarrollar una propuesta de dashboard para la visualización de información relevante de ventas e inventario que apoye la toma de decisiones en una librería-cafetería.

### 1.5 Objetivos Específicos
*   Identificar la información clave de ventas y existencias que requiere ser visualizada para la operación diaria.
*   Definir indicadores clave de desempeño (KPIs) relevantes para el modelo de negocio híbrido (librería y cafetería).
*   Diseñar la estructura general del dashboard y la aplicación web para la captura de datos en Google Sheets.
*   Analizar la utilidad de la herramienta para la toma de decisiones estratégicas y operativas del establecimiento.

### 1.6 Justificación
La realización de este proyecto se justifica por la necesidad de contar con herramientas que permitan mejorar la visualización de la información y fortalecer la toma de decisiones en los negocios locales en proceso de transformación digital. Diversos autores señalan que el uso de dashboards contribuye a reducir el tiempo de análisis y a mejorar la comprensión de los datos, permitiendo una respuesta más ágil ante cambios en el mercado (Few, 2013).

Desde el ámbito académico, el proyecto permite aplicar conocimientos de innovación, visualización de datos e inteligencia de negocios, fortaleciendo las competencias profesionales del estudiante en la resolución de problemas reales. Socialmente, el proyecto apoya la competitividad de un negocio local mediante tecnología de bajo costo, demostrando que la innovación digital es accesible y necesaria para la supervivencia de las PyMEs.

---

## CAPÍTULO II. REVISIÓN LITERARIA

### 2.1 Visualización de información
La visualización de información se define como el uso de representaciones visuales interactivas de datos abstractos para ampliar la cognición (Card, Mackinlay & Shneiderman, 1999). Su propósito fundamental es facilitar la comprensión de grandes volúmenes de datos mediante representaciones gráficas que permiten al cerebro humano identificar patrones, tendencias y anomalías de manera mucho más eficiente que el análisis de tablas alfanuméricas (Cairo, 2011). En contextos organizacionales, la visualización reduce la complejidad del análisis y apoya la toma de decisiones al presentar información clave de forma rápida y accionable (Few, 2012).

En este proyecto, se adoptan principios básicos de visualización como la claridad, la jerarquía visual y la integridad de los datos. Según Tufte (2001), una visualización efectiva debe evitar el "chartjunk" o elementos decorativos innecesarios que distraen al usuario, priorizando la relación dato-tinta para maximizar la transferencia de información. Estos principios guían la selección de gráficos en el dashboard, asegurando que cada elemento visual cumpla una función específica en el monitoreo de la librería-cafetería.

### 2.2 Dashboard: concepto, tipos y componentes
Un dashboard es una visualización cognitiva de la información más importante necesaria para lograr uno o más objetivos, consolidada y dispuesta en una sola pantalla para que la información pueda ser monitoreada de un vistazo (Few, 2013). Su utilidad principal es integrar indicadores clave de diversas fuentes y facilitar el monitoreo del desempeño para apoyar decisiones estratégicas y operativas (Eckerson, 2010).

La literatura clasifica los dashboards en tres categorías principales: estratégicos, tácticos y operativos. Los dashboards estratégicos se enfocan en el monitoreo de metas a largo plazo; los tácticos analizan procesos específicos para mandos medios; y los operativos, como el propuesto en este trabajo, se centran en el seguimiento de las actividades diarias y el flujo de trabajo inmediato (Malik, 2005). Los componentes típicos incluyen tarjetas de KPI, gráficos de tendencias y segmentadores, cuya efectividad depende de una disposición lógica que respete la carga cognitiva del usuario (Yigitbasioglu & Velcu, 2012).

### 2.3 KPI: definición y selección
Los Indicadores Clave de Desempeño (KPI) se definen como medidas cuantificables que reflejan los factores críticos de éxito de una organización (Parmenter, 2015). Para que un KPI sea útil, debe cumplir con criterios de medibilidad, relevancia y alineación con los objetivos estratégicos del negocio (Kaplan & Norton, 1992). A diferencia de las métricas simples, un KPI debe inducir a la acción y proporcionar una lectura clara sobre si el proceso se encuentra dentro de los parámetros deseados.

En este proyecto, la selección de KPIs se basa en la necesidad de equilibrio entre la gestión de inventario (libros) y la rotación de productos perecederos (cafetería). Cada indicador se documenta mediante una ficha técnica que especifica su fórmula de cálculo, fuente de datos y la decisión operativa que respalda, asegurando que la visualización tenga un propósito administrativo claro.

### 2.4 Dashboards y toma de decisiones (evidencia)
Estudios previos reportan que los dashboards mejoran la toma de decisiones al proporcionar información oportuna y consistente, reduciendo significativamente el tiempo dedicado a la preparación de reportes manuales (Davenport, 2014). La evidencia empírica sugiere que la implementación de herramientas de Business Intelligence (BI) aumenta la transparencia organizacional y permite una identificación más rápida de desviaciones financieras (Power, 2008).

No obstante, la literatura también advierte sobre limitaciones críticas, tales como la dependencia de la calidad de los datos de entrada y la posibilidad de sesgos en la interpretación si el diseño visual es inadecuado (Shneiderman, 2003). Por ello, el éxito de un dashboard no reside solo en su tecnología, sino en la integridad del proceso de captura de datos y la capacitación del usuario para interpretar las visualizaciones correctamente.

---

## CAPÍTULO III. METODOLOGÍA

### 3.1 Tipo de proyecto y alcance
Este trabajo corresponde a un proyecto aplicado, orientado a resolver una necesidad real de visualización de información en una librería-cafetería local. Según Vargas (2009), el proyecto aplicado busca la innovación mediante la implementación de soluciones prácticas a problemas identificados en un contexto específico. El alcance del dashboard incluye el monitoreo de ventas diarias, niveles de stock, control de gastos y seguimiento de cuentas pendientes, excluyendo integraciones con sistemas bancarios externos o automatización de pedidos a proveedores en esta etapa inicial.

### 3.2 Datos: fuente, preparación y calidad
Los datos provienen de la operación diaria del establecimiento, capturados a través de la interfaz de la aplicación web desarrollada. Se construyó un diccionario de variables que define campos como "ID Transacción", "Monto", "Categoría" y "Stock". El proceso de preparación incluye:
1.  **Captura:** Registro digital mediante formularios web.
2.  **Limpieza:** Validación de tipos de datos (números, fechas) antes del envío a la base de datos.
3.  **Estructura:** Organización tabular en Google Sheets, utilizando hojas separadas para Ventas, Inventario y Cuentas.
4.  **Validación:** Cruce de totales de caja contra movimientos registrados para asegurar la integridad de la información.

### 3.3 Metodología para desarrollar el dashboard (Design Thinking)
Se eligió la metodología **Design Thinking** porque permite diseñar una solución centrada en el usuario, asegurando que el dashboard responda a necesidades reales de información y decisión del dueño del negocio (Brown, 2008). El proceso se dividió en cinco fases:

1.  **Empatizar:** Se realizaron observaciones de la operación manual para identificar los "puntos de dolor" en el registro de ventas y cuentas.
2.  **Definir:** Se formuló el problema central como la falta de visibilidad sobre la rentabilidad diaria y el estado de las deudas de clientes.
3.  **Idear:** Se seleccionaron los KPIs candidatos (ej. Ticket promedio, productos más vendidos) y se realizaron bocetos de la interfaz.
4.  **Prototipar:** Se construyó la aplicación web conectada a Google Sheets y el dashboard visual con gráficos dinámicos.
5.  **Evaluar:** Se realizaron pruebas de uso real para ajustar la disposición de los elementos visuales y la facilidad de captura de datos.

### 3.4 Diseño del dashboard
El diseño se rige por principios de claridad y eficiencia visual. La estructura mínima obligatoria incluye:
*   **Hoja de Datos:** Tabla base en Google Sheets.
*   **Hoja de Cálculos:** Procesamiento de datos mediante lógica de servidor (Node.js).
*   **Interfaz de Dashboard:** Visualización en la App web mediante componentes de React.
*   **Interactividad:** Uso de segmentadores por periodo y categoría para permitir un análisis granular de la información (Few, 2013).

---

## CAPÍTULO IV. DESARROLLO DEL DASHBOARD

### 4.1 Preparación Final de los Datos y Sincronización
Para el desarrollo del dashboard se utilizaron los datos provenientes de la operación real de la librería-cafetería Grafógrafo. Una innovación técnica clave implementada fue el mecanismo de **sincronización inmediata (eager sync)** para el módulo de cuentas pendientes. A diferencia de las ventas estándar que pueden agruparse, las cuentas abiertas se sincronizan de forma atómica con Google Sheets después de cada abono o modificación de ítems. Esto garantiza la persistencia de la información ante cierres inesperados de sesión y mantiene la integridad de la deuda del cliente en la nube.

Asimismo, se implementó una estandarización de la zona horaria mediante la configuración explícita de `America/Mexico_City` en todas las funciones de generación de marcas de tiempo (timestamps). Esto resolvió la problemática de registros con horarios desfasados debido a la ubicación de los servidores de ejecución, asegurando que los reportes de ventas y movimientos de inventario coincidan exactamente con la hora local de operación del establecimiento.

### 4.2 Estructura del Dashboard
El dashboard se estructuró en secciones estratégicas para facilitar la navegación. La interfaz principal presenta un resumen ejecutivo, mientras que secciones secundarias permiten profundizar en el inventario y las cuentas pendientes.
*   **Sección de Indicadores (Cards):** Ubicada en la parte superior para una lectura rápida de valores totales.
*   **Sección Gráfica:** Paneles centrales con tendencias de ventas y distribución por categorías.
*   **Sección de Control:** Tablas dinámicas para el seguimiento de stock crítico y abonos de clientes.

`[INSERTAR CAPTURA DE PANTALLA DEL DASHBOARD GENERAL]`

### 4.3 Indicadores Visualizados (KPIs)
El dashboard integra los siguientes indicadores clave definidos para la librería-cafetería:
*   **Ventas Totales del Periodo:** Sumatoria de ingresos por ventas confirmadas.
*   **Ticket Promedio:** Relación entre el ingreso total y el número de transacciones.
*   **Nivel de Inventario Crítico:** Cantidad de productos (libros o insumos) por debajo del stock mínimo.
*   **Saldo en Cuentas Abiertas:** Monto total pendiente de cobro por ventas a crédito o parciales.
*   **Distribución de Ventas por Categoría:** Porcentaje de ingresos provenientes de librería vs. cafetería.

### 4.4 Visualizaciones Incluidas
Se seleccionaron gráficos específicos para maximizar la claridad:
1.  **Gráfico de Barras:** Para comparar ventas entre diferentes categorías de productos.
2.  **Gráfico de Líneas:** Para visualizar la tendencia de ingresos a lo largo de la semana/mes.
3.  **Gráfico de Pastel/Anillo:** Para mostrar la composición del inventario por tipo de producto.
4.  **Tarjetas Numéricas:** Para resaltar los valores financieros más críticos de forma inmediata.

### 4.5 Interactividad del Dashboard
La aplicación permite al usuario interactuar con los datos mediante:
*   **Segmentadores de Tiempo:** Filtros para visualizar resultados por día, semana o mes.
*   **Filtros de Categoría:** Capacidad de aislar el rendimiento de la cafetería del de la librería.
*   **Búsqueda Dinámica:** Localización rápida de productos en el inventario para verificar stock en tiempo real.

---

## CAPÍTULO V. RESULTADOS PARCIALES

### 5.1 Principales Hallazgos Visuales
A partir de la implementación del dashboard, se han identificado patrones que antes eran invisibles en el registro manual. Se observa una tendencia de mayor consumo en la cafetería durante las primeras horas del día, mientras que las ventas de librería se concentran en horarios vespertinos. Asimismo, la visualización del inventario permitió identificar productos con baja rotación ("stock muerto") que ocupaban espacio valioso en los estantes.

### 5.2 Utilidad del Dashboard para la Toma de Decisiones
La herramienta ha demostrado ser clave para decisiones operativas inmediatas. Por ejemplo, la visualización del "Inventario Crítico" permite realizar pedidos a proveedores de manera proactiva, evitando la pérdida de ventas por falta de producto. En el área financiera, el seguimiento de "Cuentas Abiertas" ha mejorado la recuperación de efectivo al tener claridad sobre quién debe y cuánto, eliminando el olvido de cobros comunes en el sistema manual gracias a la sincronización en tiempo real que evita discrepancias entre la aplicación y el registro físico/nube.

### 5.3 Limitaciones del Desarrollo Actual
A pesar de su funcionalidad, el sistema presenta limitaciones:
*   **Dependencia de Conectividad:** Al estar basado en la nube (Google Sheets), requiere internet estable para la sincronización.
*   **Disciplina de Registro:** La precisión del dashboard depende totalmente de que el personal registre cada transacción en el momento.
*   **Escalabilidad:** Google Sheets tiene un límite de filas que, aunque amplio para una PyME, podría requerir una migración a una base de datos SQL en el futuro a largo plazo.

---

## CAPÍTULO VI. RESULTADOS FINALES

### 6.1 Resultados Generales del Dashboard
El dashboard desarrollado permite visualizar de manera integrada la información correspondiente a las ventas y el inventario de la librería-cafetería, facilitando el análisis de los indicadores clave definidos en el proyecto. A partir de su implementación, se ha logrado centralizar la operación que antes se encontraba dispersa en registros manuales, permitiendo una visión general del comportamiento del negocio mediante representaciones gráficas claras y estructuradas. En relación con el objetivo general, la herramienta cumple con la función de apoyar la toma de decisiones al presentar información relevante de forma accesible, reduciendo el riesgo de errores humanos y pérdida de datos.

### 6.2 Resultados por Indicador (síntesis)
Al analizar los indicadores en conjunto, se observa una mejora significativa en la visibilidad financiera. El indicador de "Ventas Totales" permite cierres de caja diarios exactos, mientras que el "Ticket Promedio" ha revelado que las promociones cruzadas (libro + café) tienen un impacto positivo en el ingreso. El control de "Cuentas Abiertas" ha permitido reducir el saldo pendiente en un porcentaje estimado, demostrando que la claridad visual induce a una gestión de cobro más efectiva.

---

## CAPÍTULO VII. CONCLUSIONES

### 7.1 Conclusiones Generales
El desarrollo del presente proyecto permitió cumplir el objetivo general planteado, al diseñar e implementar una propuesta de dashboard orientada a la visualización de información relevante para la toma de decisiones en una librería-cafetería. Se concluye que la transformación digital de procesos manuales mediante herramientas web de bajo costo es no solo viable, sino necesaria para la sostenibilidad de las pequeñas empresas.

El dashboard facilita la interpretación de los datos al integrar indicadores clave en una sola interfaz visual, lo que representa una mejora sustancial respecto a los métodos tradicionales de análisis. Asimismo, el proyecto permitió aplicar de manera práctica los conocimientos adquiridos en la asignatura de Formulación y Evaluación de Proyectos de Innovación, fortaleciendo competencias relacionadas con el desarrollo full-stack, la visualización de datos y la consultoría tecnológica para negocios locales.

---

## CAPÍTULO VIII. RECOMENDACIONES

### 8.1 Recomendaciones Técnicas
Como trabajo futuro, se recomienda ampliar el dashboard incorporando un módulo de predicción de demanda basado en los datos históricos recolectados. Asimismo, se sugiere mejorar la robustez del sistema mediante la implementación de un modo offline (PWA) que permita seguir registrando ventas incluso ante fallas temporales de internet, sincronizando los datos automáticamente al recuperar la conexión.

### 8.2 Recomendaciones Organizacionales
Desde el punto de vista organizacional, se recomienda establecer un protocolo de registro obligatorio para cada transacción y movimiento de inventario, asegurando la integridad de los datos. De igual forma, es importante que el dueño del negocio dedique un tiempo semanal al análisis profundo del dashboard para ajustar sus estrategias de compra y marketing basándose en la evidencia generada por la herramienta.

---

## ANEXOS

### Anexo A. Dashboard Final
*   `[Captura de pantalla del Dashboard principal]`
*   `[Captura de pantalla de la sección de Inventario]`
*   `[Captura de pantalla de la sección de Cuentas Abiertas]`

### Anexo B. Base de Datos (Google Sheets)
*   **Estructura:** Hojas de Inventario, Ventas, Movimientos, Usuarios, Caja, Gastos y Cuentas.
*   **Variables:** ID, Fecha, Producto, Cantidad, Precio, Método de Pago, Usuario (para trazabilidad), etc.

### Anexo C. Diccionario de Indicadores y Estructura Técnica
*   **Documento:** `DICCIONARIO_DATOS.md`.
*   **Contenido:** Definición técnica de KPIs, fórmulas de cálculo y descripción de campos en Google Sheets para asegurar la trazabilidad del sistema.

---

## REFERENCIAS (APA 7)

Ackoff, R. L. (1989). From data to wisdom. *Journal of Applied Systems Analysis*, 16(1), 3-9.

Brown, T. (2008). Design thinking. *Harvard Business Review*, 86(6), 84.

Cairo, A. (2011). *El arte funcional: Infografía y visualización de información*. Pearson Educación.

Card, S. K., Mackinlay, J. D., & Shneiderman, B. (1999). *Readings in information visualization: using vision to think*. Morgan Kaufmann.

Davenport, T. H. (2014). *Big data at work: dispelling the myths, uncovering the opportunities*. Harvard Business Review Press.

Eckerson, W. W. (2010). *Performance dashboards: measuring, monitoring, and managing your business*. John Wiley & Sons.

Few, S. (2006). *Information dashboard design: The effective visual communication of data*. O'Reilly Media.

Few, S. (2012). *Show me the numbers: Designing tables and graphs to enlighten*. Analytics Press.

Few, S. (2013). *Information dashboard design: Displaying data for at-a-glance monitoring*. Analytics Press.

Kaplan, R. S., & Norton, D. P. (1992). The balanced scorecard--measures that drive performance. *Harvard Business Review*, 70(1), 71-79.

Malik, S. (2005). *Enterprise dashboards: design and best practices for IT*. John Wiley & Sons.

Parmenter, D. (2015). *Key performance indicators: developing, implementing, and using winning KPIs*. John Wiley & Sons.

Power, D. J. (2008). Decision support systems: a historical overview. *Decision Support Systems*, 2(2), 121-140.

Pressman, R. S. (2010). *Software engineering: a practitioner's approach*. McGraw-Hill.

Schwaber, K., & Beedle, M. (2002). *Agile software development with Scrum*. Prentice Hall.

Shneiderman, B. (2003). The eyes have it: A task by data type taxonomy for information visualizations. *The Craft of Information Visualization*, 364-371.

Simon, H. A. (1960). *The new science of management decision*. Harper & Brothers.

Tufte, E. R. (2001). *The visual display of quantitative information*. Graphics Press.

Vargas, G. (2009). *Metodología de la investigación*. Editorial Trillas.

Yigitbasioglu, O. M., & Velcu, O. (2012). A review of dashboard design and display: Optimizing communication and decision making. *International Journal of Accounting Information Systems*, 13(1), 41-59.
