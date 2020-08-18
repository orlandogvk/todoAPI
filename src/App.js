import React,{Component} from "react";
import "./App.css";
import Loading from './components/Loading';
import Login from './components/forms/Login';
import SignUser from './components/forms/SignUser';
import NuevaTarea from './components/forms/NuevaTarea';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import DatePicker, {registerLocale} from "react-datepicker";
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FindInPageRoundedIcon from '@material-ui/icons/FindInPageRounded';


registerLocale('es', es)

class App extends Component {
  constructor(){
    super();
    this.state={
      showView: "spinner",
      users:[],
      tasks:[],
      copyTasks:[],
      editTasks:{},
      mensaje:"",
      mensajeTarea:"",
      typeSelected:"",
      types:['Ayer','Hoy','Mañana','Semana pasada','Semana proxima','Completadas','No completadas'],
      open:false,
      chkbox:false
    }
  }
  
  componentDidMount(){
    setTimeout(() => {
      this.setState({showView: "login"});
      this.obtenerDatosUser();
    }, 5000)
    
  }
 
  obtenerDatosUser = () => {
    let moments=moment();
    console.log(moments)
   let  url ='/users'
   fetch(url)
   .then(response => (response.json())) 
   .then(results => {
     this.setState({ users : results.results })
   console.log(this.state.users)
   })
   .catch(error => console.log('Error:',error)); 
 }

registrarUsuarios=(event)=>{
  if(event.target.name.value!=="" && event.target.lastname.value !=="" && event.target.email.value!=="" && event.target.password.value!==""){
    event.preventDefault();
    //Agregar una petición POST
    let  url = '/register '
    let content = {
      name: event.target.name.value,
      lastname: event.target.lastname.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    let form=event.target;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(content)
    })
      .then(response =>response.json())
      .catch(error => console.error('Error:',error))
      .then(results => {
        this.setState({mensaje:results})
        //alert(this.state.mensaje.message)
        this.setState({showView: "spinner"});
        setTimeout(() => {
          toast(this.state.mensaje.message)
          this.setState({showView: "login"});
          this.obtenerDatosUser();
        }, 3000)
        
        //this.setState({showView: "login"})
      });
      form.reset();
  }else{
    //alert("Datos incompletos");
    toast("Datos incompletos");
  }

}

iraPanel=()=>{
  this.setState({showView: "app"});
}

//notify = () => toast(message);

buscarUsuarios=(event)=>{
  if(event.target.email.value!=="" && event.target.password.value!==""){
    event.preventDefault();
    //Agregar una petición POST al login
    let  url = '/login '
    let content = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    let form=event.target;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(content)
    })

      .then(response => {
        if(response.ok){
          this.obtenerDatosTareas()
          this.iraPanel()
        }
        return response.json()
        })
      .then(data =>{console.log(data)
        this.setState({mensaje:data.message})
        toast(this.state.mensaje)
      })
      .catch(error => {console.error('Error: ',error);});
      form.reset();
  }else{
    toast("Datos incompletos");
    event.preventDefault();
  }
}

handleInput = event => {
  const { target: { name, value } } = event
  this.setState({ [name]: value })
};

handleInputlogin = event => {

  this.setState({ [event.target.name]: event.target.value });
  this.setState({ correo: event.target.value });
  this.setState({ clave: event.target.value });
};

  //GESTION DE TAREAS
  //GET
  obtenerDatosTareas = () => {

   let  url = '/tasks'
   fetch(url)
   .then(response => response.json())   //Regresa una promesa para poder transformar/interpretar esos datos en formato json
   .then(results => {
     this.setState({ tasks : results.results })
     console.log(this.state.tasks)
     /* let fecha=new Date(this.state.tasks.date)
     console.log(fecha.toLocaleDateString()) */
     }) //Respuesta de la petición que ya podremos manejar con javascript
   .catch(error => console.log(error));  
 }

//ACCIONES DE LAS TAREAS CRUD

