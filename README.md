# Digital Codex Alimentarius

Aplicación web de alto rendimiento orientada a la consulta técnica, estructurada e interoperable de normativas, aditivos, fertilizantes, plaguicidas y sustancias del Codex Alimentarius. Este proyecto transforma volúmenes complejos de datos regulatorios y científicos en una herramienta digital interactiva de acceso rápido.

## Enlace de Producción
* **URL Oficial:** https://jaimes4224d.github.io/Digital_Codex_Alimentarius/

---

## Proceso de Digitalización del Proyecto

La concepción y digitalización de este sistema respondió a la necesidad de optimizar la consulta de normativas alimentarias y agrícolas, tradicionalmente almacenadas en documentos densos y poco dinámicos. El proceso de desarrollo se estructuró en las siguientes fases clave:

* **Estructuración y Normalización de Datos:** Extracción y limpieza de registros normativos y sustancias químicas/alimentarias para convertirlos en fuentes de datos estructuradas (JSON), normalizando nomenclatura técnica, categorías (fertilizantes, plaguicidas, aditivos) y límites máximos de residuos o umbrales normativos.
* **Diseño de Interfaz Centrada en la Experiencia Técnica (UX/UI):** Creación de componentes modulares en React que permiten filtros en tiempo real, búsquedas instantáneas por tipología de sustancia y una visualización clara adaptada a profesionales de la salud, ingeniería y agroindustria.
* **Optimización de Rendimiento y Tipado:** Implementación de TypeScript para asegurar la integridad de los esquemas de datos complejos, eliminando discrepancias en tiempo de ejecución y garantizando una experiencia fluida sin latencia.
* **Automatización y Despliegue Continuo (CI/CD):** Configuración de un entorno robusto con Vite y automatización del ciclo de entrega hacia GitHub Pages para asegurar disponibilidad pública inmediata ante cualquier actualización del repositorio.

---

## Arquitectura y Stack Tecnológico

* **Frontend:** React (v19) bajo un paradigma de componentes funcionales desacoplados y gestión de estado reactivo.
* **Tipado Estático:** TypeScript para el modelado estricto de las estructuras de datos normativos.
* **Bundler y Compilación:** Vite para la gestión optimizada de assets, code splitting y tiempos de carga mínimos.
* **Iconografía y Estilos:** Lucide React y diseño modular responsivo adaptado para dispositivos móviles y de escritorio.
* **Calidad de Código:** Oxlint para análisis estático y mantenimiento de estándares de código limpio.

---

## Guía de Configuración y Ejecución Local

Para clonar y poner en marcha el entorno de desarrollo en una máquina local, ejecute las siguientes instrucciones en la terminal:

1. Clonar el repositorio principal:
   git clone https://github.com/JAIMES4224D/Digital_Codex_Alimentarius.git

2. Navegar hacia el directorio del subproyecto:
   cd Digital_Codex_Alimentarius/codex-app

3. Instalar las dependencias del sistema:
   npm install

4. Iniciar el servidor de desarrollo local:
   npm run dev

---

## Pipeline de Despliegue en Producción

El proyecto utiliza la herramienta `gh-pages` para gestionar el empaquetado de producción (`dist`) y su sincronización con la rama de despliegue remoto. Para actualizar el sitio web en vivo, ejecute:
   npm run deploy

---

## Autoría y Desarrollo

* **Desarrollado por:** Jeferson Jociney Jaimes Passuni
* **Organización:** DevPass Digital Solutions
* **Institución:** Universidad Privada Norbert Wiener
