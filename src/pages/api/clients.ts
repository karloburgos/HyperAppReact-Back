import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const clientes = await prisma.client.findMany();
    return res.status(200).json(clientes);
  }

  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, countryCode, birthDate, origin, relatedClient, country, membershipType, image } = req.body;

    try {
      const newClient = await prisma.client.create({
        data: {
          firstName, lastName, email, phone, countryCode, birthDate: birthDate ? new Date(birthDate) : null, origin, relatedClient, country, membershipType, image,
        },
      });
      return res.status(201).json(newClient);
    } catch (error) {
      return res.status(500).json({ error: 'Error creating client' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