handleInputTask = event => {
  this.setState({ [event.target.name]: event.target.value });
};
crearTarea=(event)=>{
    if(event.target.content.value!=="" && event.target.date.value!==""){
      event.preventDefault();
      console.log("Hola soy una nueva tarea")
         //Agregar una petición POST
      let url='/tasks '
      let cont={
        content:event.target.content.value,
        date:event.target.date.value
      }
       let form=event.target;
       fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(cont)
      })
      .then(response => response.json())
      .then(results => {
       console.log(results)
       this.setState({mensajeTarea:results.message})
       // alert(this.state.mensajeTarea)
        toast(this.state.mensajeTarea)
        this.obtenerDatosTareas();
       })
      .catch(error => console.log(error));
      form.reset();
    }else{
      //alert("No pueden haber campos vacíos");
      toast("No pueden haber campos vacíos")
      event.preventDefault();
    }
     
}

//ACTUALIZAR TAREA

actualizarTarea=(e,_id)=>{
  e.preventDefault();
  console.log("Hola soy una tarea modificada")
  console.log(_id)

         //Modificar una petición PUT
      this.setState({editTasks:this.state.copyTasks.find(task=>task._id ===_id)},()=>{ let url='/tasks/'
      fetch(`${url}${_id}`, {
       method: "PUT",
       body: JSON.stringify(this.state.editTasks),
       headers: {
         "Content-Type": "application/json; charset=UTF-8"
       },
     })
     .then(response => response.json())
     .then(results => {
      console.log(results)
      this.setState({mensajeTarea:results.message})
      // alert(this.state.mensajeTarea)
       toast(this.state.mensajeTarea)
       this.obtenerDatosTareas();
      })
     .catch(error => console.log(error));
    })     
}

//ELIMINAR TAREA
eliminarTarea=(_id)=>{
  if(window.confirm('Esta seguro de eliminar el registro?')){
    
    let url= '/tasks/'
   
    fetch(`${url}${_id}`, {
        method: "DELETE"
      })
      .catch(err => console.error(err))
      .then(() => {
      
          let copyTask=[...this.state.tasks]
          let updatedCopy = copyTask.filter(item=>item._id !== _id)
          this.setState({ tasks:updatedCopy })
          console.log(copyTask)
          this.obtenerDatosTareas();
      })
        
  }
}

logout = () => {
  this.setState({ showView: "login" });
};

register=()=>{
  this.setState({ showView: "register" });
}
//habilitar o deshabilitar el item de tareas a editar
handleClick=(_id)=>{
 //console.log("Hola me vas a editar")

 //Metodo find para poder obtener el objeto que se desea modificar de acuerdo con el id recibido por parte del ususario
 let taskItem=this.state.tasks.find(task=>task._id === _id);

 //Buscarmos el indice del objeto que deseamos deshabilitar
 let taskIndex=this.state.tasks.findIndex(task=>task._id === _id);
 //Deshabilitamos el item para poder modificar su contenido
 taskItem.disabled=!taskItem.disabled;
//Actualizamos el item deshabilitado en el estado Tasks
 let taskArray=this.state.tasks
 taskArray[taskIndex]=taskItem;
 this.setState({ tasks: taskArray, copyTasks:taskArray });
}

//Editamos el contenido del item para poder capturar la información
editContent=(_id,e)=>{
  //Metodo find para poder obtener el objeto que se desea modificar de acuerdo con el id recibido por parte del ususario
 let taskItem=this.state.tasks.find(task=>task._id === _id);

 //Buscarmos el indice del objeto que deseamos modificar
 let taskIndex=this.state.tasks.findIndex(task=>task._id === _id);
  //Modificamos el contenido de la tarea
  taskItem.content=e.target.value;
  console.log(taskItem.content)
 //Actualizamos el contenido modificado en el estado Tasks
 let taskArray=this.state.tasks
 taskArray[taskIndex]=taskItem;
 this.setState({ tasks: taskArray, copyTasks:taskArray});
}

