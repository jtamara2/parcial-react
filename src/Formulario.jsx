import React, { useState, useEffect } from "react";
import { firebase } from "./firebase";
import { nanoid } from "nanoid";

const Formulario = () => {
  const [numero, setNumero] = useState("")
  const [gastado, setGastado] = useState("")
  const [cuotaManejo, setCuotaManejo] = useState("")
  const [saldo, setSaldo] = useState("")
  const [tipo, setTipo] = useState("C")
  const [lista, setLista] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("cards").get();
        const array = data.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setLista(array);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  });

  const guardarDatos = async (e) => {
    e.preventDefault();

    if (!numero.trim()) {
        setError("Campo numero vacío");
        return;
      }
  
      if (!tipo.trim()) {
        setError("Campo tipo vacío");
        return;
      }
      if (!`${gastado}`.trim()) {
        setError("Campo gastado vacío");
        return;
      }

      if (!`${saldo}`.trim()) {
        setError("Campo saldo vacío");
        return;
      }

      if (!`${cuotaManejo}`.trim()) {
        setError("Campo cuota de manejo vacío");
        return;
      }

    try {
      const db = firebase.firestore();
      const tarjetaNueva = {
        numero,
        gastado,
        saldo,
        cuotaManejo,
        tipo
      };
      await db.collection("cards").add(tarjetaNueva);
      setLista([
        ...lista,
        {
          id: nanoid(),
          ...tarjetaNueva
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    cancelar();
  };
  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("cards").doc(id).delete();
      const aux = lista.filter((item) => item.id !== id);
      setLista(aux);
    } catch (error) {
      console.log(error);
    }
  };

  const auxEditar = (item) => {
    setCuotaManejo(item.cuotaManejo);
    setGastado(item.gastado)
    setNumero(item.numero)
    setSaldo(item.saldo)
    setTipo(item.tipo)
    setModoEdicion(true);
    setId(item.id);
  };

  const editar = async (e) => {
    e.preventDefault();
    if (!numero.trim()) {
        setError("Campo numero vacío");
        return;
      }
  
      if (!tipo.trim()) {
        setError("Campo tipo vacío");
        return;
      }
      if (!`${gastado}`.trim()) {
        setError("Campo gastado vacío");
        return;
      }

      if (!`${saldo}`.trim()) {
        setError("Campo saldo vacío");
        return;
      }

      if (!`${cuotaManejo}`.trim()) {
        setError("Campo cuota de manejo vacío");
        return;
      }
    try {
      const db = firebase.firestore();
      await db
        .collection("cards")
        .doc(id)
        .update({
            numero,
            gastado,
            saldo,
            cuotaManejo,
            tipo
        });
    } catch (error) {
      console.log(error);
    }
    cancelar();
  };

  const cancelar = () => {
    setGastado("");
    setNumero("");
    setSaldo("")
    setTipo("C")
    setCuotaManejo("")
    setModoEdicion(false);
    setError(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">PARCIAL REACT</h1>
      
      <hr />
      <div className="row">
        <div className="col-9">
          <h4 className="text-center">Listado de tarjetas</h4>
          <table className="table table bordered text-center">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Número</th>
                <th>Saldo</th>
                <th>Cuota de manejo</th>
                <th>Tipo</th>
                <th>Gastado último mes</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item.id}>
                  <td><img src={`https://picsum.photos/200/300?random=${item.id}`} alt="logo"/></td>
                  <td>{item.numero}</td>
                  <td>{item.saldo}</td>
                  <td>{item.cuotaManejo}</td>
                  <td>{item.tipo === "C" ? "Crédito":"Débito"}</td>
                  <td>{item.gastado}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm float-end"
                      onClick={() => auxEditar(item)}
                    >
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm float-end mx-2"
                      onClick={() => eliminar(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-3">
          <h4 className="text-center">
            {modoEdicion ? "Editar tarjetas" : "Agregar tarjetas"}
          </h4>
          <form onSubmit={modoEdicion ? editar : guardarDatos}>
            {error ? <span className="text-danger">{error}</span> : null}
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Ingrese número"
              onChange={(e) => setNumero(e.target.value)}
              value={numero}
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Ingrese saldo"
              onChange={(e) => setSaldo(e.target.value)}
              value={saldo}
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Ingrese cuota de manejo"
              onChange={(e) => setCuotaManejo(e.target.value)}
              value={cuotaManejo}
            />
            <input
              className="form-control mb-2"
              type="number"
              placeholder="Ingrese gastado"
              onChange={(e) => setGastado(e.target.value)}
              value={gastado}
            />

            <label>Tipo de tarjeta</label>
            <select
              className="form-control mb-2"
              onChange={(e) => {
                setTipo(e.target.selectedOptions[0].value);
              }}
              value={tipo}
            >
              <option value={"C"}>Crédito</option>
              <option value={"D"}>Débito</option>
            </select>

            {!modoEdicion ? (
              <button className="btn btn-primary btn-block" type="submit">
                Agregar
              </button>
            ) : (
              <>
                <button className="btn btn-warning btn-block" type="submit">
                  Editar
                </button>
                <button
                  className="btn btn-dark btn-block mx-2"
                  onClick={() => cancelar()}
                >
                  Cancelar
                </button>
              </>
            )}
          </form>
        </div>
      </div>

    </div>
  );
};

export default Formulario;
