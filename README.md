# Plan Dual a la Cordobesa · Sitio web

Sitio informativo del **Plan Dual** para escuelas técnicas, empresas, estudiantes y familias.
Dirección General de Educación Técnica y Formación Profesional (DGETyFP) · Ministerio de Educación de la Provincia de Córdoba.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El sitio completo |
| `convenio.html` | Modelo de Convenio Marco para leer en línea (sin datos de escuelas, empresas ni firmantes) |
| `admin.html` | Panel de administración: postulaciones abiertas/cerradas, enlace del formulario, cifras |
| `assets/` | Imágenes, fotos de experiencias y modelo de convenio en Word |
| `apps-script/Codigo.gs` | Código que va en el Apps Script de la planilla "Plan Dual" (no hace falta subirlo a GitHub) |

---

## PASO 1 · Conectar la planilla "Plan Dual"

1. Abrí la planilla **Plan Dual** en Google Sheets.
2. Menú **Extensiones → Apps Script**.
3. Mirá lo que hay en `Código.gs`:
   - Si está vacío o solo dice `function myFunction() {}` → borralo todo y pegá el contenido de `apps-script/Codigo.gs`.
   - Si ya tiene código que usás para otro formulario (por ejemplo el de inscripción) → **no lo borres**. Renombrá su función `doPost` a `doPostAnterior`. Después tocá **+ → Secuencia de comandos**, llamala `PlanDualWeb` y pegá ahí el código nuevo.
4. Guardá (ícono del disquete).
5. Arriba elegí la función **instalar** y tocá **▶ Ejecutar**. Aceptá los permisos (Revisar permisos → tu cuenta → Configuración avanzada → Ir a … → Permitir).
6. Se crean dos pestañas en la planilla: **Consultas** y **Configuracion**.
7. Publicá la nueva versión **sin cambiar la URL**:
   **Implementar → Administrar implementaciones → ✏️ (lápiz) → Versión: Nueva versión → Implementar.**
   Revisá que diga *Ejecutar como: Yo* y *Quién tiene acceso: Cualquier usuario*.

> ⚠️ Si alguna vez usás "Nueva implementación" en lugar de editar la existente, la URL cambia. En ese caso hay que pegar la URL nueva en `index.html` (variable `SCRIPT_URL`) y en `admin.html`.

**Qué hace cada consulta del formulario:**
- Se guarda como una fila en la pestaña **Consultas**.
- Llega un email a **equipotecnicodgetyfp@gmail.com** con copia oculta a **ahumadamariaceleste@gmail.com**. El asunto empieza con "Plan Dual". Si respondés ese email, le contestás directo a quien consultó.
- Quien consulta recibe un email automático de confirmación.

## PASO 2 · Publicar en GitHub con una dirección institucional

Para que la dirección **no lleve tu nombre**, se crea una *organización* gratuita de GitHub con nombre de Plan Dual. La dirección queda así:

**https://plandual-dgetyfp.github.io**

1. Entrá a github.com con tu cuenta (o creala).
2. Arriba a la derecha: **+ → New organization → Create a free organization**.
   - Organization name: `plandual-dgetyfp`
   - Contact email: equipotecnicodgetyfp@gmail.com
   - "This organization belongs to": *My personal account*. Después podés sumar a la cuenta del equipo como administradora.
3. Dentro de la organización: **New repository**.
   - Repository name: **`plandual-dgetyfp.github.io`** (exactamente igual al nombre de la organización + `.github.io`)
   - Public → **Create repository**.
4. En la página del repositorio vacío tocá **uploading an existing file**.
5. Descomprimí el ZIP en tu computadora y **arrastrá todo el contenido de la carpeta** (`index.html`, `convenio.html`, `admin.html`, `README.md` y la carpeta `assets`) a la ventana. Abajo: **Commit changes**.
6. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → **Save**.
7. En 1 o 2 minutos el sitio queda en **https://plandual-dgetyfp.github.io**.

Si en el futuro el Ministerio quiere un dominio propio (por ejemplo `plandual.cba.gov.ar`), se configura en **Settings → Pages → Custom domain**.

### Actualizar el sitio más adelante
En el repositorio: **Add file → Upload files**, arrastrá el archivo modificado (mismo nombre) y **Commit changes**. Se reemplaza solo.

## PASO 3 · Administrar el sitio (sin tocar código)

Entrá a **https://plandual-dgetyfp.github.io/admin.html** (también hay un enlace discreto "Acceso equipo" al pie del sitio).

Usuarios habilitados (usuario = email; la contraseña la tiene el equipo):
- equipotecnicodgetyfp@gmail.com
- ahumadamariaceleste@gmail.com
- equipotecnicosuperior.etp@gmail.com

Las contraseñas están guardadas cifradas en el script. Después de 6 intentos fallidos, ese usuario queda bloqueado 15 minutos.

Desde el panel podés:

- Marcar las postulaciones como **Abiertas** o **Cerradas**:
  - **Abiertas:** el botón "Formulario de inscripción" lleva al formulario.
  - **Cerradas:** el botón muestra el anuncio "Convocatoria cerrada" con el botón "Envianos tu consulta".
- Cambiar el ciclo, la fecha de cierre, el enlace del formulario y el texto del anuncio.
- Actualizar las cifras: escuelas, empresas, estudiantes, localidades y especialidades.
- Ver cuántas consultas llegaron y abrir la planilla.

Lo mismo se puede editar directamente en la pestaña **Configuracion** de la planilla.

**Cambiar una contraseña:** en Apps Script, en la función `cambiarContrasena`, completá el email y la contraseña nueva, ejecutala y después volvé a dejar las comillas vacías. Para sumar o quitar administradoras hay que editar la lista `ADMINS` (pedime el código cifrado).

## Pendientes a revisar
- El video de Drive tiene que estar compartido como **"Cualquier persona con el enlace"**.
- Verificar que las fotos de experiencias puedan publicarse (derechos de imagen de estudiantes).
