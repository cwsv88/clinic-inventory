# Despliegue en Producción

Este documento describe el proceso recomendado para desplegar la aplicación **Clinic Inventory** en un entorno de producción utilizando los contenedores definidos en este repositorio.

## Requisitos previos

- Docker y Docker Compose v2 o superior instalados en el host de despliegue.
- Acceso a un registro de contenedores (Docker Hub, GitHub Container Registry, etc.) si se publicarán imágenes.
- Certificados TLS válidos (por ejemplo, mediante Let\`s Encrypt) cuando se exponga la aplicación a Internet.
- Variables de entorno sensibles gestionadas con un **secret manager** o archivos `.env` fuera del control de versiones.

## Variables de entorno

Los servicios requieren las siguientes variables. Añada los valores definitivos en un archivo `.env` ubicado en la raíz del proyecto o configúrelas en su plataforma de orquestación:

| Servicio  | Variable                    | Descripción                                      |
|-----------|-----------------------------|--------------------------------------------------|
| PostgreSQL| `POSTGRES_DB`               | Nombre de la base de datos.                      |
|           | `POSTGRES_USER`             | Usuario administrador.                           |
|           | `POSTGRES_PASSWORD`         | Contraseña del usuario administrador.            |
| Backend   | `DATABASE_URL`              | Cadena de conexión PostgreSQL.                   |
|           | `APP_MODULE`                | Módulo ASGI (por defecto `app.main:app`).        |
|           | `GUNICORN_WORKERS`          | Número de workers Gunicorn.                      |
|           | `GUNICORN_BIND`             | Dirección de binding (`0.0.0.0:8000` por defecto).|
| Frontend  | `BACKEND_URL`               | URL pública del backend para llamadas API.       |
| pgAdmin   | `PGADMIN_DEFAULT_EMAIL`     | Email de acceso inicial.                         |
|           | `PGADMIN_DEFAULT_PASSWORD`  | Contraseña de acceso inicial.                    |

> **Nota:** Defina contraseñas robustas y almacénelas como secretos. Ajuste `GUNICORN_WORKERS` y los recursos asignados según la carga esperada.

## Construcción de imágenes

1. Autentíquese en el registro de contenedores:
   ```bash
   docker login <registry>
   ```
2. Compile las imágenes y etiquételas para el registro:
   ```bash
   docker compose build
   docker tag clinic-inventory-backend:latest <registry>/clinic-inventory/backend:<tag>
   docker tag clinic-inventory-frontend:latest <registry>/clinic-inventory/frontend:<tag>
   ```
3. Publique las imágenes:
   ```bash
   docker push <registry>/clinic-inventory/backend:<tag>
   docker push <registry>/clinic-inventory/frontend:<tag>
   ```

## Migraciones de base de datos

1. Aplique migraciones antes de levantar la aplicación productiva. Por ejemplo, si usa Alembic:
   ```bash
   docker compose run --rm backend alembic upgrade head
   ```
2. Verifique que la base de datos tenga el estado esperado. Puede utilizar `psql` o pgAdmin (activando el perfil `pgadmin`).

## Despliegue

1. Cree una red o utilice una existente para los servicios productivos.
2. Levante la base de datos:
   ```bash
   docker compose up -d postgres
   ```
3. Ejecute el backend y frontend:
   ```bash
   docker compose up -d backend frontend
   ```
4. Active pgAdmin solo cuando sea necesario para tareas operativas:
   ```bash
   docker compose --profile pgadmin up -d pgadmin
   ```
5. Configure un **reverse proxy** (por ejemplo, Traefik o Nginx) delante del frontend para manejar TLS y balanceo. Si utiliza Kubernetes u otra plataforma, adapte el manifiesto siguiendo los mismos contenedores.

## Backups y mantenimiento

- **Backups**: programe respaldos periódicos de la base de datos. Un ejemplo simple usando `pg_dump`:
  ```bash
  docker compose exec postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup-$(date +%Y%m%d).sql
  ```
- **Restauración**: restaure desde un backup con `psql` o `pg_restore` según el formato.
- **Monitoreo**: supervise logs (`docker compose logs -f`) y configure alertas sobre el uso de recursos. Considere integrar herramientas como Prometheus y Grafana.
- **Actualizaciones**: reconstruya imágenes con regularidad para aplicar parches de seguridad y actualice dependencias (`requirements.txt`, `package.json`).

## Consideraciones adicionales

- Revise y ajuste los límites de recursos (`deploy.resources`) si se despliega en Swarm/Kubernetes.
- Configure almacenamiento persistente en producción (volúmenes gestionados, discos en la nube, etc.).
- Proteja pgAdmin detrás de VPN o listas de control de acceso.
- Documente el procedimiento de recuperación ante desastres y pruebe restauraciones periódicamente.

