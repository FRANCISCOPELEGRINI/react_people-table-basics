import { Loader } from './components/Loader';
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useParams,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.scss';
import Person from './types/Person';

const HomePage = () => <h1 className="title">Home Page</h1>;

const getApi = () => {
  return fetch(
    'https://mate-academy.github.io/react_people-table/api/people.json',
  ).then(result => {
    if (!result.ok) {
      throw new Error('Erro no get');
    }

    return result.json();
  });
};

export const App = () => {
  const [peopleList, setPeopleList] = useState<Person>([]);
  const urlInformation = useLocation();
  const [teste, setTeste] = useState<boolean>(true);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [hasError, setHasError] = useState(false);

  const foundPathernName = (nomeDoCaba: string | boolean) => {
    const person = peopleList.find((r: Person) => r.name === nomeDoCaba);

    return person;
  };

  const NotFoundPage = () => {
    return <h1 className="title">Page not found</h1>;
  };

  const getData = async () => {
    let newData: Person = [];

    try {
      newData = await getApi();

      setPeopleList(newData);
    } catch (e: unknown) {
      setHasError(true);
    } finally {
      setIsloading(false);
    }
  };

  const PeoplePage = () => {
    const { slug } = useParams();

    useEffect(() => {
      if (teste === true) {
        getData();
      }

      setTeste(false);
    }, []);

    return (
      <div className="block">
        <h1 className="title">People Page</h1>
        <div className="box table-container">
          {!isLoading && !hasError && peopleList.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}
          {hasError && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}
          {!isLoading && !hasError ? (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {peopleList?.length > 0 && (
                  <>
                    {peopleList.map((todo: Person, index: number) => {
                      return (
                        <tr
                          data-cy="person"
                          key={index}
                          className={
                            todo.slug === slug ? 'has-background-warning' : ''
                          }
                        >
                          <td>
                            <Link
                              to={`/people/${todo.slug}`}
                              className={`${todo.sex === 'f' ? 'has-text-danger' : ''}`}
                            >
                              {todo.name}
                            </Link>
                          </td>

                          <td>{todo.sex}</td>
                          <td>{todo.born}</td>
                          <td>{todo.died}</td>

                          <td>
                            {foundPathernName(todo.motherName) ? (
                              <Link
                                to={`/people/${foundPathernName(todo.motherName)?.slug}`}
                                className="has-text-danger"
                              >
                                {todo.motherName}
                              </Link>
                            ) : (
                              todo.motherName || '-'
                            )}
                          </td>

                          <td>
                            {foundPathernName(todo.fatherName) ? (
                              <Link
                                to={`/people/${foundPathernName(todo.fatherName)?.slug}`}
                              >
                                {todo.fatherName}
                              </Link>
                            ) : (
                              todo.fatherName || '-'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    );
  };

  return (
    <div data-cy="app">
      <nav
        data-cy="nav"
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link
              to="/"
              className={`navbar-item ${urlInformation.pathname === '/' ? 'has-background-grey-lighter' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/people"
              className={`navbar-item ${urlInformation.pathname.startsWith('/people') ? 'has-background-grey-lighter' : ''}`}
            >
              People
            </Link>
          </div>
        </div>
      </nav>

      <main className="section">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/people" element={<PeoplePage />}></Route>
            <Route path="/people/:slug" element={<PeoplePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </div>
      </main>
    </div>
  );
};
