


  import React, {useState, useEffect} from 'react';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
  import axios  from 'axios';

function App() {
  const baseUrl="http://localhost/apiInformaticaa//";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado]= useState({
    id: '',
    modelo: '',
    ram: '',
    procesador: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);      
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("modelo", frameworkSeleccionado.modelo);
    f.append("ram", frameworkSeleccionado.ram);
    f.append("procesador", frameworkSeleccionado.procesador);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("modelo", frameworkSeleccionado.modelo);
    f.append("ram", frameworkSeleccionado.ram);
    f.append("procesador", frameworkSeleccionado.procesador);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      var dataNueva = data;
      dataNueva.map(framework=>{
        if(framework.id===frameworkSeleccionado.id){
          framework.modelo=frameworkSeleccionado.modelo;
          framework.ram=frameworkSeleccionado.ram;
          framework.procesador=frameworkSeleccionado.procesador;          
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div style={{textAlign: 'center'}}>
      <br/>
          <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
          <br/><br/>
        <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>modelo</th>
            <th>memoria ram</th>
            <th>procesador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(framework=>(
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.modelo}</td>
              <td>{framework.ram}</td>
              <td>{framework.procesador}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}

        </tbody>

        </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Datos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>modelo: </label>
            <br />
            <input type="text" className="form-control" name="modelo" onChange={handleChange}/>
            <br />
            <label>ram: </label>
            <br />
            <input type="text" className="form-control" name="ram" onChange={handleChange}/>
            <br />
            <label>procesador: </label>
            <br />
            <input type="text" className="form-control" name="procesador" onChange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
        </Modal>  

        <Modal isOpen={modalEditar}>
          <ModalHeader>Editar Datos</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>modelo: </label>
              <br />
              <input type="text" className="form-control" name="modelo" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.modelo}/>
              <br />
              <label>ram: </label>
              <br />
              <input type="text" className="form-control" name="ram" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.ram}/>
              <br />
              <label>procesador: </label>
              <br />
              <input type="text" className="form-control" name="procesador" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.procesador}/>
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
          </ModalFooter>
          </Modal>   

          <Modal isOpen={modalEliminar}>
            <ModalBody>
              ¿Estás seguro que deseas eliminar el Framework {frameworkSeleccionado && frameworkSeleccionado.nombre}?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>peticionDelete()}>Si</button>
              <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>
              
            </ModalFooter>
            </Modal>       
        
    </div>
  );


}
export default App;

