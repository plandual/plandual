/* =====================================================================
 * PLAN DUAL · Acceso con cuenta de Google
 * El navegador obtiene un token firmado por Google; el Apps Script lo
 * verifica, controla que el email esté autorizado (pestaña "Accesos")
 * y devuelve una sesión temporal (2 horas). Nunca se manejan contraseñas.
 * ===================================================================== */
window.PDAcceso = (function () {
  var KEY = 'pdSesion';

  function guardar(s) { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function leer() { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function borrar() { try { sessionStorage.removeItem(KEY); } catch (e) {} }

  function post(datos) {
    var body = new URLSearchParams(datos);
    body.set('fuente', 'web-plandual');
    return fetch(PD.SCRIPT_URL, { method: 'POST', body: body })
      .then(function (r) { return r.json(); })
      .catch(function () { throw new Error('No se pudo conectar con el servidor. Probá de nuevo en unos minutos.'); });
  }

  /** Llamada autenticada: agrega la sesión. Si venció, la borra. */
  function llamar(datos) {
    var s = leer();
    datos = Object.assign({}, datos, { ses: s ? s.ses : '' });
    return post(datos).then(function (j) {
      if (!j.ok && j.vencida) { borrar(); }
      return j;
    });
  }

  /** Dibuja el acceso dentro de `el`: botón de Google (si está configurado)
   *  y, siempre, ingreso con un código que llega al Gmail de la persona. */
  function boton(el, alEntrar, alError) {
    function ok(j) {
      if (!j.ok) throw new Error(j.error || 'No autorizado');
      guardar({ ses: j.ses, email: j.email, nombre: j.nombre, tablero: j.tablero, administra: j.administra });
      alEntrar(leer());
    }
    el.innerHTML =
      '<div style="display:grid;gap:12px;width:100%;max-width:360px;margin:0 auto;text-align:left">' +
      (PD.GOOGLE_CLIENT_ID ? '<div id="pdG" style="display:flex;justify-content:center"></div><div style="text-align:center;color:#5A6685;font-size:13px">o con un código por email</div>' : '') +
      '<form id="pdF1" style="display:grid;gap:8px"><label for="pdEmail" style="font-size:12px;letter-spacing:1.4px;font-weight:900;color:#5A6685">TU CUENTA DE GMAIL</label>' +
      '<input id="pdEmail" type="email" required autocomplete="email" placeholder="nombre@gmail.com" style="font:inherit;border:1.5px solid #E3E8F2;border-radius:10px;padding:11px 13px">' +
      '<button style="font:900 15px Lato,sans-serif;background:#1B2E5E;color:#fff;border:0;border-radius:10px;padding:12px;cursor:pointer">Enviarme un código</button></form>' +
      '<form id="pdF2" hidden style="display:grid;gap:8px"><label for="pdCod" style="font-size:12px;letter-spacing:1.4px;font-weight:900;color:#5A6685">CÓDIGO QUE TE LLEGÓ AL EMAIL</label>' +
      '<input id="pdCod" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required placeholder="000000" style="font:900 24px Lato,sans-serif;letter-spacing:8px;text-align:center;border:1.5px solid #E3E8F2;border-radius:10px;padding:10px">' +
      '<button style="font:900 15px Lato,sans-serif;background:#C55A11;color:#fff;border:0;border-radius:10px;padding:12px;cursor:pointer">Ingresar</button>' +
      '<button type="button" id="pdOtro" style="font:700 13px Lato,sans-serif;background:none;border:0;color:#5A6685;cursor:pointer;text-decoration:underline">Usar otro email</button></form></div>';
    var f1 = el.querySelector('#pdF1'), f2 = el.querySelector('#pdF2'), email = '';
    f1.onsubmit = function (e) {
      e.preventDefault(); email = el.querySelector('#pdEmail').value.trim().toLowerCase();
      var b = f1.querySelector('button'); b.disabled = true; b.textContent = 'Enviando…'; alError('');
      post({ accion: 'pedirCodigo', email: email }).then(function (j) {
        if (!j.ok) throw new Error(j.error);
        f1.hidden = true; f2.hidden = false; el.querySelector('#pdCod').focus();
        alError('Si ' + email + ' está autorizada, te llegó un código (revisá también Spam). Vence en 10 minutos.');
      }).catch(function (e) { alError(e.message); }).then(function () { b.disabled = false; b.textContent = 'Enviarme un código'; });
    };
    f2.onsubmit = function (e) {
      e.preventDefault(); var b = f2.querySelector('button'); b.disabled = true; alError('');
      post({ accion: 'validarCodigo', email: email, codigo: el.querySelector('#pdCod').value }).then(ok)
        .catch(function (e) { alError(e.message); }).then(function () { b.disabled = false; });
    };
    el.querySelector('#pdOtro').onclick = function () { f2.hidden = true; f1.hidden = false; alError(''); };

    if (!PD.GOOGLE_CLIENT_ID) return;
    function init() {
      google.accounts.id.initialize({
        client_id: PD.GOOGLE_CLIENT_ID, ux_mode: 'popup', auto_select: false,
        callback: function (resp) {
          alError('');
          post({ accion: 'loginGoogle', id_token: resp.credential }).then(ok).catch(function (e) { alError(e.message); });
        }
      });
      google.accounts.id.renderButton(el.querySelector('#pdG'), { theme: 'filled_blue', size: 'large', text: 'signin_with', shape: 'pill', locale: 'es', width: 300 });
    }
    if (window.google && google.accounts && google.accounts.id) return init();
    var sc = document.createElement('script');
    sc.src = 'https://accounts.google.com/gsi/client'; sc.async = true; sc.defer = true; sc.onload = init;
    document.head.appendChild(sc);
  }

  function salir() {
    var s = leer();
    if (s) post({ accion: 'salir', ses: s.ses }).catch(function () {});
    borrar();
    try { google.accounts.id.disableAutoSelect(); } catch (e) {}
  }

  return { boton: boton, llamar: llamar, sesion: leer, salir: salir, post: post };
})();
