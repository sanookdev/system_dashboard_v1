const { System, Category } = require("../../models");

module.exports = {
  async findBySystemid(system_id) {
    try {
      const system = await System.findOne({
        where: { id: system_id }, include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });
      const plain = system?.get({ plain: true })
      return { status: true, system: plain };
    } catch (err) {
      return { status: false, message: err.message };
    }
  },
};
