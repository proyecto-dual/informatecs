# CodeViz Research Context

> **Note**: This file contains research context from CodeViz. Most recent contexts are at the bottom.

---

## Research Query

muestrame el flujo de mi inicio de sesion

*Session: 75e601a2b7356b9269f4600905971f36 | Generated: 3/7/2025, 9:51:39 a.m.*

### Analysis Summary

# Flujo de Inicio de Sesión

Este informe detalla el flujo de inicio de sesión, abarcando desde la interacción de alto nivel hasta las funciones específicas de bajo nivel involucradas en la autenticación y verificación de credenciales.

## Arquitectura de Alto Nivel

El proceso de inicio de sesión se centra en la interacción entre el **Cliente**, el **Endpoint de la API de Login**, y la **Base de Datos**.

*   **[Cliente](node:Client)**: Inicia la solicitud de inicio de sesión proporcionando la matrícula y la contraseña.
*   **[Endpoint de la API de Login](file:informatecs/src/app/api/auth/login/route.js)**: Recibe las credenciales del cliente, orquesta la verificación y la interacción con la base de datos.
*   **[Base de Datos](node:Database)**: Almacena la información de los estudiantes en la tabla `estudiantes` y los datos de autenticación en la tabla `authStudents`.

El flujo general es el siguiente: el [Cliente](node:Client) envía las credenciales al [Endpoint de la API de Login](file:informatecs/src/app/api/auth/login/route.js), que a su vez consulta la [Base de Datos](node:Database) para verificar la existencia del estudiante y la validez de la contraseña. Dependiendo del estado de verificación, se devuelve una respuesta al [Cliente](node:Client).

## Interacciones a Nivel Medio

El archivo clave que maneja el flujo de inicio de sesión es [route.js](file:informatecs/src/app/api/auth/login/route.js) dentro del directorio `informatecs/src/app/api/auth/login/`.

### [Endpoint de Login (route.js)](file:informatecs/src/app/api/auth/login/route.js)

Este archivo es responsable de procesar las solicitudes POST para el inicio de sesión.

*   **Propósito**: Recibir las credenciales del usuario, verificar su autenticidad y gestionar el estado de verificación de la cuenta.
*   **Partes Internas**:
    *   Manejo de solicitudes POST.
    *   Interacción con Prisma para consultas a la base de datos.
    *   Uso de `bcrypt` para el hashing y comparación de contraseñas.
*   **Relaciones Externas**:
    *   Recibe solicitudes POST del [Cliente](node:Client).
    *   Interactúa con la [Base de Datos](node:Database) (tablas `estudiantes` y `authStudents`) a través de Prisma.
    *   Envía respuestas JSON al [Cliente](node:Client).

El flujo detallado de interacciones es el siguiente:

1.  **Solicitud Inicial**: El [Cliente](node:Client) envía una solicitud POST a `/api/auth/login` con `matricula` y `password`.
2.  **Búsqueda de Estudiante (Tabla `estudiantes`)**: El [Endpoint de Login](file:informatecs/src/app/api/auth/login/route.js) consulta la tabla `estudiantes` en la [Base de Datos](node:Database) para verificar la existencia de la `matricula`. Si no se encuentra, se devuelve un error "Matrícula no encontrada".
3.  **Búsqueda de Autenticación (Tabla `authStudents`)**: Se verifica la tabla `authStudents` en la [Base de Datos](node:Database) para un registro de autenticación existente.
    *   **Primer Inicio de Sesión/Nuevo Usuario**: Si no hay registro en `authStudents`, se crea uno nuevo con la `matricula`, un nombre completo, una contraseña genérica (`'123456'`) hasheada con `bcrypt`, un correo vacío y `isVerified` establecido en `false`.
4.  **Verificación de Contraseña**: La contraseña proporcionada por el [Cliente](node:Client) se compara con la contraseña hasheada almacenada en `authStudents` utilizando `bcrypt.compare`. Si no coinciden, se devuelve un error "Contraseña incorrecta".
5.  **Verificación de Estado**: Si las contraseñas coinciden, se verifica el estado `isVerified` del registro en `authStudents`.
    *   **Usuario Verificado**: Si `isVerified` es `true`, se devuelve un mensaje de bienvenida.
    *   **Usuario No Verificado**: Si `isVerified` es `false`, se devuelve un mensaje indicando que se requiere verificación, junto con un indicador `requiresVerification: true` y el correo electrónico del usuario (si está disponible).

## Detalles de Implementación a Nivel Bajo

Las funciones y métodos clave involucrados en la autenticación, gestión de sesiones y verificación de credenciales son:

### Verificación de Credenciales

*   **`prisma.estudiantes.findUnique`**: Utilizado en [login/route.js](file:src/app/api/auth/login/route.js:11) para verificar la existencia del estudiante en la base de datos.
*   **`bcrypt.compare`**: Implementado en [login/route.js](file:src/app/api/auth/login/route.js:39) para comparar la contraseña proporcionada por el usuario con la contraseña hasheada almacenada.
*   **`student.emailCode !== code`**: Esta lógica se encuentra en [verifyCode/route.js](file:src/app/api/auth/verifyCode/route.js:13) y es crucial para verificar el código de correo electrónico durante el proceso de verificación.

