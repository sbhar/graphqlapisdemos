import React, { Component } from 'react';
import axios from 'axios';

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
    errors: null,
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

  render() {
    const { demos, errors } = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>

        {errors && (
          <p>
            <strong>Something went wrong:</strong>
            {errors}
          </p>
        )}

        {demos && (
          <div>
            <h2>GraphQL Demos</h2>
            <ul>
              {demos.map((demo, index) => (
                <li key={index}>
                  <h3>{demo.info.title}</h3>
                  <p>{demo.info.description}</p>
                  <a href={demo.url}>Demo</a>
                  {demo.externalDocs.map((doc, i) => (
                    <a key={i} href={doc.url}>{doc.description}</a>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default App;
