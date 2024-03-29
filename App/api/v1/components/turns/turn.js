const config = require('./config');
const db = require('../../../../../config/database');

let Turn = require('../../models/turn');
let Section = require('../../models/section');
let TurnState = require('../../models/turn_state');

Turn = Turn(db.sequelize, db.Sequelize);
Section = Section(db.sequelize, db.Sequelize);
TurnState = TurnState(db.sequelize, db.Sequelize);

TurnState.hasMany(Turn, { foreignKey: 'stateID' });
Turn.belongsTo(TurnState, { foreignKey: 'stateID' });
Section.hasMany(Turn, { foreignKey: 'sectionID' });
Turn.belongsTo(Section, { foreignKey: 'sectionID' });


const create = async (params, body) => {
  let { startTime, endTime } = body;
  const { stateID, sectionID } = body;
  const { username } = params;

  startTime = new Date(startTime);
  endTime = new Date(endTime);

  Turn.create({
    startTime, endTime, stateID, auxiliarID: username, sectionID,
  });
};

const get = async (id) => {
  const data = await Turn.findAll({
    where: { id },
    include: [
      { model: TurnState },
    ],
    order: [['startTime', 'ASC']],
  });
  return data[0];
};

const getByAux = async (params) => {
  const { username } = params;

  return Turn.findAll({
    where: { auxiliarID: username },
    include: [
      { model: TurnState },
    ],
    order: [['startTime', 'ASC']],
  });
};

const getByAuxForCalendar = async (params) => {
  const { username } = params;

  let turns = await Turn.findAll({
    attributes: ['id', 'startTime', 'endTime', 'auxiliarID'],
    include: [{ model: Section, required: true }],
    where: { auxiliarID: username },
    order: [['startTime', 'ASC']],
  });

  turns = JSON.parse(JSON.stringify(turns));
  turns = await config.extract(turns);

  return turns;
};

const getAll = async () => Turn.findAll();

const checkState = (actualState, newState) => {
  if (actualState === config.states.ASSIGNED) {
    if (newState === config.states.DONE) {
      return false;
    }
  }

  if (actualState === config.states.IN_PROGRESS) {
    if (newState !== config.states.DONE) {
      return false;
    }
  }

  return true;
};

const update = async (params, body) => {
  let { startTime, endTime } = body;

  const { stateID, auxiliarID } = body;
  const { turnID } = params;

  startTime = new Date(startTime);
  endTime = new Date(endTime);

  const updateArgs = {
    startTime, endTime, auxiliarID,
  };

  if (stateID) {
    const request = await get(turnID);
    const actualState = request.stateID;

    if (checkState(actualState, stateID)) {
      updateArgs.stateID = stateID;
    }
  }

  Turn.update(
    updateArgs,
    { where: { id: turnID } },
  );
};

const remove = async (id) => {
  Turn.destroy({
    where: { id },
  });
};

module.exports = {
  create,
  get,
  getByAux,
  getByAuxForCalendar,
  getAll,
  update,
  remove,
};
