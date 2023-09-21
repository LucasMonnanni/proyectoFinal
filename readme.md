#### Proyecto Final

**21/9/23 - Implementación de login**

No comprendo bien según la documentación de Express como devolver un redirect pero cambiando el método, con lo cual manejo manualmente desde el front la redirección.

**15/9/23 - Segunda Preentrega:**

Agregada la paginación a los productos. Agregados los endpoints para agregar, quitar y editar los productos en carrito. Hice todo lo posible por delegar las operaciones a la DB y aprovechar las funciones de mongo (push, pull, etc.), a costa de alguna que otra operación no muy intuitiva.

En cuanto a las vistas, no quise duplicar lo hecho en la API con lo cual las vistas llaman automáticamente un `fecth()` para obtener la información. No es demasiado sofisticado pero funciona rápido y bien. Para poder agregar productos al carrito y mantener la coherencia agregué una cookie con el Id de carrito que se renueva con cada operación y dura una hora (completamente arbitrario).

**7/9/23 - Práctica Integradora:**

Han cambiado muchas cosas. En primer lugar, los dos modelos de persistencia de datos conviven y se puede configurar cual usa la app desde `app.js` con una burda variable de texto. Cabe aclarar que en modo `'fs'`el chat no funciona.

Los managers de fs no han cambiado más que alguna correción de estilo. Los de mongoDb funcionan como port entre las funciones que llama el router, que son iguales para ambos casos, y las funciones de mongoose. También manejan los posibles errores, que incluyen los de validación del schema. No es bonito ese código pero los errores de mongoose son realmente intrincados. La idea fue que todo error que signifique algo claro llegue a la response en castellano y el resto como 500 sin más.

En cuanto al chat lo mantuve bastante sencillo, sin más autenticación que una dirección de email válida. También trae toda la colección de mensajes al ingresar, se me ocurren varias maneras de limpiarlo pero la consigna no decía nada así que escucho tus comentarios al respecto.

PD: La contraseña a la DB de Atlas la levanta como variable de entorno para que no quede en el repo público de github.

**17/8/23 - Correción Primera entrega:**

Agregué a la ruta de agregar producto al carrito el chequeo de que el producto exista y de que tenga stock mayor a 0. Finalmente importé el ProductManager desde el router de productos para no duplicarlo y que no quede en dos lugares la referencia al archivo .json.

También arreglé el comando start.

**11/8/23 - Primera entrega:**

Despues de no encontrar un contrato elegante entre el router y el manager de productos me puse a leer (quizás demasiado) y termine con un manejo de errores con más lineas que el resto del codigo. Creo que es bastante robusto y va a quedar bien para cuando se vaya ampliando.
El router se encarga de llamar al manager y manejar los errores, armando una respuesta cuando sea necesario. El manager de chequear los tipos, interactuar con la 'db' y elevar los errores que haya. Entiendo que es la idea pero siento que podría ser más claro. También agregué el multer, en parte de puro entusiasmo, en parte porque le da soporte a las consultas en formato 'form-data' que no supe como manejar de otra manera.

Última aclaración, para mantener los paths coherentes seguí usando la función resolve de express. No me terminó de quedar claro si así corría bien en tu entorno pero me pareció razonable que quede igual para todo.

Gracias por leer el choclazo, cualquier observación o consulta, a disposición!
