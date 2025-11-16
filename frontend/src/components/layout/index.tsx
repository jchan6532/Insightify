import { Link, Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <Link to='/' style={{ marginRight: '1rem' }}>
          Home
        </Link>
        <Link to='/login'>Login</Link>
      </nav>

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
