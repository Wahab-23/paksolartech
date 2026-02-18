'use client';

export default function Home() {

  const users = () => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching users:', error));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={users} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Fetch Users</button>
    </div>
  );
}
