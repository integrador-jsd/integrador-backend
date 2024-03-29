const db = require('../../../../../config/database');
let RoomsPerLogisticUnit = require('../../models/rooms_per_logistic_unit');

RoomsPerLogisticUnit = RoomsPerLogisticUnit(db.sequelize, db.Sequelize);

const getUnsupervisedRooms = async () => {
  const query = `SELECT Room.id AS roomID, Room.blockID, Room.sectionalID, Room.capacity, Room.type 
        FROM Room LEFT JOIN Rooms_per_Logistic_Unit AS rplu ON Room.sectionalID = rplu.sectionalID AND Room.blockID = rplu.blockID AND Room.id = rplu.roomID 
        WHERE rplu.id IS NULL;`;

  let data = await db.sequelize.query(query);
  data = JSON.parse(JSON.stringify(data[0]));

  return data;
};

const create = async (params, body) => {
  const unsupervisedRooms = await getUnsupervisedRooms();

  const isAvailable = unsupervisedRooms.find((element) => {
    if (element.sectionalID === body.sectionalID && element.blockID === body.blockID
      && element.roomID === body.roomID) {
      return element;
    }
    return null;
  });

  if (!isAvailable) {
    throw new Error('Error: room is already supervised or does not exist');
  }

  const logisticUnit = params.username;
  const { sectionalID, blockID, roomID } = body;

  RoomsPerLogisticUnit.create({
    logisticUnit, sectionalID, blockID, roomID,
  });
};

const get = async (id) => {
  const data = await RoomsPerLogisticUnit.findAll({
    where: { id },
  });
  return data[0];
};

const getByLogisticUnit = async (logisticUnit) => RoomsPerLogisticUnit.findAll({
  where: { logisticUnit },
});

const getAll = async () => RoomsPerLogisticUnit.findAll();

const remove = async (id) => {
  RoomsPerLogisticUnit.destroy({
    where: { id },
  });
};


module.exports = {
  create,
  get,
  getUnsupervisedRooms,
  getByLogisticUnit,
  getAll,
  remove,
};
