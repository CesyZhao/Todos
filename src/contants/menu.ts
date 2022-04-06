import { MenuItem } from "../types/menu";

export enum Menu {
  Today = 'today',
  Last7Days = 'last-7-days',
  Done = 'done',
  Deleted = 'deleted',
  Overview = 'overview'
}

const MenuTitleMap = new Map([
  [Menu.Today, '今天'],
  [Menu.Last7Days, '近 7 天'],
  [Menu.Done, '已完成'],
  [Menu.Deleted, '回收站'],
  [Menu.Overview, '摘要'],
]);

const MenuIconMap = new Map([
  [Menu.Today, 'icon-schedule'],
  [Menu.Last7Days, 'icon-calendar'],
  [Menu.Done, 'icon-check'],
  [Menu.Deleted, 'icon-delete'],
  [Menu.Overview, 'icon-mind-mapping'],
]);

const menus: MenuItem[] = [
  Menu.Today,
  Menu.Last7Days,
  Menu.Done,
  Menu.Deleted,
  Menu.Overview,
].map(menu => {
  return {
    key: menu,
    icon: MenuIconMap.get(menu) || '',
    title: MenuTitleMap.get(menu) || '',
  }
})

export default menus;