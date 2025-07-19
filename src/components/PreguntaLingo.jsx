// components/PreguntaLingo.jsx

export default function PreguntaLingo({ pregunta, onResponder }) {
  return (
    <div className="duolingo-card p-4 border rounded-md shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-2">{pregunta.texto}</h3>
      <ul className="space-y-2">
        {pregunta.opciones.map((opcion, idx) => (
          <li key={idx}>
            <button
              onClick={() => onResponder(opcion)}
              className="w-full bg-blue-100 hover:bg-blue-300 text-black py-2 px-4 rounded transition duration-200"
            >
              {opcion.texto}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
