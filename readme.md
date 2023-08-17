#### Proyecto Final

**17/8/23 - Correción Primera entrega:**

Agregué a la ruta de agregar producto al carrito el chequeo de que el producto exista y de que tenga stock mayor a 0. Finalmente importé el ProductManager desde el router de productos para no duplicarlo y que no quede en dos lugares la referencia al archivo .json.

También arreglé el comando start.

**11/8/23 - Primera entrega:**

Despues de no encontrar un contrato elegante entre el router y el manager de productos me puse a leer (quizás demasiado) y termine con un manejo de errores con más lineas que el resto del codigo. Creo que es bastante robusto y va a quedar bien para cuando se vaya ampliando.
El router se encarga de llamar al manager y manejar los errores, armando una respuesta cuando sea necesario. El manager de chequear los tipos, interactuar con la 'db' y elevar los errores que haya. Entiendo que es la idea pero siento que podría ser más claro. También agregué el multer, en parte de puro entusiasmo, en parte porque le da soporte a las consultas en formato 'form-data' que no supe como manejar de otra manera.

Última aclaración, para mantener los paths coherentes seguí usando la función resolve de express. No me terminó de quedar claro si así corría bien en tu entorno pero me pareció razonable que quede igual para todo.

Gracias por leer el choclazo, cualquier observación o consulta, a disposición!
