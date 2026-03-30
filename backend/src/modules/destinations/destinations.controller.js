const {
  listDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('./destinations.service');

async function getAll(req, res) {
  const destinations = await listDestinations();
  return res.status(200).json({ destinations });
}

async function getOne(req, res) {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid destination id' });
  }

  const destination = await getDestinationById(id);
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }

  return res.status(200).json({ destination });
}

async function create(req, res) {
  const { name, country, description, heroImage, bestTime, currency } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }

  const destination = await createDestination({ name, country, description, heroImage, bestTime, currency });
  return res.status(201).json({ message: 'Destination created', destination });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { name, country, description, heroImage, bestTime, currency } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Invalid destination id' });
  }

  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }

  const destination = await updateDestination(id, {
    name,
    country,
    description,
    heroImage,
    bestTime,
    currency,
  });

  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }

  return res.status(200).json({ message: 'Destination updated', destination });
}

async function remove(req, res) {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid destination id' });
  }

  const deleted = await deleteDestination(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Destination not found' });
  }

  return res.status(200).json({ message: 'Destination deleted' });
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
