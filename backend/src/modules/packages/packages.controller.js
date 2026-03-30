const { listPackages, createPackage, updatePackage, deletePackage } = require('./packages.service');

async function getAll(req, res) {
  const packages = await listPackages();
  return res.status(200).json({ packages });
}

async function create(req, res) {
  const { title, location, description, price, durationDays, coverImage } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'title is required' });
  }

  if (price === undefined || Number.isNaN(Number(price))) {
    return res.status(400).json({ message: 'price must be a valid number' });
  }

  const newPackage = await createPackage({
    title,
    location,
    description,
    price: Number(price),
    durationDays,
    coverImage,
  });

  return res.status(201).json({ message: 'Package created', package: newPackage });
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { title, location, description, price, durationDays, coverImage } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Invalid package id' });
  }

  if (!title) {
    return res.status(400).json({ message: 'title is required' });
  }

  if (price === undefined || Number.isNaN(Number(price))) {
    return res.status(400).json({ message: 'price must be a valid number' });
  }

  const updated = await updatePackage(id, {
    title,
    location,
    description,
    price: Number(price),
    durationDays,
    coverImage,
  });

  if (!updated) {
    return res.status(404).json({ message: 'Package not found' });
  }

  return res.status(200).json({ message: 'Package updated', package: updated });
}

async function remove(req, res) {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid package id' });
  }

  const deleted = await deletePackage(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Package not found' });
  }

  return res.status(200).json({ message: 'Package deleted' });
}

module.exports = {
  getAll,
  create,
  update,
  remove,
};
