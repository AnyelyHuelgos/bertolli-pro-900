import { createClient } from '@supabase/supabase-js';


export default async function handler(req, res) {
  // 1. Permitir únicamente solicitudes POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');

    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  // Rechazar solicitudes con un cuerpo demasiado grande
  const tamanoSolicitud = Buffer.byteLength(
    JSON.stringify(req.body ?? {}),
    'utf8'
  );

  if (tamanoSolicitud > 10_000) {
    return res.status(413).json({
      error: 'La solicitud es demasiado grande'
    });
  }


  // 2. Recibir los datos enviados por el formulario  
  const { nombre, email, mensaje, sitio_web } = req.body ?? {};

  
    // Honeypot: detectar formularios completados por bots
    if (
    typeof sitio_web === 'string' &&
    sitio_web.trim() !== ''
    ) {
    return res.status(200).json({
        mensaje: 'Solicitud recibida'
    });
    }



  // 3. Comprobar que los datos sean textos
  if (
    typeof nombre !== 'string' ||
    typeof email !== 'string' ||
    typeof mensaje !== 'string'
  ) {
    return res.status(400).json({
      error: 'Los campos deben ser textos'
    });
  }

  // 4. Eliminar espacios innecesarios
  const datos = {
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    mensaje: mensaje.trim()
  };

  // 5. Validar los campos
  if (
    !datos.nombre ||
    !datos.email ||
    !datos.mensaje ||
    datos.nombre.length > 100 ||
    datos.email.length > 255 ||
    datos.mensaje.length > 2000 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)
  ) {
    return res.status(400).json({
      error: 'Los datos de la cotización no son válidos'
    });
  }


  // 6. Leer las variables de entorno del servidor
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;


  if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno de Supabase');

    return res.status(500).json({
      error: 'Error de configuración del servidor'
    });
  }

  try {
    // 7. Crear el cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    // 8. Guardar la cotización en PostgreSQL
    const { error } = await supabase
      .from('cotizaciones')
      .insert({
        nombre: datos.nombre,
        email: datos.email,
        mensaje: datos.mensaje
      });

    // 9. Comprobar si ocurrió un error
    if (error) {
      console.error('Error al guardar cotización:', error.code);

      return res.status(500).json({
        error: 'No fue posible guardar la cotización'
      });
    }

    // 10. Confirmar que se guardó correctamente
    return res.status(201).json({
      mensaje: 'Cotización guardada correctamente'
    });

  } catch (error) {
    console.error('Error inesperado en cotizaciones:', error);

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}
