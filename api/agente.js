import { CONOCIMIENTO_BERTOLLI } from './conocimiento.js';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

export default async function handler(req, res) {
  // 1. Permitir únicamente solicitudes POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  // 2. Validar la pregunta del visitante
  const { mensaje } = req.body ?? {};

  if (
    typeof mensaje !== 'string' ||
    !mensaje.trim() ||
    mensaje.length > 1000
  ) {
    return res.status(400).json({
      error: 'Escribe una pregunta válida'
    });
  }

  // 3. Obtener la clave privada desde Vercel
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'El agente todavía no está configurado'
    });
  }



  // Control de consultas con Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Falta la configuración de Supabase');

  return res.status(503).json({
    error: 'El asistente no está disponible temporalmente'
  });
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

res.setHeader('Cache-Control', 'no-store');

const ip = (
  req.headers['x-forwarded-for']?.split(',')[0]?.trim()
  || req.socket?.remoteAddress
  || 'desconocida'
);

const identificador = createHash('sha256')
  .update(ip)
  .digest('hex');

try {
  const { data: permitido, error } = await supabase.rpc(
    'controlar_limite_agente',
    { p_identificador: identificador }
  );

  if (error) {
    console.error('Error al verificar límite:', error.message);
    return res.status(503).json({
      error: 'El asistente no está disponible temporalmente'
    });
  }

  if (!permitido) {
    return res.status(429).json({
      error: 'Has alcanzado el límite de 5 preguntas por minuto'
    });
  }
} catch (error) {
  console.error('Error de seguridad:', error.message);
  return res.status(503).json({
    error: 'El asistente no está disponible temporalmente'
  });
}


// Control diario global: máximo 100 consultas
try {
  const { data: cupoDisponible, error } = await supabase.rpc(
    'controlar_cupo_diario_agente'
  );

  if (error) {
    console.error('Error al verificar cupo diario:', error.message);

    return res.status(503).json({
      error: 'El asistente no está disponible temporalmente'
    });
  }

  if (!cupoDisponible) {
    return res.status(429).json({
      error: 'El asistente alcanzó su límite diario de consultas'
    });
  }
} catch (error) {
  console.error('Error del control diario:', error.message);

  return res.status(503).json({
    error: 'El asistente no está disponible temporalmente'
  });
}


  // 4. Instrucciones del agente
  const instrucciones = `
  INFORMACIÓN DEL PRODUCTO:
${CONOCIMIENTO_BERTOLLI}

Utiliza esta información como fuente principal
para responder preguntas sobre Bertolli Pro 900.
No inventes características que no estén confirmadas.
Eres el asistente virtual de Bertolli Pro 900.

Tu trabajo es ayudar a los visitantes a conocer
el producto y resolver sus dudas.

Reglas:
- Responde siempre en español.
- Utiliza un tono amable, claro y profesional.
- No inventes precios, características ni garantías.
- Si no conoces una respuesta, dilo claramente.
- Si alguien quiere comprar o cotizar, invítalo
  a completar el formulario de cotización.
- No solicites contraseñas ni datos bancarios.
- Responde de forma breve y útil.
`;

  try {
    // 5. Consultar el modelo de inteligencia artificial
    const respuesta = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'openrouter/free',
            messages: [
            { role: 'system', content: instrucciones },
            { role: 'user', content: mensaje.trim() }
            ],
            max_tokens: 500
        })
      }
    );

    if (!respuesta.ok) {
      console.error('Error del proveedor de IA:', respuesta.status);

      return res.status(502).json({
        error: 'El asistente no está disponible'
      });
    }

    const resultado = await respuesta.json();

    // 6. Extraer el texto de la respuesta
    const texto = resultado.choices?.[0]?.message?.content?.trim() ?? '';

    return res.status(200).json({
      respuesta: texto || 'No pude responder en este momento.'
    });

  } catch (error) {
    console.error('Error de conexión con IA:', error.message);

    return res.status(500).json({
      error: 'No fue posible conectar con el asistente'
    });
  }
}
