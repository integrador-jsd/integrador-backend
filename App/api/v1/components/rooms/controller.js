const httpStatus = require('http-status');
const util = require('./room');
const authorization = require('../../../../services/authorization/authorization');

const create = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresSystemAdmin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  const sectional = req.params.sectionalID;
  const block = req.params.blockID;
  const { body } = req;

  await util.create(sectional, block, body).then(
    () => res
      .status(httpStatus.CREATED)
      .send({ message: 'Created' }),
    (err) => {
      console.error(err);
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: 'Error' });
    },
  );
  return true;
};

const createMany = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresSystemAdmin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  const sectional = req.params.sectionalID;
  const block = req.params.blockID;

  const { body } = req;

  await util.createMany(sectional, block, body).then(
    () => res
      .status(httpStatus.CREATED)
      .send({ message: 'Created' }),
    (err) => {
      console.error(err);
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: 'Error' });
    },
  );
  return true;
};

const get = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresLogin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  const sectional = req.params.sectionalID;
  const number = req.params.blockID;
  const id = req.params.roomID;

  await util.get(sectional, number, id).then(
    (data) => {
      if (!data || data.length === 0) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: 'Not found' });
      }
      return res
        .status(httpStatus.OK)
        .send(data);
    },
    (err) => {
      console.error(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error' });
    },
  );
  return true;
};

const getByBlock = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresLogin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  const sectional = req.params.sectionalID;
  const block = req.params.blockID;

  await util.getByBlock(sectional, block).then(
    (data) => {
      if (!data || data.length === 0) {
        return res
          .status(httpStatus.NO_CONTENT)
          .send({ message: 'No content' });
      }
      return res
        .status(httpStatus.OK)
        .send(data);
    },
    (err) => {
      console.error(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error' });
    },
  );
  return true;
};

const getAvailableRooms = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresLogin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  const { startTime } = req.body;
  const { endTime } = req.body;

  await util.getAvailableRooms(startTime, endTime).then(
    (data) => {
      if (data.length > 0) {
        return res
          .status(httpStatus.OK)
          .send(data);
      }
      return res
        .status(httpStatus.NO_CONTENT)
        .send({ message: 'No data found' });
    },
    (err) => {
      console.error(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error' });
    },
  );
  return true;
};

const getAll = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresLogin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  await util.getAll().then(
    (data) => {
      if (data.length > 0) {
        return res
          .status(httpStatus.OK)
          .send(data);
      }
      return res
        .status(httpStatus.NO_CONTENT)
        .send({ message: 'No data found' });
    },
    (err) => {
      console.error(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error' });
    },
  );
  return true;
};

const update = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresSystemAdmin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  const { body } = req;
  const sectional = req.params.sectionalID;
  const number = req.params.blockID;
  const id = req.params.roomID;

  await util
    .update(sectional, number, id, body)
    .then(() => res
      .status(httpStatus.OK)
      .send({ message: 'Updated' }))
    .catch((err) => {
      console.error(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error' });
    });
  return true;
};

const remove = async (req, res) => {
  const idToken = req.get('idToken');
  const auth = await authorization.requiresSystemAdmin(idToken);
  if (!auth) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You are not allowed to see this content' });

  const sectional = req.params.sectionalID;
  const number = req.params.blockID;
  const id = req.params.roomID;

  await util
    .remove(sectional, number, id)
    .then((removeResponse) => {
      if (removeResponse === 0) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: 'Not found' });
      }

      return res
        .status(httpStatus.OK)
        .send({ message: 'Removed successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error' });
    });
  return true;
};

module.exports = {
  create,
  createMany,
  get,
  getByBlock,
  getAvailableRooms,
  getAll,
  update,
  remove,
};
