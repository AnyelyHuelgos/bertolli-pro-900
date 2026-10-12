
const abrir = document.getElementById('chat-abrir');
const cerrar = document.getElementById('chat-cerrar');
const panel = document.getElementById('chat-panel');
const formularioChat = document.getElementById('chat-formulario');
const pregunta = document.getElementById('chat-pregunta');
const mensajes = document.getElementById('chat-mensajes');

// Preguntas rápidas
const sugerencias = document.getElementById('chat-sugerencias');
const botonesSugeridos = document.querySelectorAll('.chat-sugerencia');

let enviando = false;

// Abrir el chat
abrir.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  abrir.setAttribute('aria-expanded', String(!panel.hidden));

  if (!panel.hidden) pregunta.focus();
});

// Cerrar el chat
cerrar.addEventListener('click', () => {
  panel.hidden = true;
  abrir.setAttribute('aria-expanded', 'false');
  abrir.focus();
});


/* Cerrar el chat con Escape */
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && !panel.hidden) {
    evento.preventDefault();

    panel.hidden = true;
    abrir.setAttribute('aria-expanded', 'false');

    // Devolver el foco al botón que abre el chat
    abrir.focus();
  }
});


// Agregar mensajes de forma segura
function agregarMensaje(texto, tipo) {
  const burbuja = document.createElement('p');
  burbuja.className = `chat-burbuja ${tipo}`;
  burbuja.textContent = texto;

  mensajes.appendChild(burbuja);
  mensajes.scrollTop = mensajes.scrollHeight;

  return burbuja;
}

// Enviar preguntas al asistente
async function enviarMensaje(texto) {
  texto = texto.trim();

  if (!texto || enviando) return;

  enviando = true;

  agregarMensaje(texto, 'usuario');

  pregunta.value = '';
  pregunta.disabled = true;

  const botonEnviar = formularioChat.querySelector('button');
  botonEnviar.disabled = true;

  // Desactivar las preguntas rápidas durante el envío
  botonesSugeridos.forEach((boton) => {
    boton.disabled = true;
  });

  // Ocultar sugerencias después de elegir una pregunta
  if (sugerencias) {
    sugerencias.hidden = true;
  }

  const espera = agregarMensaje('Escribiendo...', 'bot');

  
  try {
    const respuesta = await fetch('/api/agente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mensaje: texto
      })
    });

    const datos = await respuesta.json();

    if (respuesta.status === 429) {
      const limiteDiario = /diario/i.test(datos.error || '');

      espera.textContent = limiteDiario
        ? 'Por hoy hemos alcanzado el límite de consultas. ¡Vuelve mañana!'
        : 'Has realizado varias preguntas seguidas. Espera un minuto e inténtalo nuevamente.';

      return;
    }

    if (!respuesta.ok) {
      espera.textContent =
        'No pude completar tu consulta en este momento. Por favor, inténtalo nuevamente.';
      return;
    }

    if (
      typeof datos.respuesta !== 'string' ||
      !datos.respuesta.trim()
    ) {
      espera.textContent =
        'No recibí una respuesta completa. ¿Puedes intentarlo de nuevo?';
      return;
    }

    espera.textContent = datos.respuesta.trim();

  } catch (error) {
    espera.textContent =
      'No fue posible conectar con el asistente. Revisa tu conexión e inténtalo nuevamente.';
  }


   finally {
    enviando = false;

    pregunta.disabled = false;
    botonEnviar.disabled = false;

    botonesSugeridos.forEach((boton) => {
      boton.disabled = false;
    });

    pregunta.focus();
  }
}

// Enviar preguntas escritas
formularioChat.addEventListener('submit', (evento) => {
  evento.preventDefault();
  enviarMensaje(pregunta.value);
});

// Enviar preguntas rápidas con un clic
botonesSugeridos.forEach((boton) => {
  boton.addEventListener('click', () => {
    enviarMensaje(boton.textContent.trim());
  });
});