### Autenticación de Usuario y Gestión de Sesiones (Implícito)

*   **Función `POST` en [login/route.js](file:src/app/api/auth/login/route.js:8)**: Orquesta todo el flujo de inicio de sesión, desde la recepción de la solicitud hasta la respuesta final, incluyendo la creación de nuevos registros de autenticación y la verificación de credenciales.
*   **`prisma.authStudents.create`**: Utilizado en [login/route.js](file:informatecs/src/app/api/auth/login/route.js:28) para crear nuevos registros de autenticación para usuarios que inician sesión por primera vez.
*   **`prisma.authStudents.update`**: Presente en [changePass/route.js](file:src/app/api/auth/changePass/route.js:12), esta función actualiza el estado `isVerified` de un usuario después de un cambio de contraseña exitoso.

### Gestión de Contraseñas

*   **`bcrypt.hash`**: Empleado en [login/route.js](file:informatecs/src/app/api/auth/login/route.js:26) y [changePass/route.js](file:src/app/api/auth/changePass/route.js:10) para hashear las contraseñas antes de almacenarlas en la base de datos, garantizando la seguridad.
*   **`prisma.authStudents.update`**: También en [changePass/route.js](file:src/app/api/auth/changePass/route.js:12), esta función se encarga de actualizar la contraseña hasheada almacenada en la base de datos.

### Verificación de Correo Electrónico (Parte de Verificación de Credenciales/Recuperación de Cuenta)

*   **Generación de Código**: La expresión `Math.floor(100000 + Math.random() * 900000).toString()` en [sendCode/route.js](file:src/app/api/auth/sendCode/route.js:19) genera códigos de verificación numéricos aleatorios.
*   **Envío de Correo Electrónico**: Las funciones `nodemailer.createTransport` y `transporter.sendMail` en [sendCode/route.js](file:src/app/api/auth/sendCode/route.js:22) y [sendCode/route.js](file:src/app/api/auth/sendCode/route.js:30) respectivamente, manejan la configuración y el envío de correos electrónicos con los códigos de verificación.
*   **Almacenamiento del Código**: `prisma.authStudents.update` en [sendCode/route.js](file:src/app/api/auth/sendCode/route.js:37) se utiliza para almacenar el código de correo electrónico generado en la base de datos.
*   **Verificación del Código**: La función `POST` en [verifyCode/route.js](file:src/app/api/auth/verifyCode/route.js:6) es responsable de verificar el código de correo electrónico proporcionado por el usuario contra el código almacenado.

### Implementation Steps

1. **Understanding the High-Level Architecture**
   The login process involves three main components: the `Client`, the `Login API Endpoint`, and the `Database`. The `Client` initiates the login request, sending credentials to the `Login API Endpoint`. This endpoint then interacts with the `Database` to verify the credentials and sends a response back to the `Client`.

2. **Exploring the Login Endpoint**
   The `Login Endpoint` is responsible for processing POST requests for user login. Its purpose is to receive user credentials, verify their authenticity, and manage the account's verification status. It handles POST requests, interacts with the database using Prisma, and uses `bcrypt` for password hashing and comparison. It receives requests from the `Client`, interacts with the `Database` (specifically the `estudiantes` and `authStudents` tables), and sends JSON responses back to the `Client`.

3. **Understanding the Detailed Login Flow**
   The login flow begins with the `Client` sending a POST request containing the `matricula` and `password` to the `/api/auth/login` endpoint. The `Login Endpoint` first queries the `estudiantes` table in the `Database` to check if the `matricula` exists. If not found, an error is returned. Next, it checks the `authStudents` table for an existing authentication record. For new users or first logins, a new record is created in `authStudents` with a generic hashed password and an unverified status. The provided password is then compared with the stored hashed password using `bcrypt.compare`. If they don't match, an incorrect password error is returned. Finally, if passwords match, the `isVerified` status from the `authStudents` record is checked. If `true`, a welcome message is returned; if `false`, a message indicating required verification is returned, along with a `requiresVerification` flag and the user's email.

4. **Credential Verification**
   Credential verification involves checking the existence of the student in the database and comparing passwords. The system uses `prisma.estudiantes.findUnique` to find the student and `bcrypt.compare` to securely compare the provided password with the stored hashed password. Additionally, there's logic to verify email codes, which is part of a broader verification process.

5. **User Authentication and Session Management**
   User authentication and session management are orchestrated by the `POST` function within the `Login Endpoint`. This function manages the entire login process, including creating new authentication records for first-time users using `prisma.authStudents.create` and updating user verification status, for example, after a password change, using `prisma.authStudents.update`.

6. **Password Management**
   Password management is handled securely using `bcrypt.hash` to hash passwords before storing them in the database, ensuring security. The `prisma.authStudents.update` function is used to update the stored hashed password in the database, for instance, during a password change operation.

7. **Email Verification Process**
   Email verification is a crucial part of the account verification and recovery process. It involves generating random numeric verification codes, sending these codes to the user's email using `nodemailer`, and storing the generated code in the database via `prisma.authStudents.update`. A dedicated function is then responsible for verifying the code provided by the user against the stored code.

