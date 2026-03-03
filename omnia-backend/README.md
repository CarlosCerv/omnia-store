# OMNIA Backend — Medusa.js

Backend estructurado para la plataforma e-commerce OMNIA Nordic Gallery, implementado bajo una arquitectura Zero-SaaS auto-hospedada basada en Medusa.js.

## Stack Tecnológico

| Capa | Tecnología |
|:--|:--|
| Framework Base | Medusa.js v2 |
| Entorno de Ejecución | Node.js 20 |
| Motor de Base de Datos | PostgreSQL |
| Gestor de Procesos | PM2 |
| Servidor Web / Proxy Reverso | Nginx |
| Integración y Despliegue (CI/CD) | GitHub Actions |

---

## Configuración y Aprovisionamiento

### Entorno de Desarrollo (Local)

Para aprovisionar el entorno local en macOS o distribuciones Linux:

```bash
git clone https://github.com/[ORGANIZACION]/omnia-backend.git
cd omnia-backend
chmod +x scripts/*.sh
bash scripts/setup-local.sh
```

### Entorno de Producción (Servidor VPS Ubuntu 22.04 LTS)

El aprovisionamiento de infraestructura de producción se ejecuta externamente mediante SSH:

```bash
# Transferencia del script de configuración desde la terminal local:
scp scripts/setup-server.sh ubuntu@IP_SERVIDOR:/tmp/

# Ejecución remota:
ssh ubuntu@IP_SERVIDOR
sudo bash /tmp/setup-server.sh
```

---

## Índice de Scripts de Mantenimiento

Todos los scripts operativos residen en el directorio `/scripts`.

| Script | Descripción Funcional |
|:--|:--|
| `setup-local.sh` | Instalación local. Verifica y provisiona Node, bases de datos y migraciones de esquema Medusa. |
| `setup-server.sh` | Configuración IaaS. Configura Nginx, PM2, certificados SSL y base de datos relacional. |
| `deploy.sh` | Pipeline de despliegue manual. Diseñado para interrupciones del sistema CI/CD. |

---

## Documentación Funcional Extendida

El documento `OPERACIONES.md` adjunto en este repositorio detalla los procedimientos para:
- Administración de catálogo a través del panel de control Medusa.
- Modelado y gestión de stock/variantes.
- Comandos operativos completos de PM2 en servidor.
- Procedimientos de generación de secretos criptográficos para GitHub Actions.

---

## Variables de Entorno (Configuration Keys)

El sistema requiere parámetros en formato `.env`. Utilice la plantilla como base:

```bash
cp .env.template .env
```

Parámetros críticos que requieren inicialización estricta:
- `DATABASE_URL`: Cadena de conexión PostgreSQL.
- `JWT_SECRET`: Llave simétrica de 32 bytes para firma de tokens de portador.
- `COOKIE_SECRET`: Ficha para encriptación de sesiones internas del panel.

---

## Integración Continua (CI/CD)

El pipeline de despliegue se desencadena automáticamente tras un evento `push` a la rama `main` mediante rutinas de GitHub Actions (localizado en `.github/workflows/deploy-backend.yml`).

Requisitos en GitHub Settings -> Secrets -> Actions:
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
