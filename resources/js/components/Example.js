import React, { Component } from 'react'
import Axios from 'axios';

import { Collapse } from 'reactstrap'

const Layout = ({children}) => <div className="container">{children}</div>;

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forces: [],
      formOpen: false,
      newForce: { name: '', age: '', email: '' }
    }

    this.toggleForm = () => {
      this.setState({
        formOpen: !this.state.formOpen
      })
    }

    this.handleEdit = (force) => {
      this.setState({
        newForce: { ...force },
        formOpen: true
      })
    }

    this.submitForm = (e) => {
      e.preventDefault();

      const { id } = this.state.newForce;

      if (!!id) {
        Axios.put('/api/forces/' + id, this.state.newForce)
          .then(res => {
            this.setState({
              newForce: { name: '', age: '', email: '' },
              formOpen: false,
              forces: this.state.forces.map(x => {
                if (x.id === id) {
                  return res.data;
                }

                return x;
              })
            })
          })
      } else {
        Axios.post('/api/forces', this.state.newForce)
          .then(res => {
            this.setState({
              newForce: { name: '', age: '', email: '' },
              forces: [...this.state.forces, res.data]
            })
          })
      }
    }

    this.handleChange = e => {
      this.setState({
        newForce: {
          ...this.state.newForce,
          [e.target.name]: e.target.value
        }
      })
    }

    this.handleDelete = id => {
      Axios.delete('/api/forces/' + id)
        .then(res => {
          this.setState({
            forces: this.state.forces.filter(x => x.id !== id)
          })
        });
    }

    this.clearForm = () => {
      this.setState({
        newForce: { title: '', cover: '', body: '', categoryId: 1 },
        formOpen: false
      })
    }
  }

  componentDidMount() {
    Axios.get('/api/forces')
      .then(res => {
        this.setState({
          forces: res.data
        })
      })
  }

  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-lg-12 py-2">
            <button className="btn btn-success" onClick={this.toggleForm}>
              New Force
            </button>
          </div>
          <div className="col-lg-12">
            <Collapse isOpen={this.state.formOpen}>
              <form method="post" onSubmit={this.submitForm}>
                <div className="form-group">
                  <input name="name" required
                         value={this.state.newForce.name}
                         onChange={this.handleChange}
                         type="text" placeholder="Name"
                         className="form-control" />
                </div>
                <div className="form-group">
                  <input name="email" required
                         value={this.state.newForce.email}
                         onChange={this.handleChange}
                         type="email" placeholder="Email"
                         className="form-control" />
                </div>
                <div className="form-group">
                  <input name="age" required
                         value={this.state.newForce.age}
                         onChange={this.handleChange}
                         type="tel" placeholder="Age"
                         className="form-control" />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary">
                    Submit
                  </button>
                  <a
                    onClick={this.clearForm}
                    className="btn btn-secondary">
                    Cancel
                  </a>
                </div>
              </form>
            </Collapse>
          </div>
          <div className="col-lg-12">
            <table className="table">
              <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {
                this.state.forces.map(force => (
                  <tr key={force.id}>
                    <td>{force.name}</td>
                    <td>{force.age}</td>
                    <td>{force.email}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => this.handleEdit(force)}
                          className="btn btn-warning">Edit</button>

                        <button onClick={() => this.handleDelete(force.id)}
                                className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    )
  }
}
