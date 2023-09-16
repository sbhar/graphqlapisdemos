import React, { Component } from 'react';
import axios from 'axios';
import './App.css'; // You may need to create a corresponding CSS file for styling

const TITLE = 'GraphQL Demos';

const GET_GRAPHQL_DEMOS = `
  query {
    demos {
      url
      info {
        title
        description
        logo {
          url
        }
      }
      externalDocs {
        description
        url
      }
    }
  }
`;

class App extends Component {
  state = {
    demos: null,
    selectedDemo: null,
    errors: null,
    searchTerm: '',
    sortKey: 'title',
    isSortReverse: false,
  };

  componentDidMount() {
    this.onFetchGraphQLDemos();
  }

  onFetchGraphQLDemos = () => {
    axios.get('https://raw.githubusercontent.com/graphql-kit/graphql-apis/master/demos.json')
      .then(response => {
        this.setState({ demos: response.data });
      })
      .catch(error => {
        this.setState({ errors: error.message });
      });
  };

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  onSort = (sortKey) => {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  };

  onSelectDemo = (demo) => {
    this.setState({ selectedDemo: demo });
  };

  render() {
    const { demos, errors, searchTerm, sortKey, isSortReverse, selectedDemo } = this.state;

    const filteredDemos = demos
      ? demos.filter(demo =>
          demo.info.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

    const sortedDemos = demos
      ? filteredDemos.sort((a, b) => {
          const sortMultiplier = isSortReverse ? -1 : 1;
          return sortMultiplier * (a.info[sortKey] > b.info[sortKey] ? 1 : -1);
        })
      : [];

    return (
      <div className="App">
        <h1>{TITLE}</h1>

        {errors && (
          <p className="error">
            <strong>Something went wrong:</strong>
            {errors}
          </p>
        )}

        <div className="filter">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={this.onSearchChange}
          />
        </div>

        {sortedDemos.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => this.onSort('title')}>
                  Title
                  {sortKey === 'title' && (isSortReverse ? ' ↓' : ' ↑')}
                </th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDemos.map((demo, index) => (
                <tr key={index}>
                  <td>{demo.info.title}</td>
                  <td>{demo.info.description}</td>
                  <td>
                    <button onClick={() => this.onSelectDemo(demo)}>Show Summary</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No demos found.</p>
        )}

        {selectedDemo && (
          <div className="summary">
            <h2>Summary for "{selectedDemo.info.title}"</h2>
            <p>Description: {selectedDemo.info.description}</p>
            <a href={selectedDemo.url} target="_blank" rel="noopener noreferrer">
              Demo Link
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default App;
