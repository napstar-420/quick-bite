const { matchedData } = require('express-validator');

const MenuItemsService = require('../services/menu-items.service');

async function getHomeMenuItems(req, res) {
  const data = matchedData(req);
  const menuItems = await MenuItemsService.getHomeMenuItems(data.c);
  res.json(menuItems);
}

async function getMenuItemsByIds(req, res) {
  const data = matchedData(req);
  const menuItems = await MenuItemsService.getMenuItemsByIds(data.ids);
  res.json(menuItems);
}

module.exports = {
  getHomeMenuItems,
  getMenuItemsByIds,
};
