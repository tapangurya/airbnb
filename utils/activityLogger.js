const SystemActivity = require("../Model/SystemActivity");

module.exports = async ({
  actorType,
  actorId,
  action,
  entityType,
  entityId,
  description,
}) => {
  try {
    await SystemActivity.create({
      actorType,
      actorId,
      action,
      entityType,
      entityId,
      description,
    });
  } catch (err) {
    console.error("Activity log failed:", err);
  }
};
