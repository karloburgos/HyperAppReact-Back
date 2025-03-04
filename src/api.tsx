const API_URL = "http://127.0.0.1:8000/clientes";

export async function obtenerClientes() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function crearCliente(cliente: any) {
  const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
  });

  if (!res.ok) {
      throw new Error('Failed to create client');
  }

  return res.json();
}
