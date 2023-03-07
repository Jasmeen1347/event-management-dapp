import { Outlet } from 'react-router-dom';
import useAccountStore from '../store/store'

function RequireAuth() {
  const account = useAccountStore((state) => state.account)

  // return account ? <Outlet /> : <Navigate to="/login" />;
  return account ? <Outlet /> : alert('connect to metamask');
}

export default RequireAuth