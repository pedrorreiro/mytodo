import React from 'react';
import './style.css';
import desfazer from './img/desfazer.png'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      date: '',
      displayErro: 'none',
      tipoMsg: '',
      msgErro: '',
      tasks: [],
      doneTasks: [],
      disabledButton: true
    };

  }

  componentDidMount() {
    this.getTasks();
    this.getDoneTasks();
    this.dicionario('hello');
  }

  changeName = (event) => {
    this.setState({
      name: event.target.value
    })

    if(event.target.value === ''){
        this.setState({disabledButton: true});
    }

    else{
      this.setState({disabledButton: false});
    }
  }

  dicionario = (word) => {
    const axios = require("axios");

    axios.get('https://wordsapiv1.p.rapidapi.com/words/' + word, {
      headers:{
     'x-rapidapi-key': '5550afc71bmsha08e0f1091b921bp1a3226jsn962348ec98d7',
    'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
      }
    })
      .then((response) => {
        console.log(response.data);

      });
  }

  changeDate = (event) => {
    this.setState({
      date: event.target.value
    })
  }

  changeDone = (event) => {
    this.setState({
      date: event.target.value
    })

    const idTask = event.target.id;

    const axios = require("axios");

    axios.put('https://servidortodo.herokuapp.com/disableTask/' + idTask)
      .then(((response) => {
        this.getTasks();
        this.getDoneTasks();
      }));
  }

  backTask = (event) => {

    const idTask = event.target.id;

    const axios = require("axios");

    axios.put('https://servidortodo.herokuapp.com/backTask/' + idTask)
      .then(((response) => {
        this.getTasks();
        this.getDoneTasks();
      }));
  }

  getTasks = () => {
    const axios = require("axios");

    axios.get('https://servidortodo.herokuapp.com/getTasks/')
      .then(((response) => {
        this.setState({
          tasks: response.data.tasks
        })

      }));
  }

  getDoneTasks = () => {
    const axios = require("axios");

    axios.get('https://servidortodo.herokuapp.com/getDoneTasks/')
      .then(((response) => {
        this.setState({
          doneTasks: response.data.tasks
        })

      }));
  }

  addTask = () => {
    const axios = require("axios");

    const name = this.state.name;
    const date = this.state.date;

    axios.post('https://servidortodo.herokuapp.com/addTask', {
      name: name,
      date: date
    }).then((response) => {
      this.setState({
        msgErro: response.data.msg,
        tipoMsg: response.data.tipo,
      });

      if (response.data.sucess) {
        this.setState({ displayErro: 'block' });
        this.getTasks();
      }

      else (this.setState({ displayErro: 'none' }));
    })
  }

  render() {
    return (
      <div className="wrapper">

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossOrigin="anonymous" />

        <header>
          <div id="createTask">
            <div className="form-group">
              <label><strong>Tarefa</strong></label>
              <input onChange={this.changeName} type="email" className="form-control" id="exampleInputEmail1" />
            </div>

            <div className="form-group">
              <label style={{ marginRight: 5 + 'px' }}><strong>Data</strong></label>
              <input onChange={this.changeDate} type="date" min={'2017-04-01'} required />
            </div>

            <div className={this.state.tipoMsg} role="alert" style={{ display: this.state.displayErro }}>
              {this.state.msgErro}
            </div>

            <button type="button" disabled={this.state.disabledButton} onClick={this.addTask} className="btn btn-primary">Adicionar tarefa</button>
          </div>

          <br />

          <div id="tasks">
            <p><strong>Tarefas</strong></p>

            {this.state.tasks.reverse().map((task, i) => {
              var date = task.date;
              return (
                <div id={i} className="task" key={task.name}>

                  <hr />
                  <p id="tituloTask"><strong>{task.name}</strong></p>

                  <p id="dateTask"><strong>Data: </strong>
                  {date.slice(8,10)}/{date.slice(5,7)}/{date.slice(0,4)}</p>

                  <div className="form-check">
                    <input id={task._id} onChange={this.changeDone} className="form-check-input position-static" type="checkbox" value="option1" aria-label="..." />
                    <label style={{ marginLeft: 5 + 'px' }}>Feito</label>
                  </div>

                </div>
              );
            })}
          </div>

          <br />

          <div id="doneTasks">
            <p><strong>Tarefas Realizadas</strong></p>

            {this.state.doneTasks.reverse().map((task, i) => {
              var date = task.date;

              return (
                <div id={i} className="task" key={task.name}>

                  <hr />
                  <p id="tituloTask"><strong>{task.name}</strong></p>
                  <p id="dateTask"><strong>Data: </strong>
                  {date.slice(8,10)}/{date.slice(5,7)}/{date.slice(0,4)}</p>

                  <img id={task._id} className="imgDesfazer" src={desfazer} alt="desfazer" onClick={this.backTask}/>



                </div>
              );
            })}
          </div>

        </header>

      </div>
    );

  }
}

export default App;
