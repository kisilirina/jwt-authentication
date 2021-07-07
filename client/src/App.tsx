import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from './index';
import LoginForm from './components/LoginForm';
import { observer } from 'mobx-react-lite';
import { fetchUsers } from './services/userService';
import { IUser } from './models/IUser';

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [])

  const getUsers = async () => {
    try {
      const response = await fetchUsers();
      console.log('getUsers', response.data);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (store.isLoading) {
    return (<div> Загрузка....</div>);
  }

  return (
    store.isAuth ?
      <div>
        <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Авторизуйтесь'}</h1>
        <h1>{store.user.isActivated ? 'Аккаунт активирован' : 'Активируйте ссылку на почте!'}</h1>
        <button onClick={() => store.logout()}>Sign out</button>
        <div>
          <button
            onClick={getUsers}
          >
            Получить пользователей
          </button>
        </div>
        {
        users.map(user => <div key={user.email}>{user.email}</div>)
        }
      </div>
      : <LoginForm />
  );
}

export default observer(App);
