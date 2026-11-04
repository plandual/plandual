/* =====================================================================
 * PLAN DUAL · Relevamiento para la construcción de la normativa
 * Definición única de roles, ejes y preguntas.
 * La usan consulta.html (formulario) y tablero.html (resultados).
 * Si se cambia una pregunta, conservar su código (id) para no mezclar datos.
 * ===================================================================== */
window.RELEV = (function () {

  var EJES = {
    A: { nombre: 'Alternancia', norma: 'Régimen, duración y carga horaria' },
    B: { nombre: 'Roles y acompañamiento', norma: 'Docente tutor, instructor y coordinación' },
    C: { nombre: 'Aprendizajes y evaluación', norma: 'Capacidades, evaluación, acreditación y certificación' },
    D: { nombre: 'Cuidado y seguridad', norma: 'Seguros, ART, higiene y seguridad, días por examen' },
    E: { nombre: 'Gestión y convenios', norma: 'Convenios, documentación, tiempos y acompañamiento de la DGETyFP' },
    F: { nombre: 'Vínculo escuela–empresa', norma: 'Selección de organizaciones, beneficios y territorio' },
    G: { nombre: 'Impacto', norma: 'Inserción, continuidad de estudios y valoración' }
  };

  var ROLES = {
    directivo:  { nombre: 'Directivo/a', icono: '🏫', min: 10, desc: 'Director/a, vicedirector/a o coordinador/a de la escuela.' },
    tutor:      { nombre: 'Docente tutor/a', icono: '👩‍🏫', min: 8, desc: 'Docente de FAT, MEP o taller que acompañó a los estudiantes.' },
    empresa:    { nombre: 'Empresa u organización', icono: '🏭', min: 8, desc: 'Responsable, instructor/a o área de RR.HH.' },
    estudiante: { nombre: 'Estudiante', icono: '🎓', min: 5, desc: 'Participaste del Plan Dual. Es anónimo.' },
    familia:    { nombre: 'Familia', icono: '👨‍👩‍👧', min: 3, desc: 'Madre, padre o tutor/a de un/a estudiante. Es anónimo.' }
  };

  // Temas para la pregunta "¿Lo fija la norma o se acuerda localmente?"
  var TEMAS_NORMA = [
    { id: 'N1', txt: 'Duración total del Plan', eje: 'A' },
    { id: 'N2', txt: 'Régimen de alternancia (días o semanas en la empresa)', eje: 'A' },
    { id: 'N3', txt: 'Carga horaria diaria en la empresa', eje: 'A' },
    { id: 'N4', txt: 'Cantidad máxima de estudiantes por instructor', eje: 'B' },
    { id: 'N5', txt: 'Horas asignadas al docente tutor', eje: 'B' },
    { id: 'N6', txt: 'Criterios de evaluación y acreditación', eje: 'C' },
    { id: 'N7', txt: 'Beneficios para estudiantes (traslado, comida, ropa)', eje: 'F' }
  ];
  var OPC_NORMA = ['Lo fija la norma', 'Se acuerda escuela–empresa', 'No sé'];

  var ESCALA = ['Nada', 'Poco', 'Regular', 'Bastante', 'Totalmente'];

  // tipos: escala (1-5) · opcion · multi · numero · texto · enlace · norma
  var P = {
    directivo: [
      { id: 'DIR_EST7', tipo: 'numero', eje: 'G', txt: '¿Cuántos estudiantes de 7° año tiene la escuela en las especialidades que participan del Plan?', req: true },
      { id: 'DIR_PART', tipo: 'numero', eje: 'G', txt: '¿Cuántos participaron del Plan Dual?', req: true },
      { id: 'DIR_COMP', tipo: 'numero', eje: 'G', txt: '¿Cuántos lo completaron o están por completarlo?' },
      { id: 'DIR_REG', tipo: 'opcion', eje: 'A', txt: 'Régimen de alternancia que utilizaron', req: true,
        ops: ['Semana en la escuela / semana en la empresa', 'Días fijos por semana en la empresa (2 o 3)', 'Bloques de varias semanas', 'Combinado o variable', 'Otro'] },
      { id: 'DIR_SEM', tipo: 'numero', eje: 'A', txt: 'Duración aproximada de la práctica en la empresa (en semanas)' },
      { id: 'DIR_HS', tipo: 'opcion', eje: 'A', txt: 'Horas diarias en la empresa', ops: ['Hasta 4 horas', '5 a 6 horas', '7 a 8 horas', 'Variable'] },
      { id: 'DIR_E1', tipo: 'escala', eje: 'A', txt: 'La alternancia se pudo organizar sin afectar el resto de la cursada' },
      { id: 'DIR_E2', tipo: 'escala', eje: 'B', txt: 'Hubo docentes con horas y tiempo suficientes para el seguimiento' },
      { id: 'DIR_E3', tipo: 'escala', eje: 'F', txt: 'La articulación con la empresa fue fluida' },
      { id: 'DIR_E4', tipo: 'escala', eje: 'E', txt: 'Los convenios y la documentación fueron claros y ágiles' },
      { id: 'DIR_E5', tipo: 'escala', eje: 'E', txt: 'El acompañamiento de la DGETyFP fue suficiente' },
      { id: 'DIR_E6', tipo: 'escala', eje: 'C', txt: 'Los estudiantes desarrollaron capacidades del perfil profesional' },
      { id: 'DIR_E7', tipo: 'escala', eje: 'D', txt: 'Las condiciones de seguridad y los seguros estuvieron garantizados' },
      { id: 'DIR_REC', tipo: 'multi', eje: 'B', txt: '¿Qué recursos faltaron? (podés marcar varios)',
        ops: ['Horas docentes para la tutoría', 'Transporte de estudiantes', 'Equipamiento o elementos de protección', 'Tiempo de gestión directiva', 'Capacitación docente', 'Nada en particular'] },
      { id: 'NORMA', tipo: 'norma', eje: 'E', txt: 'Para cada tema: ¿lo debería fijar la normativa para toda la provincia o se acuerda entre cada escuela y su empresa?' },
      { id: 'DIR_OBS', tipo: 'texto', eje: 'E', txt: '¿Cuál fue el principal obstáculo y cómo lo resolvieron?', req: true },
      { id: 'DIR_MANT', tipo: 'texto', eje: 'G', txt: '¿Qué funcionó bien y debería mantenerse en la normativa?' },
      { id: 'DIR_EVID', tipo: 'enlace', eje: 'C', txt: 'Enlace a evidencias (carpeta de Drive con rúbrica, proyecto, fotos), compartida como "Cualquier persona con el enlace · Lector"' }
    ],
    tutor: [
      { id: 'TUT_FUN', tipo: 'opcion', eje: 'B', txt: 'Tu función en el Plan', req: true, ops: ['Docente de FAT', 'Maestro/a de Enseñanza Práctica (MEP)', 'Docente de taller', 'Otra'] },
      { id: 'TUT_HS', tipo: 'opcion', eje: 'B', txt: 'Horas semanales que dedicaste al seguimiento', ops: ['Menos de 2', '2 a 4', '5 a 8', 'Más de 8'] },
      { id: 'TUT_VIS', tipo: 'opcion', eje: 'B', txt: '¿Con qué frecuencia visitaste la empresa?', ops: ['Semanal', 'Quincenal', 'Mensual', 'Solo al inicio y al cierre', 'No pude visitarla'] },
      { id: 'TUT_INS', tipo: 'opcion', eje: 'C', txt: 'Instrumento de evaluación que usaron', ops: ['Rúbrica conjunta escuela–empresa', 'Rúbrica de la escuela', 'Informe del instructor', 'Portfolio o bitácora del estudiante', 'Otro'] },
      { id: 'TUT_E1', tipo: 'escala', eje: 'B', txt: 'La coordinación con el instructor de la empresa fue buena' },
      { id: 'TUT_E2', tipo: 'escala', eje: 'C', txt: 'Pude integrar lo aprendido en la empresa con los contenidos del aula' },
      { id: 'TUT_E3', tipo: 'escala', eje: 'B', txt: 'Tuve tiempo suficiente para el seguimiento' },
      { id: 'TUT_E4', tipo: 'escala', eje: 'C', txt: 'Contamos con herramientas claras para evaluar y acreditar' },
      { id: 'TUT_E5', tipo: 'escala', eje: 'A', txt: 'La alternancia permitió sostener la cursada de las demás materias' },
      { id: 'TUT_E6', tipo: 'escala', eje: 'D', txt: 'Los estudiantes trabajaron en condiciones seguras' },
      { id: 'NORMA', tipo: 'norma', eje: 'E', txt: 'Para cada tema: ¿lo debería fijar la normativa o se acuerda entre cada escuela y su empresa?' },
      { id: 'TUT_CAP', tipo: 'texto', eje: 'C', txt: '¿Qué capacidades se fortalecieron más en los estudiantes?', req: true },
      { id: 'TUT_CAMB', tipo: 'texto', eje: 'C', txt: '¿Qué cambiarías en la evaluación y la acreditación?' },
      { id: 'TUT_EVID', tipo: 'enlace', eje: 'C', txt: 'Enlace a la rúbrica o evidencias (opcional)' }
    ],
    empresa: [
      { id: 'EMP_ROL', tipo: 'opcion', eje: 'B', txt: '¿Quién responde?', req: true, ops: ['Responsable o dueño/a', 'Instructor/a', 'Recursos Humanos', 'Otro'] },
      { id: 'EMP_RUB', tipo: 'opcion', eje: 'F', txt: 'Rubro', ops: ['Metalmecánica', 'Automotriz y autopartes', 'Construcción', 'Energía y electricidad', 'Alimentos', 'Madera y muebles', 'Minería', 'Servicios', 'Otro'] },
      { id: 'EMP_TAM', tipo: 'opcion', eje: 'F', txt: 'Tamaño', ops: ['Micro (hasta 10 personas)', 'Pequeña (11 a 50)', 'Mediana (51 a 200)', 'Grande (más de 200)'] },
      { id: 'EMP_NEST', tipo: 'numero', eje: 'F', txt: 'Cantidad de estudiantes que recibieron' },
      { id: 'EMP_PRIM', tipo: 'opcion', eje: 'F', txt: '¿Era su primera experiencia recibiendo estudiantes?', ops: ['Sí', 'No'] },
      { id: 'EMP_E1', tipo: 'escala', eje: 'C', txt: 'Los estudiantes llegaron con la preparación necesaria' },
      { id: 'EMP_E2', tipo: 'escala', eje: 'F', txt: 'La comunicación con la escuela fue fluida' },
      { id: 'EMP_E3', tipo: 'escala', eje: 'D', txt: 'Las responsabilidades (seguros, ART, seguridad) fueron claras' },
      { id: 'EMP_E4', tipo: 'escala', eje: 'B', txt: 'La carga de trabajo para el instructor fue razonable' },
      { id: 'EMP_E5', tipo: 'escala', eje: 'G', txt: 'La experiencia fue beneficiosa para la empresa' },
      { id: 'EMP_E6', tipo: 'escala', eje: 'E', txt: 'Firmar el convenio fue un trámite ágil' },
      { id: 'EMP_REGP', tipo: 'opcion', eje: 'A', txt: 'Régimen de alternancia que prefieren', ops: ['Semana y semana', '2 días por semana', '3 días por semana', 'Bloques de varias semanas', 'Indistinto'] },
      { id: 'EMP_MAXI', tipo: 'opcion', eje: 'B', txt: 'Máximo razonable de estudiantes por instructor', ops: ['1 a 2', '3 a 4', '5 a 6', 'Más de 6'] },
      { id: 'EMP_BEN', tipo: 'multi', eje: 'F', txt: 'Beneficios que ofrecieron a los estudiantes', ops: ['Transporte', 'Comedor o refrigerio', 'Ropa de trabajo', 'Elementos de protección', 'Viáticos', 'Ninguno'] },
      { id: 'EMP_VOLV', tipo: 'opcion', eje: 'G', txt: '¿Volverían a participar?', req: true, ops: ['Sí', 'Sí, con cambios', 'No'] },
      { id: 'NORMA', tipo: 'norma', eje: 'E', txt: 'Para cada tema: ¿lo debería fijar la normativa o se acuerda entre cada escuela y su empresa?' },
      { id: 'EMP_GAR', tipo: 'texto', eje: 'E', txt: '¿Qué debería garantizarle la normativa a la empresa?' },
      { id: 'EMP_CAMB', tipo: 'texto', eje: 'G', txt: '¿Qué cambiarían para el próximo ciclo?' }
    ],
    estudiante: [
      { id: 'EST_E1', tipo: 'escala', eje: 'C', txt: 'Aprendí cosas nuevas de mi especialidad', req: true },
      { id: 'EST_E2', tipo: 'escala', eje: 'C', txt: 'Pude relacionar lo de la escuela con lo de la empresa' },
      { id: 'EST_E3', tipo: 'escala', eje: 'B', txt: 'Me sentí acompañado/a por mi tutor/a y el instructor/a' },
      { id: 'EST_E4', tipo: 'escala', eje: 'D', txt: 'Me sentí seguro/a trabajando en la empresa' },
      { id: 'EST_E5', tipo: 'escala', eje: 'A', txt: 'Pude seguir con las otras materias sin atrasarme' },
      { id: 'EST_E6', tipo: 'escala', eje: 'G', txt: 'La experiencia me ayudó a pensar qué hacer después de la escuela' },
      { id: 'EST_DIF', tipo: 'multi', eje: 'A', txt: '¿Qué fue lo más difícil? (podés marcar varios)', ops: ['Los traslados', 'Los horarios', 'Ponerme al día con las materias', 'Los exámenes', 'Adaptarme al trabajo', 'Nada en particular'] },
      { id: 'EST_FUT', tipo: 'opcion', eje: 'G', txt: 'Cuando termine la escuela pienso…', ops: ['Trabajar', 'Estudiar', 'Trabajar y estudiar', 'Todavía no sé'] },
      { id: 'EST_REC', tipo: 'opcion', eje: 'G', txt: '¿Le recomendarías el Plan Dual a otros estudiantes?', req: true, ops: ['Sí', 'Tal vez', 'No'] },
      { id: 'EST_CAMB', tipo: 'texto', eje: 'G', txt: 'Una cosa que cambiarías' }
    ],
    familia: [
      { id: 'FAM_E1', tipo: 'escala', eje: 'F', txt: 'Estuve informado/a sobre cómo funcionaba el Plan', req: true },
      { id: 'FAM_E2', tipo: 'escala', eje: 'G', txt: 'Vi cambios positivos en mi hijo/a' },
      { id: 'FAM_E3', tipo: 'escala', eje: 'A', txt: 'Pudimos organizar los traslados y horarios' },
      { id: 'FAM_E4', tipo: 'escala', eje: 'D', txt: 'Sentí confianza en la seguridad de la práctica' },
      { id: 'FAM_GAS', tipo: 'opcion', eje: 'F', txt: '¿Tuvieron gastos extra (traslado, comida)?', ops: ['No', 'Sí, pocos', 'Sí, importantes'] },
      { id: 'FAM_REC', tipo: 'opcion', eje: 'G', txt: '¿Lo recomendaría a otras familias?', req: true, ops: ['Sí', 'Tal vez', 'No'] },
      { id: 'FAM_SUG', tipo: 'texto', eje: 'G', txt: 'Una sugerencia' }
    ]
  };

  // Escuelas sugeridas si la pestaña "Escuelas" de la planilla está vacía
  // Escuelas postulantes y participantes del Plan Dual (sugerencias del formulario)
  var ESCUELAS_BASE = [
    "IPEA 222 \"Américo Milani\" (San Francisco)",
    "IPEA 403 \"Edith Ferri de Macías\" (Las Varas)",
    "IPEA 127 \"Dr. Mateo Carusillo\" (Villa Reducción)",
    "IPEA 33 \"Humberto Volando\" (James Craik)",
    "IPEA 209 \"Domingo F. Sarmiento\" (Marcos Juárez)",
    "IPET 50 \"Ing. Emilio F. Olmos\" (San Francisco)",
    "IPET 64 \"Malvinas Argentinas\" (Córdoba)",
    "IPET 70 \"Prof. Dr. Humberto Dionisi\" (Córdoba)",
    "IPET 110 \"Manuel Hidalgo\" (Canteras Quilpo)",
    "IPET 129 \"Héroes de Malvinas\" (Córdoba)",
    "IPET 266 \"Gral. Savio\" (Río Tercero)",
    "IPET 383 \"Nikola Tesla\" (Córdoba)",
    "IPET 430 \"Instituto Técnico Industrial Zona Norte\" (Córdoba)",
    "IPEMyT 89 \"Paula Albarracín\" (Devoto)",
    "IPEMyT 133 \"Dr. Florencio Escardó\" (Córdoba)",
    "IPEMyT 149 \"Alejandro Carbó\"",
    "IPEMyT 173 \"Gdor. Juan B. Bustos\" (Morrison)",
    "IPEMyT 203 \"Dr. Juan B. Dichiara\" (Río Cuarto)",
    "IPEMyT 246",
    "IPEMyT 297 \"Dr. René Favaloro\" (Córdoba)",
    "IPEMyT 310 \"Puerto Argentino\"",
    "IPEMyT 357 \"José Campellone\" (Córdoba)",
    "PROA San Francisco"
  ];

  // Índice código → pregunta
  var IDX = {};
  Object.keys(P).forEach(function (r) { P[r].forEach(function (q) { if (q.tipo !== 'norma') IDX[q.id] = Object.assign({ rol: r }, q); }); });
  TEMAS_NORMA.forEach(function (t) { IDX[t.id] = { id: t.id, tipo: 'normaItem', eje: t.eje, txt: t.txt }; });

  return { EJES: EJES, ROLES: ROLES, TEMAS_NORMA: TEMAS_NORMA, OPC_NORMA: OPC_NORMA, ESCALA: ESCALA, P: P, ESCUELAS_BASE: ESCUELAS_BASE, IDX: IDX };
})();