handleEditDate = (e, _id) => {    

  //Buscar el id dentro del arreglo tareas para poder modificar la fecha
  let taskItem = this.state.tasks.find( task => task._id === _id);
  //Buscar el indice donde se encuentra el elemento que coincida con el id
  let taskIndex = this.state.tasks.findIndex( task => task._id === _id);
  //Modificar la fecha con la fecha que recibimos
  //taskItem.date = date;
  taskItem.date = e.target.value;
  //Usamos un arreglo temporal para poder modificar el objeto en el indice que obtuvimos previamente
  let taskArray = this.state.tasks;
  taskArray[taskIndex] = taskItem;
  this.setState({tasks: taskArray, copyTasks: taskArray});
}

 handleTypeSelect=(e)=>{
  this.setState({typeSelected:e.target.value})
  console.log(this.state.typeSelected)
} 

 handleClose = () => {
  this.setState({open:false});
};

handleOpen = () => {
  this.setState({open:true});
};

formatDate = (date) => {
  let newDate = new Date(date).toLocaleDateString();
  let dateArray = newDate.split("/");
  let day =
    Number(dateArray[0]) < 10 ? "0" + dateArray[0] : dateArray[0].toString();
  let month =
    Number(dateArray[1]) < 10 ? "0" + dateArray[1] : dateArray[1].toString();
  let year = dateArray[2];
  newDate = `${year}-${month}-${day}`;
  return newDate;
};


handleChangeChk=(e,_id)=>{
  console.log(_id)
  let taskItem = this.state.tasks.find( task => task._id === _id);
  let taskIndex = this.state.tasks.findIndex( task => task._id === _id);
  taskItem.is_completed= e.target.checked;
  console.log('array ',taskItem.is_completed)
  let taskArray = this.state.tasks;
  taskArray[taskIndex] = taskItem;
  this.setState({tasks: taskArray, copyTasks: taskArray});
  this.setState({ chkbox: e.target.checked }, () => {
    console.log('state box ',this.state.chkbox);
  }); 
}


