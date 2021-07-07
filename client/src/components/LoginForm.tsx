import { observer } from 'mobx-react-lite';
import React, { FC, useState, useContext } from 'react';
import { Context } from '../index';

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { store } = useContext(Context);

  return (
    <div>
      <input
        onChange={e => setEmail(e.target.value)}
        value={email}
        type="text"
        placeholder="Email"
      />
      <input
        onChange={e => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
      />
      <button onClick={() => store.login(email, password)}>SignIn</button>
      <button onClick={() => store.registration(email, password)}>SignUp</button>
    </div>
  )
}

export default observer(LoginForm);
