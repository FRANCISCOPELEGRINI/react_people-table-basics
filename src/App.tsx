// import { Loader } from './components/Loader';
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.scss';
import Person from './types/Person';

const HomePage = () => <h1 className="title">Home Page</h1>;

const PageDontFound = () => <h1 className="title">Page not found</h1>;

const getApi = () => {
  return fetch('../public/api/people.json').then(result => {
    if (!result.ok) {
      throw new Error('Erro no get');
    }

    return result.json();
  });
};

export const App = () => {
  const [peopleList, setPeopleList] = useState<Person>([]);
  const urlInformation = useLocation();
  const [navigate, setNavigate] = useState<boolean>(true);
  const possiblesUrls = ['/', '/people', '/home'];
  const changeUrl = useNavigate();

  useEffect(() => {
    if (!possiblesUrls.includes(urlInformation.pathname)) {
      changeUrl('/some/not/existing/page');
    }
  }, [urlInformation]);

  const foundPathernName = (nomeDoCaba: string | boolean) => {
    const person = peopleList.find((r: Person) => r.name === nomeDoCaba);

    return person;
  };

  const getData = async () => {
    let newData: Person = [];

    try {
      newData = await getApi();

      setPeopleList(newData);
    } catch (e: unknown) {
      throw new Error('Erro Try catch' + e);
    }
  };

  useEffect(() => {
    setNavigate(false);
  }, []);

  const PeoplePage = () => {
    useEffect(() => {
      setNavigate(false);
      getData();
    }, []);

    return (
      <div className="block">
        <h1 className="title">People Page</h1>
        <div className="box table-container">
          {/* <Loader /> */}

          <p data-cy="peopleLoadingError" className="has-text-danger">
            Something went wrong
          </p>

          <p data-cy="noPeopleMessage">There are no people on the server</p>

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
              {peopleList?.length && (
                <>
                  {peopleList.map((todo: Person, index: number) => {
                    return (
                      <tr
                        data-cy="person"
                        key={index}
                        className={
                          foundPathernName(todo.motherName) === undefined ||
                          foundPathernName(todo.fatherName === undefined)
                            ? 'has-background-warning'
                            : ''
                        }
                      >
                        <td>
                          <a
                            href={`#/people/${todo.slug}`}
                            className={`${todo.sex === 'f' ? 'has-text-danger' : ''}`}
                          >
                            {todo.name}
                          </a>
                        </td>

                        <td>{todo.sex}</td>
                        <td>{todo.born}</td>
                        <td>{todo.died}</td>

                        <td>
                          <a
                            className="has-text-danger"
                            href={`#/people/${foundPathernName(todo.motherName) !== undefined ? foundPathernName(todo.motherName).slug : ''}`}
                          >
                            {todo.motherName || '-'}
                          </a>
                        </td>

                        <td>
                          <a
                            href={`#/people/${foundPathernName(todo.fatherName) !== undefined ? foundPathernName(todo.fatherName).slug : ''}`}
                          >
                            {todo.fatherName || '-'}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div data-cy="app">
      {navigate === true && <Navigate to="/"></Navigate>}
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
              className={`navbar-item ${urlInformation.pathname === '/people' ? 'has-background-grey-lighter' : ''}`}
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
            <Route path="*" element={<PageDontFound />}></Route>
          </Routes>
        </div>
      </main>
    </div>
  );
};