//Filter SELECT con moment.js

 selectTasks=(task)=>{

  let today = moment()
  let yesterday=moment().subtract(1, 'day');
  let tomorrow=moment().add(1,'day');
  let endOfWeek = moment().endOf("week");
  let startOfNextWeek =moment(endOfWeek).add(1, "seconds");
  let endOfNextWeek = moment(endOfWeek).add(7, "days");
  let startOfLastWeek=moment().startOf('week').subtract(8,'day')
  let endOfLastWeek=moment().endOf('week').subtract(6,'day')

  switch(this.state.typeSelected){
    case "Ayer":
          console.log("funcion fecha ayer");
          console.log(task.date)
          if (moment(task.date).isSame(yesterday, "day")) {
            return true;
          }
          return false;
    case "Hoy":
          console.log("funcion fecha hoy");
          console.log(task.date)
          if (moment(task.date).isSame(today, "day")) {
            return true;
          }
          return false;
    case "Mañana":
          console.log("funcion fecha mañana");
          console.log(task.date)
          if (moment(task.date).isSame(tomorrow, "day")) {
            return true;
          }
          return false;
    case "Semana pasada":
          console.log("funcion fecha Semana pasada");
          if (moment(task.date).isBetween(startOfLastWeek,endOfLastWeek)) {
            return true;
          }
          return false;
    case "Semana proxima":
          console.log("funcion fecha Semana proxima");
          if (moment(task.date).isBetween(startOfNextWeek,endOfNextWeek)) {
            return true;
          }
          return false;
    case "Completadas":
          console.log("funcion completadas");
          if (task.is_completed) {
            return true;
          }
          return false;
    case "No completadas":
          console.log("funcion no completadas");
              if (!task.is_completed) {
                return true;
              }
              return false;
    default:
      return true;   
  } 
 }

  render(){
    switch(this.state.showView){
      case "spinner":
        return (
        <div className="App">
        <Loading />
       </div>
       )
       case "login":
         return(
          <div className="App">
             <Login
             title="Inicio de sesion"
             input={this.handleInputlogin}
             login={this.buscarUsuarios}
             registrar={this.register} />
           
             <ToastContainer />
         </div>
         )
       case "register":
         return(
          <div className="App">
          <SignUser 
          title="Registro de usuarios"
          input={this.handleInput}
          newUser={this.registrarUsuarios}
          login={this.logout} />
          <ToastContainer />
         </div>
         )  
       case "app":
               
          return(
          <div className="App">
            <NuevaTarea
              title={"Agregar tarea"}
              input={this.handleInputTask}
              newTask={this.crearTarea}
              logout={this.logout}
              />
            
              {console.log(this.state.tasks)}
              <div className="filters">
              <FindInPageRoundedIcon/>
              <h4>Buscar tareas</h4>
                  <FormControl>

                        <InputLabel id="demo-controlled-open-select-label">Escoger</InputLabel>
                        <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={this.state.open}
                          onClose={this.handleClose}
                          onOpen={this.handleOpen}
                          value={this.state.typeSelected}
                          onChange={this.handleTypeSelect}
                        >
                          <MenuItem key={0} value="Todas">
                            <em>Todas</em>
                          </MenuItem>
                            {
                              this.state.types.map((type,index)=>{
                                return(
                                  <MenuItem key={index+1} value={type}>{type}</MenuItem>
                                )
                              })
                            }
                        </Select>
                  </FormControl>
                  <ToastContainer />
            </div>

            {/* <Form className={`form-flebox ${props.completed ? 'task-completed' : '' }`}> */}
            <TableContainer component={Paper} className="table">
            <Table aria-label="simple table">
              <TableHead>
                  <TableRow>
                    <TableCell>Tareas</TableCell>
                    <TableCell align="right">Fecha</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                { 
                   this.state.tasks.filter((task)=>this.selectTasks(task)).map((task)=>{
                     return(
                      <TableRow key={task._id}>
                      <TableCell component="th" scope="row">
                       <input type="text" name="content" onChange={(e)=>this.editContent(task._id,e)} value={task.content} disabled={!task.disabled}/>
                       {
                            !task.disabled?<div></div>: <label><input type="checkbox" defaultChecked={this.state.chkbox} onChange={(e)=>this.handleChangeChk(e,task._id)}/>Terminada</label>
                      }
                      {/* <p className={`${this.state.chkbox ?'text-red':'text'}`}>{this.formatDate(task.date)}</p> */}
                      <p>{this.formatDate(task.date)}</p>
                      </TableCell>
                      <TableCell align="right">
                      <input type="date" name="date" onChange={(e)=>this.handleEditDate(e,task._id)} value={this.formatDate(task.date)} disabled={!task.disabled}/></TableCell>
                      <TableCell align="right">
                          {
                            !task.disabled?<div></div>:<Button onClick={(e)=>this.actualizarTarea(e,task._id)} variant="contained" color="primary"><SaveIcon/></Button>
                          }
                       </TableCell>
                      <TableCell align="right"><Button onClick={()=>this.handleClick(task._id)} variant="contained" color="primary"><CreateIcon/></Button></TableCell>
                      <TableCell align="right"><Button onClick={()=>this.eliminarTarea(task._id)} variant="contained" color="secondary"><DeleteIcon /></Button></TableCell>
                    </TableRow>
                     );
                   })  
                }
              </TableBody>
            </Table>
            </TableContainer>
            <ToastContainer />
          </div>
        )              
         default:
        return (
          <div className="App">
             <Login
             title="Inicio de sesion"
             input={this.handleInputlogin}
             login={this.buscarUsuarios} />
            <ToastContainer />
         </div>
        );
    }

  }
  
}

export default App;
